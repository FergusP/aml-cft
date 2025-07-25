'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import StatsCard from '@/components/dashboard/StatsCard'
import RiskDistribution from '@/components/dashboard/RiskDistribution'
import TransactionFlow from '@/components/dashboard/TransactionFlow'
import RecentAlerts from '@/components/dashboard/RecentAlerts'
import { 
  Users, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react'

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Monitoring real-time aktivitas blockchain untuk deteksi AML/CFT</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Wallet Dimonitor"
            value="21.27M"
            subtitle="Investor kripto Indonesia"
            icon={Users}
            trend={{ value: 8.2, isPositive: true }}
            color="blue"
            delay={0}
          />
          <StatsCard
            title="Wallet Risiko Tinggi"
            value="234"
            subtitle="Perlu investigasi segera"
            icon={AlertTriangle}
            trend={{ value: 15.3, isPositive: false }}
            color="red"
            delay={0.1}
          />
          <StatsCard
            title="Transaksi Harian"
            value="2.5M"
            subtitle="Volume Rp 211T"
            icon={Activity}
            trend={{ value: 12.5, isPositive: true }}
            color="green"
            delay={0.2}
          />
          <StatsCard
            title="Alert Aktif"
            value="47"
            subtitle="12 critical, 35 warning"
            icon={Zap}
            color="yellow"
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransactionFlow />
          </div>
          <div>
            <RiskDistribution />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentAlerts />
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Compliance Status</h3>
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">FATF Compliance</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">OJK Standards</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">BI Regulations</span>
                  <span className="text-sm font-medium">88%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}