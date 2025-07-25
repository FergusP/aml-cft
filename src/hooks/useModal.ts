'use client'

import { useState, useCallback } from 'react'

interface UseModalReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export function useModal(initialState = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle
  }
}

interface AlertModalState {
  isOpen: boolean
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  onConfirm?: () => void
}

interface UseAlertModalReturn extends AlertModalState {
  showAlert: (params: Omit<AlertModalState, 'isOpen'>) => void
  close: () => void
}

export function useAlertModal(): UseAlertModalReturn {
  const [state, setState] = useState<AlertModalState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: undefined
  })

  const showAlert = useCallback((params: Omit<AlertModalState, 'isOpen'>) => {
    setState({
      ...params,
      isOpen: true
    })
  }, [])

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }))
  }, [])

  return {
    ...state,
    showAlert,
    close
  }
}

interface ConfirmModalState {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  onConfirm?: () => void
}

interface UseConfirmModalReturn extends ConfirmModalState {
  showConfirm: (params: Omit<ConfirmModalState, 'isOpen'>) => void
  close: () => void
}

export function useConfirmModal(): UseConfirmModalReturn {
  const [state, setState] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning',
    onConfirm: undefined
  })

  const showConfirm = useCallback((params: Omit<ConfirmModalState, 'isOpen'>) => {
    setState({
      ...params,
      isOpen: true
    })
  }, [])

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }))
  }, [])

  return {
    ...state,
    showConfirm,
    close
  }
}