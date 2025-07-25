'use client'

import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useDarkMode } from '@/hooks/useDarkMode'

interface DarkModeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function DarkModeToggle({ className = '', size = 'md' }: DarkModeToggleProps) {
  const { isDarkMode, toggleDarkMode, isLoaded } = useDarkMode()

  const sizeClasses = {
    sm: 'w-12 h-6',
    md: 'w-14 h-7', 
    lg: 'w-16 h-8'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  if (!isLoaded) {
    return (
      <div className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse ${className}`} />
    )
  }

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`
        relative ${sizeClasses[size]} rounded-full p-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2
        ${isDarkMode 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 focus:ring-purple-500/30' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500 focus:ring-yellow-500/30'
        }
        hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl
        ${className}
      `}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Toggle Circle */}
      <motion.div
        className={`
          absolute top-1 ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} 
          bg-white rounded-full shadow-md flex items-center justify-center
        `}
        initial={false}
        animate={{
          x: isDarkMode 
            ? size === 'sm' ? 24 : size === 'md' ? 28 : 32
            : 0
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        <motion.div
          initial={false}
          animate={{
            scale: isDarkMode ? 1 : 0,
            rotate: isDarkMode ? 0 : 180
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
          className="absolute"
        >
          <Moon className={`${iconSizes[size]} text-indigo-600`} />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{
            scale: isDarkMode ? 0 : 1,
            rotate: isDarkMode ? -180 : 0
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
          className="absolute"
        >
          <Sun className={`${iconSizes[size]} text-yellow-600`} />
        </motion.div>
      </motion.div>

      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <motion.div
          animate={{
            opacity: isDarkMode ? 0 : 0.3,
            scale: isDarkMode ? 0.8 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <Sun className={`${iconSizes[size]} text-white`} />
        </motion.div>
        
        <motion.div
          animate={{
            opacity: isDarkMode ? 0.3 : 0,
            scale: isDarkMode ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
        >
          <Moon className={`${iconSizes[size]} text-white`} />
        </motion.div>
      </div>
    </motion.button>
  )
}