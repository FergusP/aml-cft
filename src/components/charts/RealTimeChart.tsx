'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react'

interface DataPoint {
  time: string
  transactions: number
  riskScore: number
  alerts: number
  volume: number
}

interface RiskDistribution {
  name: string
  value: number
  color: string
}

// Generate realistic mock data
const generateMockData = (): DataPoint[] => {
  const data: DataPoint[] = []
  const now = new Date()
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      time: time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      transactions: Math.floor(Math.random() * 1000) + 500,
      riskScore: Math.floor(Math.random() * 40) + 30,
      alerts: Math.floor(Math.random() * 15) + 2,
      volume: Math.floor(Math.random() * 500000) + 100000
    })
  }
  return data
}

const riskDistributionData: RiskDistribution[] = [
  { name: 'Low Risk', value: 65, color: '#10b981' },
  { name: 'Medium Risk', value: 25, color: '#f59e0b' },
  { name: 'High Risk', value: 8, color: '#ef4444' },
  { name: 'Critical', value: 2, color: '#dc2626' }
]

interface RealTimeChartProps {
  type: 'transactions' | 'risk' | 'alerts' | 'volume' | 'distribution'
  title: string
  height?: number
}

export default function RealTimeChart({ type, title, height = 300 }: RealTimeChartProps) {
  const [data, setData] = useState<DataPoint[]>(generateMockData())
  const [isLive, setIsLive] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)]
        const lastTime = new Date()
        newData.push({
          time: lastTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          transactions: Math.floor(Math.random() * 1000) + 500,
          riskScore: Math.floor(Math.random() * 40) + 30,
          alerts: Math.floor(Math.random() * 15) + 2,
          volume: Math.floor(Math.random() * 500000) + 100000
        })
        return newData
      })
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [isLive])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString('id-ID')}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    switch (type) {
      case 'transactions':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="transactionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="transactions"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#transactionGradient)"
                name="Transactions"
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'risk':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="riskScore"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                name="Risk Score"
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'alerts':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="alerts"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                name="Alerts"
              />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'volume':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Volume']}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#volumeGradient)"
                name="Volume"
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'distribution':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={riskDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Percentage']}
                labelFormatter={(label) => `${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  // Calculate trend for current data
  const calculateTrend = () => {
    if (data.length < 2) return 0
    const current = data[data.length - 1]
    const previous = data[data.length - 2]
    
    switch (type) {
      case 'transactions':
        return ((current.transactions - previous.transactions) / previous.transactions) * 100
      case 'risk':
        return ((current.riskScore - previous.riskScore) / previous.riskScore) * 100
      case 'alerts':
        return ((current.alerts - previous.alerts) / previous.alerts) * 100
      case 'volume':
        return ((current.volume - previous.volume) / previous.volume) * 100
      default:
        return 0
    }
  }

  const trend = calculateTrend()
  const isPositive = trend > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {type !== 'distribution' && (
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(trend).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
        
        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              isLive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? 'LIVE' : 'PAUSED'}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {renderChart()}
      </div>

      {/* Distribution Legend */}
      {type === 'distribution' && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {riskDistributionData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.name}</span>
              <span className="text-sm font-medium text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}