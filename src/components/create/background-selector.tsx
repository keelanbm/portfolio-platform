'use client'

import { useState, useCallback } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Palette, Wand2, Paintbrush } from 'lucide-react'

interface BackgroundSelectorProps {
  backgroundColor?: string
  gradientColors?: string[]
  backgroundStyle: 'AUTO' | 'SOLID' | 'GRADIENT'
  onBackgroundChange: (data: {
    backgroundColor?: string
    gradientColors?: string[]
    backgroundStyle: 'AUTO' | 'SOLID' | 'GRADIENT'
  }) => void
  coverImage?: string
}

// Predefined color palette for quick selection
const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#F59E0B', // Amber
  '#10B981', // Emerald
]

// Predefined gradient combinations
const PRESET_GRADIENTS = [
  ['#667eea', '#764ba2'], // Blue to Purple
  ['#f093fb', '#f5576c'], // Pink to Red
  ['#4facfe', '#00f2fe'], // Blue to Cyan
  ['#43e97b', '#38f9d7'], // Green to Cyan
  ['#fa709a', '#fee140'], // Pink to Yellow
  ['#a8edea', '#fed6e3'], // Cyan to Pink
  ['#ff9a9e', '#fecfef'], // Coral to Pink
  ['#667eea', '#764ba2'], // Purple Haze
  ['#ffecd2', '#fcb69f'], // Peach
  ['#a8caba', '#5d4e75'], // Sage to Purple
  ['#ff8a80', '#ea80fc'], // Red to Purple
  ['#84fab0', '#8fd3f4'], // Green to Blue
]

