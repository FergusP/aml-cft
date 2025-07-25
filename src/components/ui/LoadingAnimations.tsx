'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  className?: string
}

interface PulseLoaderProps {
  count?: number
  size?: number
  color?: string
  className?: string
}

// Advanced Skeleton Components
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-200 p-6 shadow-sm", className)}>
      <div className="animate-pulse">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 bg-gray-200 rounded-xl" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded-lg" />
          <div className="h-3 bg-gray-200 rounded-lg w-5/6" />
          <div className="h-3 bg-gray-200 rounded-lg w-4/6" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonChart({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-200 p-6 shadow-sm", className)}>
      <div className="animate-pulse">
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-5 bg-gray-200 rounded-lg w-1/3" />
          <div className="h-8 bg-gray-200 rounded-lg w-20" />
        </div>
        
        {/* Chart Area */}
        <div className="relative h-64 bg-gray-50 rounded-xl">
          <div className="absolute inset-4">
            {/* Y-axis lines */}
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-full h-px bg-gray-200"
                style={{ top: `${i * 25}%` }}
              />
            ))}
            
            {/* Chart bars/lines */}
            <div className="flex items-end justify-between h-full pt-4">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i}
                  className="bg-gray-200 rounded-t w-4"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonTable({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm", className)}>
      <div className="animate-pulse">
        {/* Table Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="h-5 bg-gray-200 rounded-lg w-1/4" />
          <div className="h-8 bg-gray-200 rounded-lg w-24" />
        </div>
        
        {/* Table Rows */}
        <div className="divide-y divide-gray-200">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-10 w-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
                </div>
              </div>
              <div className="h-8 bg-gray-200 rounded-lg w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Advanced Spinner Components
export function AdvancedSpinner({ size = 'md', color = 'blue', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }
  
  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    yellow: 'border-yellow-600',
    purple: 'border-purple-600'
  }
  
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={cn(
        'border-2 border-transparent rounded-full',
        'border-t-current border-r-current',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  )
}

export function PulseLoader({ count = 3, size = 12, color = "#3b82f6", className }: PulseLoaderProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2
          }}
          className="rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color
          }}
        />
      ))}
    </div>
  )
}

export function WaveLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scaleY: [1, 2, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          className="w-1 h-8 bg-blue-600 rounded-full"
        />
      ))}
    </div>
  )
}

export function OrbitLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-12 h-12", className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 bg-blue-600 rounded-full" />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2"
      >
        <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 bg-green-500 rounded-full" />
      </motion.div>
      <div className="absolute inset-4 bg-gray-300 rounded-full" />
    </div>
  )
}

// Loading Screen Component
interface LoadingScreenProps {
  message?: string
  type?: 'default' | 'chart' | 'data' | 'analysis'
}

export function LoadingScreen({ message = "Loading...", type = 'default' }: LoadingScreenProps) {
  const getLoader = () => {
    switch (type) {
      case 'chart':
        return <WaveLoader />
      case 'data':
        return <PulseLoader count={4} size={8} />
      case 'analysis':
        return <OrbitLoader />
      default:
        return <AdvancedSpinner size="lg" />
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {getLoader()}
        </div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-600 font-medium"
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  )
}

// Page Loading Component
export function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-2" />
          <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SkeletonChart />
          <SkeletonChart />
        </div>
        
        {/* Table */}
        <SkeletonTable />
      </div>
    </div>
  )
}