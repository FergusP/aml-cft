'use client'

import { Bell, Search, ChevronDown, AlertTriangle, Info, Activity, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Notification {
  id: number
  type: 'high_risk' | 'alert' | 'info'
  message: string
  timestamp: Date
  read: boolean
}

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'high_risk', message: 'Terdeteksi wallet risiko tinggi: 0x742d...E8E0', timestamp: new Date(Date.now() - 1000 * 60 * 5), read: false },
    { id: 2, type: 'alert', message: 'Volume transaksi anomali di BSC', timestamp: new Date(Date.now() - 1000 * 60 * 15), read: false },
    { id: 3, type: 'info', message: 'Laporan harian tersedia', timestamp: new Date(Date.now() - 1000 * 60 * 30), read: true },
  ])
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Close notification dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Add new notification every 30 seconds for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now(),
        type: Math.random() > 0.5 ? 'high_risk' : 'alert',
        message: `New alert: Suspicious activity detected`,
        timestamp: new Date(),
        read: false
      }
      setNotifications(prev => [newNotification, ...prev].slice(0, 10))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'high_risk':
        return AlertTriangle
      case 'alert':
        return Activity
      default:
        return Info
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari wallet address, transaction hash..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const value = (e.target as HTMLInputElement).value
                if (value) {
                  window.location.href = `/wallet?search=${value}`
                }
              }
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {format(currentTime, 'EEEE, d MMMM yyyy', { locale: id })}
          </p>
          <p className="text-xs text-gray-500">
            {format(currentTime, 'HH:mm:ss')} WIB
          </p>
        </div>

        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-96 rounded-lg bg-white shadow-lg border border-gray-200"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Mark all as read
                  </button>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type)
                      return (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={cn(
                            "flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100",
                            !notification.read && "bg-blue-50"
                          )}
                        >
                          <div className={cn(
                            "rounded-lg p-2",
                            notification.type === 'high_risk' ? "bg-red-100" :
                            notification.type === 'alert' ? "bg-yellow-100" : "bg-blue-100"
                          )}>
                            <Icon className={cn(
                              "h-4 w-4",
                              notification.type === 'high_risk' ? "text-red-600" :
                              notification.type === 'alert' ? "text-yellow-600" : "text-blue-600"
                            )} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: id })}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
                
                <div className="p-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowNotifications(false)
                      window.location.href = '/alerts'
                    }}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    View all alerts
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => alert('Monitoring status: Active\nTransactions per second: 342\nActive nodes: 1,234')}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Live Monitoring</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </header>
  )
}