export function BackgroundSelector({
  backgroundColor,
  gradientColors,
  backgroundStyle,
  onBackgroundChange,
  coverImage,
}: BackgroundSelectorProps) {
  const [customColor, setCustomColor] = useState(backgroundColor || '#3B82F6')
  const [customGradientStart, setCustomGradientStart] = useState(gradientColors?.[0] || '#667eea')
  const [customGradientEnd, setCustomGradientEnd] = useState(gradientColors?.[1] || '#764ba2')

  const handleStyleChange = useCallback((style: 'AUTO' | 'SOLID' | 'GRADIENT') => {
    if (style === 'AUTO') {
      onBackgroundChange({
        backgroundStyle: 'AUTO',
      })
    } else if (style === 'SOLID') {
      onBackgroundChange({
        backgroundColor: customColor,
        backgroundStyle: 'SOLID',
      })
    } else if (style === 'GRADIENT') {
      onBackgroundChange({
        gradientColors: [customGradientStart, customGradientEnd],
        backgroundStyle: 'GRADIENT',
      })
    }
  }, [customColor, customGradientStart, customGradientEnd, onBackgroundChange])

  const handlePresetColorSelect = useCallback((color: string) => {
    setCustomColor(color)
    if (backgroundStyle === 'SOLID') {
      onBackgroundChange({
        backgroundColor: color,
        backgroundStyle: 'SOLID',
      })
    }
  }, [backgroundStyle, onBackgroundChange])

  const handlePresetGradientSelect = useCallback((colors: string[]) => {
    setCustomGradientStart(colors[0])
    setCustomGradientEnd(colors[1])
    if (backgroundStyle === 'GRADIENT') {
      onBackgroundChange({
        gradientColors: colors,
        backgroundStyle: 'GRADIENT',
      })
    }
  }, [backgroundStyle, onBackgroundChange])

  const handleCustomColorChange = useCallback((color: string) => {
    setCustomColor(color)
    if (backgroundStyle === 'SOLID') {
      onBackgroundChange({
        backgroundColor: color,
        backgroundStyle: 'SOLID',
      })
    }
  }, [backgroundStyle, onBackgroundChange])

  const handleGradientColorChange = useCallback((start: string, end: string) => {
    setCustomGradientStart(start)
    setCustomGradientEnd(end)
    if (backgroundStyle === 'GRADIENT') {
      onBackgroundChange({
        gradientColors: [start, end],
        backgroundStyle: 'GRADIENT',
      })
    }
  }, [backgroundStyle, onBackgroundChange])

  const getPreviewStyle = useCallback(() => {
    if (backgroundStyle === 'SOLID' && backgroundColor) {
      return { backgroundColor }
    } else if (backgroundStyle === 'GRADIENT' && gradientColors?.length === 2) {
      return {
        background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
      }
    } else {
      // AUTO or fallback
      return { backgroundColor: '#f3f4f6' }
    }
  }, [backgroundStyle, backgroundColor, gradientColors])

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-semibold text-text-primary mb-3 block">
          Background Style
        </Label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={backgroundStyle === 'AUTO' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStyleChange('AUTO')}
            className="flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            Auto Detect
          </Button>
          <Button
            type="button"
            variant={backgroundStyle === 'SOLID' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStyleChange('SOLID')}
            className="flex items-center gap-2"
          >
            <Palette className="w-4 h-4" />
            Solid Color
          </Button>
          <Button
            type="button"
            variant={backgroundStyle === 'GRADIENT' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStyleChange('GRADIENT')}
            className="flex items-center gap-2"
          >
            <Paintbrush className="w-4 h-4" />
            Gradient
          </Button>
        </div>
      </div>

      {/* Style Description */}
      <div className="text-sm text-text-secondary">
        {backgroundStyle === 'AUTO' && (
          <p>The background will be automatically detected from your cover image for optimal contrast.</p>
        )}
        {backgroundStyle === 'SOLID' && (
          <p>Choose a solid color background for your project cards in the feed.</p>
        )}
        {backgroundStyle === 'GRADIENT' && (
          <p>Select a gradient background to make your project cards stand out in the feed.</p>
        )}
      </div>

      {/* Preview Card */}
      <Card className="overflow-hidden">
        <div 
          className="h-32 flex items-center justify-center relative"
          style={getPreviewStyle()}
        >
          {coverImage ? (
            <div className="w-20 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-xs text-gray-600 font-medium">Preview</span>
            </div>
          ) : (
            <div className="text-white text-sm font-medium opacity-80">
              Background Preview
            </div>
          )}
        </div>
      </Card>

      {/* Solid Color Options */}
      {backgroundStyle === 'SOLID' && (
        <div className="space-y-4">
          <Label className="text-sm font-medium text-text-primary">
            Solid Color Options
          </Label>
          
          {/* Preset Colors */}
          <div>
            <div className="text-xs text-text-secondary mb-2">Quick Select:</div>
            <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    backgroundColor === color
                      ? 'border-accent-primary shadow-lg ring-2 ring-accent-primary/30'
                      : 'border-border-primary hover:border-accent-primary/50'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handlePresetColorSelect(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center gap-3">
            <Label htmlFor="custom-color" className="text-xs text-text-secondary min-w-0 shrink-0">
              Custom:
            </Label>
            <input
              id="custom-color"
              type="color"
              value={customColor}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              className="w-12 h-8 rounded border border-border-primary cursor-pointer"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              className="flex-1 px-3 py-1 text-xs border border-border-primary rounded bg-background-tertiary text-text-primary"
              placeholder="#3B82F6"
            />
          </div>
        </div>
      )}

      {/* Gradient Options */}
      {backgroundStyle === 'GRADIENT' && (
        <div className="space-y-4">
          <Label className="text-sm font-medium text-text-primary">
            Gradient Options
          </Label>
          
          {/* Preset Gradients */}
          <div>
            <div className="text-xs text-text-secondary mb-2">Quick Select:</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {PRESET_GRADIENTS.map((colors, index) => (
                <button
                  key={index}
                  type="button"
                  className={`h-8 rounded-lg border-2 transition-all hover:scale-105 ${
                    gradientColors?.[0] === colors[0] && gradientColors?.[1] === colors[1]
                      ? 'border-accent-primary shadow-lg ring-2 ring-accent-primary/30'
                      : 'border-border-primary hover:border-accent-primary/50'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
                  }}
                  onClick={() => handlePresetGradientSelect(colors)}
                  title={`${colors[0]} → ${colors[1]}`}
                />
              ))}
            </div>
          </div>

          {/* Custom Gradient Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-text-secondary min-w-0 shrink-0">Start:</Label>
              <input
                type="color"
                value={customGradientStart}
                onChange={(e) => handleGradientColorChange(e.target.value, customGradientEnd)}
                className="w-8 h-6 rounded border border-border-primary cursor-pointer"
              />
              <input
                type="text"
                value={customGradientStart}
                onChange={(e) => handleGradientColorChange(e.target.value, customGradientEnd)}
                className="flex-1 px-2 py-1 text-xs border border-border-primary rounded bg-background-tertiary text-text-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-text-secondary min-w-0 shrink-0">End:</Label>
              <input
                type="color"
                value={customGradientEnd}
                onChange={(e) => handleGradientColorChange(customGradientStart, e.target.value)}
                className="w-8 h-6 rounded border border-border-primary cursor-pointer"
              />
              <input
                type="text"
                value={customGradientEnd}
                onChange={(e) => handleGradientColorChange(customGradientStart, e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-border-primary rounded bg-background-tertiary text-text-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Pro Badge for Premium Styles */}
      {(backgroundStyle === 'GRADIENT') && (
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Badge variant="outline" className="text-xs">
            ✨ Premium
          </Badge>
          <span>Advanced background options available to Pro users</span>
        </div>
      )}
    </div>
  )
}