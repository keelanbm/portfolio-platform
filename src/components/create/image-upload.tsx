'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react'
import { formatBytes } from '@/utils/format'

interface ImageUploadProps {
  onUpload: (files: File[]) => void
  maxFiles: number
  maxFileSize: number
  acceptedTypes: string[]
  coverImageIndex?: number
  onCoverImageSelect?: (index: number) => void
}

export function ImageUpload({ 
  onUpload, 
  maxFiles, 
  maxFileSize, 
  acceptedTypes, 
  coverImageIndex = 0,
  onCoverImageSelect 
}: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`
    }
    
    if (file.size > maxFileSize) {
      return `File size ${formatBytes(file.size)} exceeds maximum of ${formatBytes(maxFileSize)}`
    }

    return null
  }, [acceptedTypes, maxFileSize])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    const newErrors: string[] = []
    
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errors.forEach((error: any) => {
        if (error.code === 'file-too-large') {
          newErrors.push(`${file.name}: File too large`)
        } else if (error.code === 'file-invalid-type') {
          newErrors.push(`${file.name}: Invalid file type`)
        } else {
          newErrors.push(`${file.name}: ${error.message}`)
        }
      })
    })

    // Validate accepted files
    acceptedFiles.forEach(file => {
      const error = validateFile(file)
      if (error) {
        newErrors.push(`${file.name}: ${error}`)
      }
    })

    // Filter out files with errors
    const validFiles = acceptedFiles.filter(file => !validateFile(file))
    
    // Check file count limit
    if (uploadedFiles.length + validFiles.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} files allowed`)
    }

    setErrors(newErrors)

    if (newErrors.length === 0 && validFiles.length > 0) {
      const newFiles = [...uploadedFiles, ...validFiles]
      setUploadedFiles(newFiles)
      onUpload(newFiles)
    }
  }, [uploadedFiles, maxFiles, onUpload, validateFile])

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onUpload(newFiles)
    
    // If we're removing the cover image, reset to first image
    if (onCoverImageSelect && index === coverImageIndex) {
      onCoverImageSelect(0)
    } else if (onCoverImageSelect && index < coverImageIndex) {
      // Adjust cover image index if we removed an image before it
      onCoverImageSelect(coverImageIndex - 1)
    }
  }

  const handleCoverImageSelect = (index: number) => {
    if (onCoverImageSelect) {
      onCoverImageSelect(index)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxFileSize,
    maxFiles: maxFiles - uploadedFiles.length,
  })

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-accent-primary bg-accent-primary/10'
            : 'border-border-secondary hover:border-border-accent'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-text-secondary mb-4" />
        <p className="text-lg font-medium text-text-primary mb-2">
          {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-text-secondary mb-4">
          or click to select files
        </p>
        <div className="text-xs text-text-muted space-y-1">
          <p>Supported formats: JPEG, PNG, WebP</p>
          <p>Maximum file size: {formatBytes(maxFileSize)}</p>
          <p>Maximum files: {maxFiles}</p>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-accent-error/10 border border-accent-error/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-accent-error mb-2">Upload Errors:</h4>
          <ul className="text-sm text-accent-error/80 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Uploaded Files Preview with Cover Selection */}
      {uploadedFiles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-text-primary">
              Uploaded Images ({uploadedFiles.length}/{maxFiles})
            </h4>
            <span className="text-xs text-text-secondary">
              Click checkbox to set cover image
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((file, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    />
                    
                    {/* Cover Image Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCoverImageSelect(index)
                      }}
                      className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        coverImageIndex === index
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {coverImageIndex === index && (
                        <Check className="w-3 h-3" />
                      )}
                    </button>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    {/* Cover Image Badge */}
                    {coverImageIndex === index && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="text-xs bg-blue-600 text-white">
                          Cover
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-text-primary truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {uploadedFiles.length < maxFiles && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const input = document.querySelector('input[type="file"]') as HTMLInputElement
            input?.click()
          }}
          className="w-full"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Add More Images
        </Button>
      )}
    </div>
  )
} 