'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  RefreshCcw,
  Zap,
  AlertTriangle,
  Clock,
  DollarSign
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatCurrency, getRiskColor, getRiskLevel } from '@/lib/utils'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import AdvancedSearch from '@/components/search/AdvancedSearch'

interface Transaction {
  id: string
  hash: string
  from: string
  to: string
  amount: number
  timestamp: Date
  type: 'send' | 'receive'
  token: string
  riskScore: number
  flags: string[]
  gasUsed: number
  status: 'success' | 'pending' | 'failed'
}

const generateMockTransaction = (index: number): Transaction => {
  const types = ['send', 'receive'] as const
  const tokens = ['ETH', 'USDT', 'USDC', 'BTC', 'BNB']
  const statuses = ['success', 'pending', 'failed'] as const
  
  const riskScore = Math.floor(Math.random() * 100)
  const flags = []
  
  if (riskScore > 80) flags.push('High Risk')
  if (Math.random() > 0.7) flags.push('Large Transaction')
  if (Math.random() > 0.8) flags.push('Mixer Interaction')
  if (Math.random() > 0.9) flags.push('Rapid Movement')
  
  return {
    id: `TX-${Date.now()}-${index}`,
    hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    from: `0x${Math.random().toString(16).substr(2, 40)}`,
    to: `0x${Math.random().toString(16).substr(2, 40)}`,
    amount: Math.random() * 1000000000000,
    timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60),
    type: types[Math.floor(Math.random() * types.length)],
    token: tokens[Math.floor(Math.random() * tokens.length)],
    riskScore,
    flags,
    gasUsed: Math.floor(Math.random() * 1000000),
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }
}

