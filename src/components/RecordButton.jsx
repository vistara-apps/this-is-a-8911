import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause } from 'lucide-react'

export default function RecordButton({ 
  variant = 'inactive', 
  onRecordingComplete,
  disabled = false 
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState(null)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioURL(audioUrl)
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob)
        }
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)
      
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Unable to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getButtonStyles = () => {
    if (disabled) {
      return 'bg-gray-500/50 cursor-not-allowed'
    }
    
    switch (variant) {
      case 'recording':
      case isRecording:
        return 'bg-red-500 hover:bg-red-600 animate-pulse'
      case 'active':
        return 'bg-primary hover:bg-blue-600'
      default:
        return 'bg-white/20 hover:bg-white/30'
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${getButtonStyles()}`}
      >
        {isRecording ? (
          <Square size={32} className="text-white" />
        ) : (
          <Mic size={32} className="text-white" />
        )}
      </button>
      
      {isRecording && (
        <div className="text-white text-center">
          <div className="text-lg font-mono">{formatTime(duration)}</div>
          <div className="text-sm opacity-75">Recording...</div>
        </div>
      )}
      
      {audioURL && !isRecording && (
        <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
          <button
            onClick={togglePlayback}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {isPlaying ? (
              <Pause size={16} className="text-white" />
            ) : (
              <Play size={16} className="text-white ml-0.5" />
            )}
          </button>
          <span className="text-white text-sm">Recording saved</span>
          <audio
            ref={audioRef}
            src={audioURL}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}