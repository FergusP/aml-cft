'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Search, AlertTriangle, CheckCircle, XCircle, Activity, Users, TrendingUp, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, getRiskColor, getRiskLevel, formatCurrency } from '@/lib/utils'

interface WalletData {
  address: string
  riskScore: number
  balance: number
  transactionCount: number
  firstSeen: string
  lastActive: string
  flags: string[]
  connections: number
}

const mockWalletData: WalletData = {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f7E8E0',
  riskScore: 85,
  balance: 45678900000,
  transactionCount: 1234,
  firstSeen: '2023-01-15',
  lastActive: '2024-12-25',
  flags: ['Mixer Interaction', 'Rapid Movement', 'New Wallet', 'High Volume'],
  connections: 156,
}

export default function WalletAnalysis() {
  const [searchAddress, setSearchAddress] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [isFlagging, setIsFlagging] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchAddress) return

    setIsSearching(true)
    // Simulate API call
    setTimeout(() => {
      setWalletData({
        ...mockWalletData,
        address: searchAddress,
        riskScore: Math.floor(Math.random() * 100),
      })
      setIsSearching(false)
    }, 1500)
  }

  const handleFlagForInvestigation = () => {
    setIsFlagging(true)
    setTimeout(() => {
      setIsFlagging(false)
      alert('Wallet berhasil diflag untuk investigasi lebih lanjut!')
    }, 1500)
  }

  const handleDownloadReport = () => {
    setIsDownloading(true)
    setTimeout(() => {
      setIsDownloading(false)
      alert('Laporan analisis wallet sedang diunduh...')
    }, 1500)
  }

  const handleViewTransactionGraph = () => {
    window.location.href = '/investigation?wallet=' + walletData?.address
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analisis Wallet</h1>
          <p className="text-gray-500 mt-1">Periksa skor risiko dan aktivitas wallet kripto</p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Masukkan wallet address (0x...)"
                className="w-full rounded-lg border border-gray-300 bg-white pl-12 pr-4 py-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menganalisis...
                </div>
              ) : (
                'Analisis'
              )}
            </button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {walletData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Risk Score Card */}
              <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Wallet Risk Assessment</h3>
                    <p className="text-sm text-gray-500 mt-1 font-mono">{walletData.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{walletData.riskScore}/100</div>
                    <span className={cn(
                      'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium mt-2',
                      getRiskColor(walletData.riskScore)
                    )}>
                      {getRiskLevel(walletData.riskScore)}
                    </span>
                  </div>
                </div>

                {/* Risk Indicators */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Risk Indicators</h4>
                    {walletData.flags.map((flag, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-gray-600">{flag}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Wallet Info</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Balance:</span>
                        <span className="font-medium">{formatCurrency(walletData.balance)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Transaksi:</span>
                        <span className="font-medium">{walletData.transactionCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Koneksi Wallet:</span>
                        <span className="font-medium">{walletData.connections}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Cards */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-xl bg-white p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Transaction Pattern</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Avg Daily Tx:</span>
                      <span className="font-medium">34</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Peak Hour:</span>
                      <span className="font-medium">14:00-16:00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Velocity Score:</span>
                      <span className="font-medium text-orange-600">High</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-white p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-green-100 p-2">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Network Analysis</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Direct Links:</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Cluster Size:</span>
                      <span className="font-medium">1,234</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Risk Exposure:</span>
                      <span className="font-medium text-red-600">45%</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl bg-white p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Timeline</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">First Seen:</span>
                      <span className="font-medium">{walletData.firstSeen}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Active:</span>
                      <span className="font-medium">{walletData.lastActive}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Age:</span>
                      <span className="font-medium">2 years</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={handleFlagForInvestigation}
                  disabled={isFlagging}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isFlagging ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Flagging...
                    </div>
                  ) : (
                    'Flag untuk Investigasi'
                  )}
                </button>
                <button 
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isDownloading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                      Downloading...
                    </div>
                  ) : (
                    'Download Laporan'
                  )}
                </button>
                <button 
                  onClick={handleViewTransactionGraph}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
                >
                  Lihat Transaction Graph
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Example Wallets */}
        {!walletData && (
          <div className="rounded-xl bg-gray-50 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Contoh Wallet untuk Testing:</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSearchAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f7E8E0')}
                className="text-sm text-blue-600 hover:text-blue-700 font-mono"
              >
                0x742d35Cc6634C0532925a3b844Bc9e7595f7E8E0 (High Risk)
              </button>
              <br />
              <button
                onClick={() => setSearchAddress('0x1234567890123456789012345678901234567890')}
                className="text-sm text-blue-600 hover:text-blue-700 font-mono"
              >
                0x1234567890123456789012345678901234567890 (Medium Risk)
              </button>
              <br />
              <button
                onClick={() => setSearchAddress('0xABCDEF1234567890ABCDEF1234567890ABCDEF12')}
                className="text-sm text-blue-600 hover:text-blue-700 font-mono"
              >
                0xABCDEF1234567890ABCDEF1234567890ABCDEF12 (Low Risk)
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}