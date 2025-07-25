'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'blue' | 'green' | 'red' | 'yellow'
  delay?: number
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
            {trend && (
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                  trend.isPositive
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                    : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          'rounded-xl border p-3 group-hover:scale-110 transition-transform duration-300',
          colorClasses[color]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="absolute -right-8 -bottom-8 opacity-10">
        <Icon className="h-32 w-32" />
      </div>
    </motion.div>
  )
}