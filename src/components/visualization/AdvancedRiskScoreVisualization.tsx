'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, 
         PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
         ComposedChart, Line, Area } from 'recharts'
import { AlertTriangle, TrendingUp, TrendingDown, Zap, Shield, Activity, 
         Eye, Info, RotateCcw, Download, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RiskFactor {
  name: string
  value: number
  weight: number
  category: 'behavioral' | 'network' | 'regulatory' | 'technical'
  trend: 'up' | 'down' | 'stable'
  impact: 'high' | 'medium' | 'low'
}

interface RiskScore {
  overall: number
  breakdown: {
    aml: number
    cft: number
    regulatory: number
    behavioral: number
  }
}

interface TimelineData {
  time: string
  riskScore: number
  transactions: number
  alerts: number
}

const mockRiskFactors: RiskFactor[] = [
  { name: 'Transaction Velocity', value: 85, weight: 25, category: 'behavioral', trend: 'up', impact: 'high' },
  { name: 'Mixer Interactions', value: 92, weight: 30, category: 'network', trend: 'up', impact: 'high' },
  { name: 'Regulatory Flags', value: 78, weight: 20, category: 'regulatory', trend: 'stable', impact: 'high' },
  { name: 'Network Risk', value: 65, weight: 15, category: 'network', trend: 'down', impact: 'medium' },
  { name: 'Anomaly Detection', value: 73, weight: 10, category: 'technical', trend: 'up', impact: 'medium' }
]

const mockTimelineData: TimelineData[] = [
  { time: '00:00', riskScore: 45, transactions: 234, alerts: 2 },
  { time: '04:00', riskScore: 52, transactions: 189, alerts: 3 },
  { time: '08:00', riskScore: 67, transactions: 456, alerts: 5 },
  { time: '12:00', riskScore: 74, transactions: 623, alerts: 8 },
  { time: '16:00', riskScore: 89, transactions: 789, alerts: 12 },
  { time: '20:00', riskScore: 93, transactions: 567, alerts: 15 },
  { time: '24:00', riskScore: 87, transactions: 345, alerts: 10 }
]

const mockRiskScore: RiskScore = {
  overall: 87,
  breakdown: {
    aml: 89,
    cft: 85,
    regulatory: 78,
    behavioral: 92
  }
}

export default function AdvancedRiskScoreVisualization() {
  const [selectedView, setSelectedView] = useState<'radar' | 'timeline' | 'breakdown' | 'factors'>('radar')
  const [animationKey, setAnimationKey] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  const radarData = mockRiskFactors.map(factor => ({
    factor: factor.name.split(' ')[0], // Shortened for radar
    value: factor.value,
    fullName: factor.name
  }))

  const breakdownData = [
    { name: 'AML Risk', value: mockRiskScore.breakdown.aml, color: '#ef4444' },
    { name: 'CFT Risk', value: mockRiskScore.breakdown.cft, color: '#f97316' },
    { name: 'Regulatory', value: mockRiskScore.breakdown.regulatory, color: '#eab308' },
    { name: 'Behavioral', value: mockRiskScore.breakdown.behavioral, color: '#dc2626' }
  ]

  const factorsData = mockRiskFactors.map(factor => ({
    name: factor.name,
    score: factor.value,
    weight: factor.weight,
    impact: factor.impact,
    trend: factor.trend
  }))

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#dc2626'
    if (score >= 60) return '#ea580c'
    if (score >= 40) return '#ca8a04'
    return '#16a34a'
  }

  const getRiskLevel = (score: number) => {
    if (score >= 90) return 'Critical'
    if (score >= 70) return 'High'
    if (score >= 50) return 'Medium'
    return 'Low'
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const refreshData = () => {
    setAnimationKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Risk Analysis</h2>
          <p className="text-gray-500 mt-1">Comprehensive risk scoring dengan machine learning insights</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Risk Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Risk Score */}
        <motion.div
          key={`main-score-${animationKey}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 lg:col-span-1"
        >
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center mb-6">
              <svg className="h-40 w-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke={getRiskColor(mockRiskScore.overall)}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - mockRiskScore.overall / 100) }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-gray-900">{mockRiskScore.overall}</div>
                  <div className="text-sm text-gray-500">Risk Score</div>
                </motion.div>
              </div>
            </div>
            
            <div className="mb-4">
              <span className={cn(
                'inline-flex items-center px-4 py-2 rounded-xl text-lg font-bold',
                mockRiskScore.overall >= 80 ? 'bg-red-100 text-red-800' :
                mockRiskScore.overall >= 60 ? 'bg-orange-100 text-orange-800' :
                mockRiskScore.overall >= 40 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              )}>
                {getRiskLevel(mockRiskScore.overall)} Risk
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              Based on 5 risk factors • Last updated 2 min ago
            </div>
          </div>
        </motion.div>

        {/* View Controls */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              {[
                { id: 'radar', label: 'Risk Radar', icon: Activity },
                { id: 'timeline', label: 'Timeline', icon: TrendingUp },
                { id: 'breakdown', label: 'Breakdown', icon: Eye },
                { id: 'factors', label: 'Factors', icon: AlertTriangle }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedView(tab.id as any)}
                    className={cn(
                      'flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative',
                      selectedView === tab.id
                        ? 'text-blue-600 bg-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {selectedView === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {selectedView === 'radar' && (
                  <motion.div
                    key="radar"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid gridType="polygon" />
                        <PolarAngleAxis dataKey="factor" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 100]} 
                          tick={{ fontSize: 10 }}
                          tickCount={5}
                        />
                        <Radar
                          name="Risk Score"
                          dataKey="value"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {selectedView === 'timeline' && (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={mockTimelineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="riskScore"
                          fill="#ef4444"
                          fillOpacity={0.3}
                          stroke="#ef4444"
                          strokeWidth={2}
                        />
                        <Bar yAxisId="right" dataKey="alerts" fill="#f59e0b" opacity={0.7} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {selectedView === 'breakdown' && (
                  <motion.div
                    key="breakdown"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-80 flex items-center justify-center"
                  >
                    <ResponsiveContainer width="60%" height="100%">
                      <PieChart>
                        <Pie
                          data={breakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {breakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3">
                      {breakdownData.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-lg font-bold" style={{ color: item.color }}>{item.value}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {selectedView === 'factors' && (
                  <motion.div
                    key="factors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {mockRiskFactors.map((factor, index) => (
                      <motion.div
                        key={factor.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center',
                            factor.impact === 'high' ? 'bg-red-100' :
                            factor.impact === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                          )}>
                            <AlertTriangle className={cn(
                              'h-6 w-6',
                              factor.impact === 'high' ? 'text-red-600' :
                              factor.impact === 'medium' ? 'text-yellow-600' : 'text-green-600'
                            )} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{factor.name}</h4>
                            <p className="text-sm text-gray-500">Weight: {factor.weight}% • {factor.category}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">{factor.value}</div>
                            <div className="flex items-center gap-1">
                              {factor.trend === 'up' ? (
                                <TrendingUp className="h-3 w-3 text-red-500" />
                              ) : factor.trend === 'down' ? (
                                <TrendingDown className="h-3 w-3 text-green-500" />
                              ) : (
                                <div className="h-3 w-3 bg-gray-400 rounded-full" />
                              )}
                              <span className="text-xs text-gray-500">{factor.trend}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-2">High Risk Alert</h3>
            <p className="text-red-800 mb-4">
              Wallet menunjukkan pola transaksi yang sangat mencurigakan dengan skor risiko {mockRiskScore.overall}%. 
              Aktivitas mixing dan velocity tinggi memerlukan investigasi segera.
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
                Flag untuk Investigasi
              </button>
              <button className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}