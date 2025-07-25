'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Zap, 
  Users, 
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Maximize2,
  Minimize2,
  RefreshCw,
  Filter,
  Download
} from 'lucide-react'
import RealTimeChart from '@/components/charts/RealTimeChart'
import { cn } from '@/lib/utils'

interface MetricCard {
  id: string
  title: string
  value: string | number
  change: number
  changeLabel: string
  icon: React.ComponentType<any>
  color: string
  bgColor: string
  trend: 'up' | 'down' | 'stable'
}

interface Widget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'map'
  title: string
  size: 'sm' | 'md' | 'lg'
  isExpanded?: boolean
}

const mockMetrics: MetricCard[] = [
  {
    id: 'total-transactions',
    title: 'Total Transaksi',
    value: '2,456,789',
    change: 12.5,
    changeLabel: 'vs kemarin',
    icon: Activity,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    trend: 'up'
  },
  {
    id: 'risk-score',
    title: 'Avg Risk Score',
    value: 67.8,
    change: -3.2,
    changeLabel: 'vs minggu lalu',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    trend: 'down'
  },
  {
    id: 'high-risk',
    title: 'High Risk Wallets',
    value: 1247,
    change: 8.7,
    changeLabel: 'vs bulan lalu',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    trend: 'up'
  },
  {
    id: 'active-alerts',
    title: 'Active Alerts',
    value: 89,
    change: -15.3,
    changeLabel: 'vs kemarin',
    icon: AlertTriangle,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    trend: 'down'
  },
  {
    id: 'processing-speed',
    title: 'Processing Speed',
    value: '342 tx/s',
    change: 5.4,
    changeLabel: 'vs rata-rata',
    icon: Zap,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    trend: 'up'
  },
  {
    id: 'compliance-score',
    title: 'Compliance Score',
    value: '94.2%',
    change: 2.1,
    changeLabel: 'vs target',
    icon: Shield,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    trend: 'up'
  }
]

export default function AdvancedDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'transactions-chart', type: 'chart', title: 'Transaction Volume', size: 'lg' },
    { id: 'risk-chart', type: 'chart', title: 'Risk Score Trend', size: 'md' },
    { id: 'alerts-chart', type: 'chart', title: 'Alert Activity', size: 'md' },
    { id: 'distribution-chart', type: 'chart', title: 'Risk Distribution', size: 'md' }
  ])
  
  const [timeRange, setTimeRange] = useState('24h')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null)

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      // Trigger refresh for all components
    }, 30000)
    
    return () => clearInterval(interval)
  }, [autoRefresh])

  const toggleWidgetExpansion = (widgetId: string) => {
    setExpandedWidget(expandedWidget === widgetId ? null : widgetId)
  }

  const MetricCardComponent = ({ metric }: { metric: MetricCard }) => {
    const Icon = metric.icon
    const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Activity

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn('rounded-xl p-3 group-hover:scale-110 transition-transform', metric.bgColor)}>
                <Icon className={cn('h-6 w-6', metric.color)} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                metric.trend === 'up' ? 'bg-green-100 text-green-700' :
                metric.trend === 'down' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              )}>
                <TrendIcon className="h-3 w-3" />
                {Math.abs(metric.change)}%
              </div>
              <span className="text-xs text-gray-500">{metric.changeLabel}</span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const ChartWidget = ({ widget }: { widget: Widget }) => {
    const isExpanded = expandedWidget === widget.id

    return (
      <motion.div
        layout
        className={cn(
          'bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300',
          isExpanded ? 'col-span-full row-span-2' : '',
          widget.size === 'lg' ? 'col-span-2' : 'col-span-1'
        )}
      >
        {/* Widget Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">{widget.title}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">1 Hour</option>
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
            </select>
            
            <button
              onClick={() => toggleWidgetExpansion(widget.id)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        {/* Chart Content */}
        <div className="p-4">
          {widget.id === 'transactions-chart' && (
            <RealTimeChart type="transactions" title="" height={isExpanded ? 400 : 250} />
          )}
          {widget.id === 'risk-chart' && (
            <RealTimeChart type="risk" title="" height={isExpanded ? 400 : 250} />
          )}
          {widget.id === 'alerts-chart' && (
            <RealTimeChart type="alerts" title="" height={isExpanded ? 400 : 250} />
          )}
          {widget.id === 'distribution-chart' && (
            <RealTimeChart type="distribution" title="" height={isExpanded ? 400 : 250} />
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time monitoring sistem deteksi risiko AML/CFT</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
              autoRefresh 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <RefreshCw className={cn('h-4 w-4', autoRefresh && 'animate-spin')} />
            {autoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCardComponent metric={metric} />
          </motion.div>
        ))}
      </div>

      {/* Advanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-max">
        <AnimatePresence>
          {widgets.map((widget, index) => (
            <motion.div
              key={widget.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChartWidget widget={widget} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Real-time Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse" />
              <span className="font-medium">System Status: Online</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Last Updated: {new Date().toLocaleTimeString('id-ID')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs opacity-75">Active Nodes</p>
              <p className="text-lg font-bold">1,234</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-75">Uptime</p>
              <p className="text-lg font-bold">99.9%</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-75">TPS</p>
              <p className="text-lg font-bold">342</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}