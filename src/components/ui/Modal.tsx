'use client'

import { Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  confirmText?: string
  onConfirm?: () => void
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Enhanced Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              'relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden',
              'w-full',
              sizeClasses[size]
            )}
          >
            {/* Enhanced Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                {title && (
                  <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                )}
                {showCloseButton && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-3 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                )}
              </div>
            )}
            
            {/* Enhanced Content */}
            <div className="p-8">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function AlertModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  confirmText = 'OK',
  onConfirm
}: AlertModalProps) {
  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    info: Info
  }

  const colors = {
    success: {
      icon: 'text-green-600',
      iconBg: 'bg-gradient-to-br from-green-100 to-green-200',
      button: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-green-600/25',
      border: 'border-green-200',
      headerBg: 'bg-gradient-to-r from-green-50 to-green-100'
    },
    warning: {
      icon: 'text-amber-600',
      iconBg: 'bg-gradient-to-br from-amber-100 to-amber-200',
      button: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-600/25',
      border: 'border-amber-200',
      headerBg: 'bg-gradient-to-r from-amber-50 to-amber-100'
    },
    error: {
      icon: 'text-red-600',
      iconBg: 'bg-gradient-to-br from-red-100 to-red-200',
      button: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-600/25',
      border: 'border-red-200',
      headerBg: 'bg-gradient-to-r from-red-50 to-red-100'
    },
    info: {
      icon: 'text-blue-600',
      iconBg: 'bg-gradient-to-br from-blue-100 to-blue-200',
      button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-600/25',
      border: 'border-blue-200',
      headerBg: 'bg-gradient-to-r from-blue-50 to-blue-100'
    }
  }

  const Icon = icons[type]
  const colorScheme = colors[type]

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  // Format message to handle line breaks
  const formatMessage = (msg: string) => {
    return msg.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < msg.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative bg-white rounded-2xl shadow-2xl border-2 w-full max-w-lg overflow-hidden",
              "backdrop-blur-sm bg-white/95",
              colorScheme.border
            )}
          >
            {/* Header with gradient background */}
            <div className={cn("px-8 py-6 border-b border-gray-100", colorScheme.headerBg)}>
              <div className="flex items-start gap-4">
                <div className={cn(
                  "rounded-2xl p-4 shadow-lg ring-1 ring-white/20",
                  colorScheme.iconBg
                )}>
                  <Icon className={cn('h-8 w-8', colorScheme.icon)} />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{title}</h3>
                  <div className="text-gray-700 text-base leading-relaxed">
                    {formatMessage(message)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer with action button */}
            <div className="px-8 py-6 bg-gray-50/50">
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  className={cn(
                    "px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200",
                    "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
                    "focus:outline-none focus:ring-4 focus:ring-offset-2",
                    colorScheme.button
                  )}
                >
                  {confirmText}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function ConfirmModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  onConfirm
}: ConfirmModalProps) {
  const colors = {
    danger: {
      confirmButton: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-600/25',
      icon: 'text-red-600',
      iconBg: 'bg-gradient-to-br from-red-100 to-red-200',
      border: 'border-red-200',
      headerBg: 'bg-gradient-to-r from-red-50 to-red-100'
    },
    warning: {
      confirmButton: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-600/25',
      icon: 'text-amber-600',
      iconBg: 'bg-gradient-to-br from-amber-100 to-amber-200',
      border: 'border-amber-200',
      headerBg: 'bg-gradient-to-r from-amber-50 to-amber-100'
    },
    info: {
      confirmButton: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-600/25',
      icon: 'text-blue-600',
      iconBg: 'bg-gradient-to-br from-blue-100 to-blue-200',
      border: 'border-blue-200',
      headerBg: 'bg-gradient-to-r from-blue-50 to-blue-100'
    }
  }

  const colorScheme = colors[type]

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  // Format message to handle line breaks
  const formatMessage = (msg: string) => {
    return msg.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < msg.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative bg-white rounded-2xl shadow-2xl border-2 w-full max-w-lg overflow-hidden",
              "backdrop-blur-sm bg-white/95",
              colorScheme.border
            )}
          >
            {/* Header with gradient background */}
            <div className={cn("px-8 py-6 border-b border-gray-100", colorScheme.headerBg)}>
              <div className="flex items-start gap-4">
                <div className={cn(
                  "rounded-2xl p-4 shadow-lg ring-1 ring-white/20",
                  colorScheme.iconBg
                )}>
                  <AlertTriangle className={cn('h-8 w-8', colorScheme.icon)} />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{title}</h3>
                  <div className="text-gray-700 text-base leading-relaxed">
                    {formatMessage(message)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer with action buttons */}
            <div className="px-8 py-6 bg-gray-50/50">
              <div className="flex justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {cancelText}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  className={cn(
                    "px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200",
                    "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
                    "focus:outline-none focus:ring-4 focus:ring-offset-2",
                    colorScheme.confirmButton
                  )}
                >
                  {confirmText}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}