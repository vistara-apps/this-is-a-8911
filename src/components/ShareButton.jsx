import React from 'react'
import { Share2, Copy, MessageCircle, Mail } from 'lucide-react'

export default function ShareButton({ 
  content, 
  title = 'Shield Rights', 
  variant = 'default' 
}) {
  const handleShare = async (method) => {
    const shareText = `${title}\n\n${content}\n\nGet the app: shieldrights.app`
    
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