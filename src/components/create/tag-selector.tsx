'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import { DEFAULT_TAGS } from '@/lib/constants'
import { Label } from '@/components/ui/label'

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  maxTags?: number
}

export function TagSelector({ selectedTags, onChange, maxTags = 10 }: TagSelectorProps) {
  const [customTag, setCustomTag] = useState('')

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (
      trimmedTag &&
      !selectedTags.includes(trimmedTag) &&
      selectedTags.length < maxTags
    ) {
      onChange([...selectedTags, trimmedTag])
      setCustomTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const handleCustomTagSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTag(customTag)
  }

  const availableTags = DEFAULT_TAGS.filter(tag => !selectedTags.includes(tag))

  return (
    <div className="space-y-4">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">
            Selected Tags ({selectedTags.length}/{maxTags})
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-3 py-1 text-sm"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Custom Tag Input */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2">
          Add Custom Tag
        </Label>
        <form onSubmit={handleCustomTagSubmit} className="flex gap-2">
          <Input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Enter custom tag..."
            className="flex-1"
            maxLength={20}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!customTag.trim() || selectedTags.length >= maxTags}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Suggested Tags */}
      {availableTags.length > 0 && (
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">
            Suggested Tags
          </Label>
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 20).map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                onClick={() => addTag(tag)}
                disabled={selectedTags.length >= maxTags}
                className="text-sm"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        Add relevant tags to help others discover your work. You can add up to {maxTags} tags.
      </p>
    </div>
  )
} 