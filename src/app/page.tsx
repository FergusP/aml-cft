'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import AdvancedDashboard from '@/components/dashboard/AdvancedDashboard'

export default function Dashboard() {
  return (
    <DashboardLayout>
      <AdvancedDashboard />
    </DashboardLayout>
  )
}