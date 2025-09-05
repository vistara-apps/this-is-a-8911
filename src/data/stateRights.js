export const stateRights = {
  CA: {
    stateId: 'CA',
    stateName: 'California',
    keyRights: `• You have the right to remain silent
• You have the right to refuse searches without a warrant
• You have the right to ask if you are free to leave
• You have the right to record police interactions
• You have the right to an attorney`,
    doNotSay: `• "I didn't do anything wrong" - implies guilt about something
• "You can search my car/house" - waives your rights
• "I'm not from around here" - can be used against you
• Details about where you're going or coming from
• Anything about drugs, weapons, or illegal activity`,
    specificLaws: `• Penal Code 148(a)(1) - Obstructing officers is a misdemeanor
• Vehicle Code 40502 - You must sign traffic citations
• Civil Code 52.1 - Right to record in public spaces
• Penal Code 832.7 - Police misconduct records disclosure`,
    scripts: {
      en: {
        traffic_stop: "Officer, I'm going to remain silent and I would like to speak to an attorney. Am I free to leave?",
        search_request: "I do not consent to any searches. I'm exercising my right to remain silent.",
        detention: "Am I under arrest or am I free to leave? I'm invoking my right to remain silent and my right to an attorney."
      },
      es: {
        traffic_stop: "Oficial, voy a permanecer en silencio y me gustaría hablar con un abogado. ¿Soy libre de irme?",
        search_request: "No consiento a ningún registro. Estoy ejerciendo mi derecho a permanecer en silencio.",
        detention: "¿Estoy arrestado o soy libre de irme? Estoy invocando mi derecho a permanecer en silencio y mi derecho a un abogado."
      }
    }
  },
  NY: {
    stateId: 'NY',
    stateName: 'New York',
    keyRights: `• You have the right to remain silent
• You have the right to refuse searches without a warrant
• You have the right to ask if you are free to leave
• You have the right to record police interactions
• You have the right to an attorney`,
    doNotSay: `• "I didn't do anything wrong" - can imply guilt
• "You can search" - waives constitutional rights
• Personal information beyond name (in some cases)
• Details about your activities or whereabouts
• Admissions about any illegal substances or activities`,
    specificLaws: `• CPL 140.50 - Stop and frisk procedures
• CPL 215.50 - Criminal contempt charges
• Civil Rights Law 79-p - Right to record police
• Executive Law 837-t - Police body camera requirements`,
    scripts: {
      en: {
        traffic_stop: "Officer, I'm exercising my right to remain silent and I want to speak to a lawyer. Am I free to go?",
        search_request: "I do not consent to any search. I'm remaining silent and want an attorney.",
        detention: "Am I being detained or am I free to leave? I'm invoking my Fifth Amendment rights."
      },
      es: {
        traffic_stop: "Oficial, estoy ejerciendo mi derecho a permanecer en silencio y quiero hablar con un abogado. ¿Puedo irme?",
        search_request: "No consiento a ningún registro. Me mantengo en silencio y quiero un abogado.",
        detention: "¿Estoy detenido o soy libre de irme? Estoy invocando mis derechos de la Quinta Enmienda."
      }
    }
  },
  TX: {
    stateId: 'TX',
    stateName: 'Texas',
    keyRights: `• You have the right to remain silent
• You have the right to refuse searches without a warrant
• You have the right to ask if you are free to leave
• You have the right to record police interactions
• You have the right to an attorney`,
    doNotSay: `• "I'm just trying to get home" - provides unnecessary information
• "You can look in my car" - waives your rights
• "I only had a couple drinks" - admission of guilt
• Details about your destination or activities
• Anything about weapons or controlled substances`,
    specificLaws: `• Transportation Code 521.025 - Driver license requirements
• Code of Criminal Procedure 15.22 - Search incident to arrest
• Civil Practice and Remedies Code 108.002 - Recording rights
• Penal Code 38.15 - Interference with police duties`,
    scripts: {
      en: {
        traffic_stop: "Officer, I'm going to exercise my right to remain silent and I'd like to speak with an attorney. May I leave?",
        search_request: "I don't consent to searches. I'm staying silent and want a lawyer.",
        detention: "Am I under arrest or free to go? I'm invoking my constitutional rights to silence and counsel."
      },
      es: {
        traffic_stop: "Oficial, voy a ejercer mi derecho a permanecer en silencio y me gustaría hablar con un abogado. ¿Puedo irme?",
        search_request: "No consiento a registros. Me quedo en silencio y quiero un abogado.",
        detention: "¿Estoy arrestado o libre de irme? Estoy invocando mis derechos constitucionales al silencio y a un abogado."
      }
    }
  }
}

export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
]