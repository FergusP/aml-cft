'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

const data = [
  { time: '00:00', volume: 1234567890, suspicious: 45678900 },
  { time: '04:00', volume: 2345678901, suspicious: 89012340 },
  { time: '08:00', volume: 3456789012, suspicious: 123456780 },
  { time: '12:00', volume: 4567890123, suspicious: 234567890 },
  { time: '16:00', volume: 5678901234, suspicious: 345678901 },
  { time: '20:00', volume: 3456789012, suspicious: 156789012 },
  { time: '24:00', volume: 2345678901, suspicious: 78901234 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-white p-3 shadow-lg border border-gray-100">
        <p className="text-sm font-medium mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <p className="text-sm">
              Total: {formatCurrency(payload[0].value)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <p className="text-sm">
              Mencurigakan: {formatCurrency(payload[1].value)}
            </p>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function TransactionFlow() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl bg-white p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Alur Transaksi 24 Jam</h3>
          <p className="text-sm text-gray-500 mt-1">Volume transaksi dan deteksi anomali</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600">Total Volume</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600">Mencurigakan</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="time" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000000000).toFixed(0)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="suspicious"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}