export default function TransactionMonitoring() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<'all' | 'high-risk' | 'flagged'>('all')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [stats, setStats] = useState({
    totalVolume: 0,
    highRiskCount: 0,
    averageRisk: 0,
    transactionRate: 0
  })

  const transactionFilters = [
    {
      type: 'select' as const,
      key: 'riskLevel',
      label: 'Risk Level',
      options: [
        { value: 'all', label: 'All Risk Levels' },
        { value: 'high', label: 'High Risk (>70)' },
        { value: 'medium', label: 'Medium Risk (40-70)' },
        { value: 'low', label: 'Low Risk (<40)' }
      ]
    },
    {
      type: 'select' as const,
      key: 'type',
      label: 'Transaction Type',
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'send', label: 'Send' },
        { value: 'receive', label: 'Receive' }
      ]
    },
    {
      type: 'select' as const,
      key: 'token',
      label: 'Token',
      options: [
        { value: 'all', label: 'All Tokens' },
        { value: 'ETH', label: 'ETH' },
        { value: 'USDT', label: 'USDT' },
        { value: 'USDC', label: 'USDC' },
        { value: 'BTC', label: 'BTC' },
        { value: 'BNB', label: 'BNB' }
      ]
    },
    {
      type: 'select' as const,
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'success', label: 'Success' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' }
      ]
    },
    {
      type: 'range' as const,
      key: 'amount',
      label: 'Amount Range (Rp)',
      min: 0,
      max: 10000000000000
    },
    {
      type: 'multiselect' as const,
      key: 'flags',
      label: 'Flags',
      options: [
        { value: 'high_risk', label: 'High Risk' },
        { value: 'large_transaction', label: 'Large Transaction' },
        { value: 'mixer_interaction', label: 'Mixer Interaction' },
        { value: 'rapid_movement', label: 'Rapid Movement' }
      ]
    }
  ]

  const handleSearch = (query: string, searchFilters: Record<string, any>) => {
    setSearchQuery(query)
    setFilters(searchFilters)
  }

  // Generate initial transactions
  useEffect(() => {
    const initialTransactions = Array.from({ length: 20 }, (_, i) => generateMockTransaction(i))
    setTransactions(initialTransactions)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      const newTransaction = generateMockTransaction(transactions.length)
      setTransactions(prev => [newTransaction, ...prev].slice(0, 100)) // Keep last 100
    }, 3000) // New transaction every 3 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, transactions.length])

  // Calculate stats
  useEffect(() => {
    const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0)
    const highRiskCount = transactions.filter(tx => tx.riskScore > 70).length
    const averageRisk = transactions.length > 0 
      ? transactions.reduce((sum, tx) => sum + tx.riskScore, 0) / transactions.length 
      : 0
    const transactionRate = transactions.filter(tx => 
      tx.timestamp > new Date(Date.now() - 60000)
    ).length

    setStats({
      totalVolume,
      highRiskCount,
      averageRisk,
      transactionRate
    })
  }, [transactions])

  const filteredTransactions = transactions.filter(tx => {
    // Text search
    if (searchQuery && !tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !tx.from.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !tx.to.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !tx.token.toLowerCase().includes(searchQuery.toLowerCase())) return false
    
    // Risk level filter
    if (filters.riskLevel && filters.riskLevel !== 'all') {
      if (filters.riskLevel === 'high' && tx.riskScore <= 70) return false
      if (filters.riskLevel === 'medium' && (tx.riskScore <= 40 || tx.riskScore > 70)) return false
      if (filters.riskLevel === 'low' && tx.riskScore > 40) return false
    }
    
    // Other filters
    if (filters.type && filters.type !== 'all' && tx.type !== filters.type) return false
    if (filters.token && filters.token !== 'all' && tx.token !== filters.token) return false
    if (filters.status && filters.status !== 'all' && tx.status !== filters.status) return false
    
    // Amount range
    if (filters.amount) {
      if (filters.amount.min && tx.amount < parseFloat(filters.amount.min)) return false
      if (filters.amount.max && tx.amount > parseFloat(filters.amount.max)) return false
    }
    
    // Flags filter
    if (filters.flags && filters.flags.length > 0) {
      const hasMatchingFlag = filters.flags.some((flag: string) => {
        switch (flag) {
          case 'high_risk': return tx.flags.includes('High Risk')
          case 'large_transaction': return tx.flags.includes('Large Transaction')
          case 'mixer_interaction': return tx.flags.includes('Mixer Interaction')
          case 'rapid_movement': return tx.flags.includes('Rapid Movement')
          default: return false
        }
      })
      if (!hasMatchingFlag) return false
    }
    
    // Original filter logic
    if (filter === 'high-risk') return tx.riskScore > 70
    if (filter === 'flagged') return tx.flags.length > 0
    
    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaction Monitoring</h1>
            <p className="text-gray-500 mt-1">Monitor transaksi blockchain secara real-time</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                autoRefresh 
                  ? "bg-green-100 text-green-700 hover:bg-green-200" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <RefreshCcw className={cn("h-4 w-4", autoRefresh && "animate-spin")} />
              {autoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Volume Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalVolume)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk Tx</p>
                <p className="text-2xl font-bold text-gray-900">{stats.highRiskCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Risk Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageRisk.toFixed(1)}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tx/Minute</p>
                <p className="text-2xl font-bold text-gray-900">{stats.transactionRate}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Advanced Search */}
        <AdvancedSearch
          filters={transactionFilters}
          onSearch={handleSearch}
          placeholder="Cari berdasarkan hash, wallet address, atau token..."
          className="mb-6"
        />

        {/* Quick Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  filter === 'all'
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                Semua Transaksi
              </button>
              <button
                onClick={() => setFilter('high-risk')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  filter === 'high-risk'
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                High Risk Only
              </button>
              <button
                onClick={() => setFilter('flagged')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  filter === 'flagged'
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                Flagged
              </button>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From/To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredTransactions.map((tx, index) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center",
                            tx.type === 'send' ? "bg-red-100" : "bg-green-100"
                          )}>
                            {tx.type === 'send' ? (
                              <ArrowUpRight className="h-4 w-4 text-red-600" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                            </p>
                            <p className="text-xs text-gray-500">{tx.token}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <p className="text-gray-900 font-mono">
                            {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                          </p>
                          <p className="text-gray-500 font-mono">
                            {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(tx.amount)}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={cn(
                                "h-2 rounded-full",
                                tx.riskScore > 70 ? "bg-red-500" :
                                tx.riskScore > 40 ? "bg-yellow-500" : "bg-green-500"
                              )}
                              style={{ width: `${tx.riskScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{tx.riskScore}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {tx.flags.map((flag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          tx.status === 'success' ? "bg-green-100 text-green-800" :
                          tx.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        )}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(tx.timestamp, 'HH:mm:ss')}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}