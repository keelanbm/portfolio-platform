'use client'

import { useState, useRef, useCallback, useEffect, KeyboardEvent, ChangeEvent } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

interface MentionSuggestion {
  id: string
  username: string
  name: string
  avatar?: string
}

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  maxLength?: number
  rows?: number
  disabled?: boolean
  onMention?: (mention: MentionSuggestion) => void
}

const MIN_QUERY_LENGTH = 1

export function MentionInput({
  value,
  onChange,
  placeholder = 'Type @ to mention someone...',
  className = '',
  maxLength,
  rows = 3,
  disabled = false,
  onMention,
}: MentionInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [suggestions, setSuggestions] = useState<MentionSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionStart, setMentionStart] = useState(-1)
  const [loading, setLoading] = useState(false)

  // Fetch mention suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/mentions/suggestions?q=${encodeURIComponent(query)}&limit=5`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error('Error fetching mention suggestions:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle text change and detect mention triggers
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursorPosition = e.target.selectionStart

    onChange(newValue)

    // Find mention trigger before cursor
    const textBeforeCursor = newValue.slice(0, cursorPosition)
    const mentionMatch = textBeforeCursor.match(/@([a-zA-Z0-9._-]*)$/)

    if (mentionMatch) {
      const query = mentionMatch[1]
      const start = cursorPosition - mentionMatch[0].length

      setMentionStart(start)
      setMentionQuery(query)
      setShowSuggestions(true)
      setSelectedIndex(0)
      fetchSuggestions(query)
    } else {
      setShowSuggestions(false)
      setSuggestions([])
      setMentionQuery('')
      setMentionStart(-1)
    }
  }

  // Handle suggestion selection
  const selectSuggestion = useCallback((suggestion: MentionSuggestion) => {
    if (mentionStart === -1 || !textareaRef.current) return

    const textarea = textareaRef.current
    const beforeMention = value.slice(0, mentionStart)
    const afterMention = value.slice(mentionStart + mentionQuery.length + 1) // +1 for the @ symbol
    const mentionText = `@${suggestion.username}`
    
    const newValue = beforeMention + mentionText + ' ' + afterMention
    onChange(newValue)

    // Move cursor after the mention
    const newCursorPosition = mentionStart + mentionText.length + 1
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPosition, newCursorPosition)
    }, 0)

    setShowSuggestions(false)
    setSuggestions([])
    setMentionQuery('')
    setMentionStart(-1)

    // Notify parent component
    onMention?.(suggestion)
  }, [value, mentionStart, mentionQuery, onChange, onMention])

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % suggestions.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length)
        break
      case 'Enter':
        if (suggestions[selectedIndex]) {
          e.preventDefault()
          selectSuggestion(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowSuggestions(false)
        break
      case 'Tab':
        if (suggestions[selectedIndex]) {
          e.preventDefault()
          selectSuggestion(suggestions[selectedIndex])
        }
        break
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full resize-none rounded-lg border border-border-primary bg-background-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 ${className}`}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
      />

      {/* Mention Suggestions Dropdown */}
      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-3 text-center text-text-muted">
                <div className="animate-pulse">Loading suggestions...</div>
              </div>
            ) : suggestions.length === 0 && mentionQuery.length >= MIN_QUERY_LENGTH ? (
              <div className="p-3 text-center text-text-muted">
                No users found for &ldquo;@{mentionQuery}&rdquo;
              </div>
            ) : suggestions.length > 0 ? (
              <div className="max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id}
                    onClick={() => selectSuggestion(suggestion)}
                    className={`flex items-center space-x-3 px-3 py-2 cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? 'bg-accent-primary/10 text-accent-primary'
                        : 'hover:bg-background-tertiary text-text-primary'
                    }`}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={suggestion.avatar} />
                      <AvatarFallback className="text-xs">
                        {suggestion.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">@{suggestion.username}</div>
                      {suggestion.name !== suggestion.username && (
                        <div className="text-xs text-text-muted truncate">{suggestion.name}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}