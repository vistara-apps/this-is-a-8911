import React, { useState } from 'react'
import { Share2, Copy, MessageCircle, Mail, Sparkles } from 'lucide-react'
import { OpenAIService } from '../services/api'

export default function ShareButton({ 
  content, 
  title = 'Shield Rights', 
  variant = 'default',
  encounterData = null,
  userState = null,
  enableAIGeneration = false 
}) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')

  const generateAIContent = async () => {
    if (!enableAIGeneration || !encounterData || !userState) return

    setIsGenerating(true)
    try {
      const aiContent = await OpenAIService.generateShareableContent(encounterData, userState)
      setGeneratedContent(aiContent)
    } catch (error) {
      console.error('AI content generation failed:', error)
      alert('Failed to generate content. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async (method) => {
    const contentToShare = generatedContent || content
    const shareText = `${title}\n\n${contentToShare}\n\nGet the app: shieldrights.app`
    
    switch (method) {
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({
              title,
              text: shareText
            })
          } catch (error) {
            console.error('Error sharing:', error)
          }
        } else {
          // Fallback to copy
          await navigator.clipboard.writeText(shareText)
          alert('Copied to clipboard!')
        }
        break
        
      case 'copy':
        await navigator.clipboard.writeText(shareText)
        alert('Copied to clipboard!')
        break
        
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(shareText)}`)
        break
        
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText)}`)
        break
    }
  }

  if (variant === 'iconOnly') {
    return (
      <button
        onClick={() => handleShare('native')}
        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
      >
        <Share2 size={18} className="text-white" />
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <h4 className="text-white font-medium text-sm">Share This Information</h4>
      
      {enableAIGeneration && (
        <div className="mb-3">
          <button
            onClick={generateAIContent}
            disabled={isGenerating}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-accent hover:bg-yellow-500 text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate AI Summary</span>
              </>
            )}
          </button>
          {generatedContent && (
            <div className="mt-2 p-3 bg-white/10 rounded-lg">
              <p className="text-white text-sm">{generatedContent}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleShare('native')}
          className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white text-sm"
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
        
        <button
          onClick={() => handleShare('copy')}
          className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white text-sm"
        >
          <Copy size={16} />
          <span>Copy</span>
        </button>
        
        <button
          onClick={() => handleShare('sms')}
          className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white text-sm"
        >
          <MessageCircle size={16} />
          <span>Text</span>
        </button>
        
        <button
          onClick={() => handleShare('email')}
          className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white text-sm"
        >
          <Mail size={16} />
          <span>Email</span>
        </button>
      </div>
    </div>
  )
}
