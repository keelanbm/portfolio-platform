'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, closeOnEscape])

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement
      
      // Focus the modal container
      setTimeout(() => {
        modalRef.current?.focus()
      }, 100)
    } else if (previousActiveElement.current) {
      // Restore focus to the previously focused element
      previousActiveElement.current.focus()
      previousActiveElement.current = null
    }
  }, [isOpen])

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  // Size configurations
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full',
  }

  if (!isOpen) return null

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={handleOverlayClick}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background-overlay/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`
            relative w-full ${sizeClasses[size]} ${size === 'full' ? 'h-full max-h-full' : 'max-h-[90vh]'} 
            bg-background-primary ${size === 'full' ? 'rounded-none' : 'rounded-modal'} shadow-modal
            overflow-hidden animate-scale-in
            focus:outline-none
          `}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-border-primary">
              {title && (
                <h2 id="modal-title" className="text-xl font-semibold text-text-primary">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="ml-auto h-8 w-8 p-0 hover:bg-background-secondary"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )

  // Render modal using portal
  return createPortal(modalContent, document.body)
}

// Hook for managing modal state
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)
  const toggleModal = () => setIsOpen(!isOpen)

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  }
}