'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, Calendar, AlertTriangle, Activity, Users, Shield, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchFilter {
  type: 'text' | 'select' | 'range' | 'date' | 'multiselect'
  key: string
  label: string
  options?: { value: string; label: string }[]
  placeholder?: string
  min?: number
  max?: number
}

interface AdvancedSearchProps {
  filters: SearchFilter[]
  onSearch: (query: string, filters: Record<string, any>) => void
  placeholder?: string
  className?: string
  showAdvanced?: boolean
}

const defaultFilters: SearchFilter[] = [
  {
    type: 'select',
    key: 'riskLevel',
    label: 'Risk Level',
    options: [
      { value: 'all', label: 'All Levels' },
      { value: 'critical', label: 'Critical' },
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' }
    ]
  },
  {
    type: 'select',
    key: 'type',
    label: 'Type',
    options: [
      { value: 'all', label: 'All Types' },
      { value: 'wallet', label: 'Wallet' },
      { value: 'transaction', label: 'Transaction' },
      { value: 'alert', label: 'Alert' },
      { value: 'report', label: 'Report' }
    ]
  },
  {
    type: 'range',
    key: 'amount',
    label: 'Amount Range (Rp)',
    min: 0,
    max: 1000000000
  },
  {
    type: 'date',
    key: 'dateRange',
    label: 'Date Range'
  },
  {
    type: 'multiselect',
    key: 'flags',
    label: 'Flags',
    options: [
      { value: 'mixer', label: 'Mixer Interaction' },
      { value: 'velocity', label: 'High Velocity' },
      { value: 'sanctions', label: 'Sanctions List' },
      { value: 'suspicious', label: 'Suspicious Pattern' }
    ]
  }
]

export default function AdvancedSearch({ 
  filters = defaultFilters, 
  onSearch, 
  placeholder = "Search wallets, transactions, alerts...", 
  className = '',
  showAdvanced = true 
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Mock suggestions based on query
  const mockSuggestions = [
    '0x742d35Cc6634C0532925a3b844Bc9e7595f7E8E0',
    '0x1234567890123456789012345678901234567890',
    'Tornado Cash',
    'Binance Hot Wallet',
    'High Risk Transaction',
    'Suspicious Pattern Alert'
  ]

  useEffect(() => {
    if (query.length > 2) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    onSearch(query, activeFilters)
    setShowSuggestions(false)
  }

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...activeFilters }
    if (value === '' || value === 'all' || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }
    setActiveFilters(newFilters)
    onSearch(query, newFilters)
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    setQuery('')
    onSearch('', {})
  }

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).length
  }

  const renderFilter = (filter: SearchFilter) => {
    const value = activeFilters[filter.key] || ''

    switch (filter.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={filter.placeholder}
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filter.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'range':
        return (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={value.min || ''}
              onChange={(e) => handleFilterChange(filter.key, { ...value, min: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={value.max || ''}
              onChange={(e) => handleFilterChange(filter.key, { ...value, max: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )

      case 'date':
        return (
          <div className="flex gap-2">
            <input
              type="date"
              value={value.from || ''}
              onChange={(e) => handleFilterChange(filter.key, { ...value, from: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={value.to || ''}
              onChange={(e) => handleFilterChange(filter.key, { ...value, to: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : []
        return (
          <div className="space-y-2">
            {filter.options?.map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter(v => v !== option.value)
                    handleFilterChange(filter.key, newValues)
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Search Bar */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-gray-300 bg-white pl-12 pr-20 py-4 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-sm hover:shadow-md"
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {showAdvanced && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  isAdvancedOpen || getActiveFilterCount() > 0
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </motion.button>
          </div>
        </div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
            >
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  onClick={() => {
                    setQuery(suggestion)
                    setShowSuggestions(false)
                    onSearch(suggestion, activeFilters)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{suggestion}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isAdvancedOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsAdvancedOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filters.map((filter) => (
                  <div key={filter.key} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {filter.label}
                    </label>
                    {renderFilter(filter)}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Tags */}
      {getActiveFilterCount() > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filters.find(f => f.key === key)
            if (!filter) return null
            
            const displayValue = typeof value === 'object' 
              ? Array.isArray(value) 
                ? value.join(', ')
                : Object.values(value).filter(Boolean).join(' - ')
              : value

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm"
              >
                <span className="font-medium">{filter.label}:</span>
                <span>{displayValue}</span>
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}