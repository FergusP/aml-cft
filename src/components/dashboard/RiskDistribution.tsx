'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { motion } from 'framer-motion'

const data = [
  { name: 'Risiko Tinggi', value: 234, percentage: 12 },
  { name: 'Risiko Sedang', value: 456, percentage: 24 },
  { name: 'Risiko Rendah', value: 789, percentage: 41 },
  { name: 'Aman', value: 432, percentage: 23 },
]

const COLORS = {
  'Risiko Tinggi': '#DC2626',
  'Risiko Sedang': '#EA580C',
  'Risiko Rendah': '#CA8A04',
  'Aman': '#16A34A',
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-white p-3 shadow-lg border border-gray-100">
        <p className="text-sm font-medium">{payload[0].name}</p>
        <p className="text-lg font-bold">{payload[0].value} wallet</p>
        <p className="text-xs text-gray-500">{payload[0].payload.percentage}% dari total</p>
      </div>
    )
  }
  return null
}

export default function RiskDistribution() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl bg-white p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900">Distribusi Risiko Wallet</h3>
      <p className="text-sm text-gray-500 mt-1">Total 1,911 wallet teranalisis</p>
      
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-sm">
                  {value} ({entry.payload.percentage}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}