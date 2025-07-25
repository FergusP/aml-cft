'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Shield,
  Users,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Report {
  id: string
  title: string
  type: 'monthly' | 'quarterly' | 'annual' | 'special'
  period: string
  generatedDate: Date
  status: 'draft' | 'final' | 'approved'
  size: string
  compliance: {
    fatf: number
    ojk: number
    bi: number
  }
  summary: {
    totalTransactions: number
    flaggedTransactions: number
    highRiskWallets: number
    investigatedCases: number
  }
}

const mockReports: Report[] = [
  {
    id: 'RPT-2024-12',
    title: 'Laporan Bulanan AML/CFT - Desember 2024',
    type: 'monthly',
    period: 'Desember 2024',
    generatedDate: new Date('2024-12-31'),
    status: 'final',
    size: '2.4 MB',
    compliance: { fatf: 96, ojk: 94, bi: 92 },
    summary: {
      totalTransactions: 2456789,
      flaggedTransactions: 234,
      highRiskWallets: 45,
      investigatedCases: 12
    }
  },
  {
    id: 'RPT-2024-Q4',
    title: 'Laporan Kuartalan AML/CFT - Q4 2024',
    type: 'quarterly',
    period: 'Oktober - Desember 2024',
    generatedDate: new Date('2024-12-31'),
    status: 'approved',
    size: '5.8 MB',
    compliance: { fatf: 95, ojk: 93, bi: 91 },
    summary: {
      totalTransactions: 7234567,
      flaggedTransactions: 678,
      highRiskWallets: 123,
      investigatedCases: 34
    }
  },
  {
    id: 'RPT-2024-11',
    title: 'Laporan Bulanan AML/CFT - November 2024',
    type: 'monthly',
    period: 'November 2024',
    generatedDate: new Date('2024-11-30'),
    status: 'final',
    size: '2.2 MB',
    compliance: { fatf: 94, ojk: 92, bi: 90 },
    summary: {
      totalTransactions: 2234567,
      flaggedTransactions: 198,
      highRiskWallets: 38,
      investigatedCases: 8
    }
  }
]

export default function ComplianceReports() {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2024')
  const [generatingReport, setGeneratingReport] = useState(false)

  const handleGenerateReport = () => {
    setGeneratingReport(true)
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReport(false)
      // In real app, would trigger download
      alert('Laporan berhasil di-generate dan akan segera diunduh!')
    }, 3000)
  }

  const handleDownloadReport = (reportId: string) => {
    // In real app, would trigger download
    alert(`Mengunduh laporan ${reportId}...`)
  }

  const filteredReports = mockReports.filter(report => {
    if (selectedType !== 'all' && report.type !== selectedType) return false
    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compliance Reports</h1>
            <p className="text-gray-500 mt-1">Generate dan kelola laporan kepatuhan AML/CFT</p>
          </div>
          <button
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generatingReport ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Generate Report
              </>
            )}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">48</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
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
                <p className="text-sm font-medium text-gray-600">Avg Compliance</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
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
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
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
                <p className="text-sm font-medium text-gray-600">Last Generated</p>
                <p className="text-lg font-bold text-gray-900">2 jam lalu</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Tipe</option>
              <option value="monthly">Bulanan</option>
              <option value="quarterly">Kuartalan</option>
              <option value="annual">Tahunan</option>
              <option value="special">Khusus</option>
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      report.status === 'approved' ? "bg-green-100 text-green-800" :
                      report.status === 'final' ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    )}>
                      {report.status === 'approved' ? 'Disetujui' :
                       report.status === 'final' ? 'Final' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {report.period}
                    </span>
                    <span>•</span>
                    <span>Generated: {format(report.generatedDate, 'dd MMM yyyy', { locale: id })}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Total Transaksi</p>
                      <p className="text-sm font-semibold">{report.summary.totalTransactions.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Transaksi Flagged</p>
                      <p className="text-sm font-semibold text-orange-600">{report.summary.flaggedTransactions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">High Risk Wallets</p>
                      <p className="text-sm font-semibold text-red-600">{report.summary.highRiskWallets}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Kasus Investigasi</p>
                      <p className="text-sm font-semibold">{report.summary.investigatedCases}</p>
                    </div>
                  </div>

                  {/* Compliance Scores */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">FATF: {report.compliance.fatf}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">OJK: {report.compliance.ojk}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">BI: {report.compliance.bi}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleDownloadReport(report.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button 
                    onClick={() => alert(`Viewing details for report ${report.id}`)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Report Generation Panel */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Generate Custom Report</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">Report Type</label>
              <select className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Monthly Report</option>
                <option>Quarterly Report</option>
                <option>Annual Report</option>
                <option>Custom Period</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">Period</label>
              <input
                type="month"
                className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="2024-12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">Format</label>
              <select className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-blue-300 text-blue-600 focus:ring-blue-500" defaultChecked />
              <span className="text-sm text-blue-800">Include detailed transaction logs</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-blue-300 text-blue-600 focus:ring-blue-500" defaultChecked />
              <span className="text-sm text-blue-800">Include risk analysis</span>
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}