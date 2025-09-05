-- Shield Rights Database Schema
-- This file contains the complete database schema for Supabase
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    selected_state VARCHAR(2) NOT NULL DEFAULT 'CA',
    subscription_status VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'cancelled')),
    subscription_expiry TIMESTAMP WITH TIME ZONE,
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- State rights table
CREATE TABLE IF NOT EXISTS state_rights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    state_id VARCHAR(2) NOT NULL UNIQUE,
    state_name VARCHAR(100) NOT NULL,
    key_rights TEXT NOT NULL,
    do_not_say TEXT NOT NULL,
    specific_laws TEXT NOT NULL,
    scripts JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Encounter records table
CREATE TABLE IF NOT EXISTS encounter_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    record_id UUID NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    state_id VARCHAR(2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    audio_file_path TEXT,
    notes TEXT,
    shared_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_state_rights_state_id ON state_rights(state_id);
CREATE INDEX IF NOT EXISTS idx_encounter_records_user_id ON encounter_records(user_id);
CREATE INDEX IF NOT EXISTS idx_encounter_records_state_id ON encounter_records(state_id);
CREATE INDEX IF NOT EXISTS idx_encounter_records_timestamp ON encounter_records(timestamp);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounter_records ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Encounter records policies
CREATE POLICY "Users can view own encounters" ON encounter_records
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own encounters" ON encounter_records
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own encounters" ON encounter_records
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- State rights are publicly readable
CREATE POLICY "State rights are publicly readable" ON state_rights
    FOR SELECT USING (true);

-- Insert initial state rights data
INSERT INTO state_rights (state_id, state_name, key_rights, do_not_say, specific_laws, scripts) VALUES
('CA', 'California', 
 '• You have the right to remain silent
• You have the right to refuse searches without a warrant
• You have the right to ask if you are free to leave
• You have the right to record police interactions
• You have the right to an attorney',
 '• "I didn''t do anything wrong" - implies guilt about something
• "You can search my car/house" - waives your rights
• "I''m not from around here" - can be used against you
• Details about where you''re going or coming from
• Anything about drugs, weapons, or illegal activity',
 '• Penal Code 148(a)(1) - Obstructing officers is a misdemeanor
• Vehicle Code 40502 - You must sign traffic citations
• Civil Code 52.1 - Right to record in public spaces
• Penal Code 832.7 - Police misconduct records disclosure',
 '{
   "en": {
     "traffic_stop": "Officer, I''m going to remain silent and I would like to speak to an attorney. Am I free to leave?",
     "search_request": "I do not consent to any searches. I''m exercising my right to remain silent.",
     "detention": "Am I under arrest or am I free to leave? I''m invoking my right to remain silent and my right to an attorney."
   },
   "es": {
     "traffic_stop": "Oficial, voy a permanecer en silencio y me gustaría hablar con un abogado. ¿Soy libre de irme?",
     "search_request": "No consiento a ningún registro. Estoy ejerciendo mi derecho a permanecer en silencio.",
     "detention": "¿Estoy arrestado o soy libre de irme? Estoy invocando mi derecho a permanecer en silencio y mi derecho a un abogado."
   }
 }'::jsonb),

('NY', 'New York',
 '• You have the right to remain silent
• You have the right to refuse searches without a warrant
• You have the right to ask if you are free to leave
• You have the right to record police interactions
• You have the right to an attorney',
 '• "I didn''t do anything wrong" - can imply guilt
• "You can search" - waives constitutional rights
• Personal information beyond name (in some cases)
• Details about your activities or whereabouts
• Admissions about any illegal substances or activities',
 '• CPL 140.50 - Stop and frisk procedures
• CPL 215.50 - Criminal contempt charges
• Civil Rights Law 79-p - Right to record police
• Executive Law 837-t - Police body camera requirements',
 '{
   "en": {
     "traffic_stop": "Officer, I''m exercising my right to remain silent and I want to speak to a lawyer. Am I free to go?",
     "search_request": "I do not consent to any search. I''m remaining silent and want an attorney.",
     "detention": "Am I being detained or am I free to leave? I''m invoking my Fifth Amendment rights."
   },
   "es": {
     "traffic_stop": "Oficial, estoy ejerciendo mi derecho a permanecer en silencio y quiero hablar con un abogado. ¿Puedo irme?",
     "search_request": "No consiento a ningún registro. Me mantengo en silencio y quiero un abogado.",
     "detention": "¿Estoy detenido o soy libre de irme? Estoy invocando mis derechos de la Quinta Enmienda."
   }
 }'::jsonb),

('TX', 'Texas',
 '• You have the right to remain silent
• You have the right to refuse searches without a warrant
• You have the right to ask if you are free to leave
• You have the right to record police interactions
• You have the right to an attorney',
 '• "I''m just trying to get home" - provides unnecessary information
• "You can look in my car" - waives your rights
• "I only had a couple drinks" - admission of guilt
• Details about your destination or activities
• Anything about weapons or controlled substances',
 '• Transportation Code 521.025 - Driver license requirements
• Code of Criminal Procedure 15.22 - Search incident to arrest
• Civil Practice and Remedies Code 108.002 - Recording rights
• Penal Code 38.15 - Interference with police duties',
 '{
   "en": {
     "traffic_stop": "Officer, I''m going to exercise my right to remain silent and I''d like to speak with an attorney. May I leave?",
     "search_request": "I don''t consent to searches. I''m staying silent and want a lawyer.",
     "detention": "Am I under arrest or free to go? I''m invoking my constitutional rights to silence and counsel."
   },
   "es": {
     "traffic_stop": "Oficial, voy a ejercer mi derecho a permanecer en silencio y me gustaría hablar con un abogado. ¿Puedo irme?",
     "search_request": "No consiento a registros. Me quedo en silencio y quiero un abogado.",
     "detention": "¿Estoy arrestado o libre de irme? Estoy invocando mis derechos constitucionales al silencio y a un abogado."
   }
 }'::jsonb);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_state_rights_updated_at BEFORE UPDATE ON state_rights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for audio files (if using Supabase Storage)
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-recordings', 'audio-recordings', false);

-- Storage policies for audio recordings
CREATE POLICY "Users can upload their own audio files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'audio-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own audio files" ON storage.objects
    FOR SELECT USING (bucket_id = 'audio-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own audio files" ON storage.objects
    FOR DELETE USING (bucket_id = 'audio-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);
