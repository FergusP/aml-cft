'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { 
  Calculator, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Users,
  Activity,
  Clock,
  Shield,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RiskFactor {
  id: string
  name: string
  description: string
  weight: number
  score: number
  impact: 'high' | 'medium' | 'low'
  icon: React.ComponentType<any>
}

const riskFactors: RiskFactor[] = [
  {
    id: 'transaction_velocity',
    name: 'Transaction Velocity',
    description: 'Kecepatan dan frekuensi transaksi dalam periode waktu tertentu',
    weight: 20,
    score: 75,
    impact: 'high',
    icon: Zap
  },
  {
    id: 'mixer_interaction',
    name: 'Mixer Service Interaction',
    description: 'Interaksi dengan layanan mixing atau tumbling untuk menyamarkan jejak transaksi',
    weight: 25,
    score: 90,
    impact: 'high',
    icon: AlertTriangle
  },
  {
    id: 'network_risk',
    name: 'Network Risk Exposure',
    description: 'Koneksi dengan wallet-wallet berisiko tinggi dalam network',
    weight: 15,
    score: 60,
    impact: 'medium',
    icon: Users
  },
  {
    id: 'behavioral_anomaly',
    name: 'Behavioral Anomaly',
    description: 'Perubahan pola transaksi yang tidak normal dari baseline',
    weight: 15,
    score: 45,
    impact: 'medium',
    icon: Activity
  },
  {
    id: 'regulatory_flags',
    name: 'Regulatory Compliance',
    description: 'Kepatuhan terhadap daftar sanksi dan regulasi AML/CFT',
    weight: 20,
    score: 30,
    impact: 'high',
    icon: Shield
  },
  {
    id: 'wallet_age',
    name: 'Wallet Age & History',
    description: 'Usia wallet dan konsistensi riwayat transaksi',
    weight: 5,
    score: 20,
    impact: 'low',
    icon: Clock
  }
]

const methodologySteps = [
  {
    step: 1,
    title: 'Data Collection',
    description: 'Mengumpulkan data transaksi blockchain real-time dari multiple sources'
  },
  {
    step: 2,
    title: 'Pattern Analysis',
    description: 'Analisis pola transaksi menggunakan machine learning algorithms'
  },
  {
    step: 3,
    title: 'Risk Calculation',
    description: 'Kalkulasi weighted risk score berdasarkan multiple risk factors'
  },
  {
    step: 4,
    title: 'Threshold Evaluation',
    description: 'Evaluasi terhadap threshold yang ditetapkan oleh regulator'
  },
  {
    step: 5,
    title: 'Alert Generation',
    description: 'Generate alert otomatis untuk transaksi berisiko tinggi'
  }
]

export default function RiskScoring() {
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null)

  const calculateOverallScore = () => {
    const totalWeightedScore = riskFactors.reduce((sum, factor) => 
      sum + (factor.score * factor.weight / 100), 0
    )
    return Math.round(totalWeightedScore)
  }

  const overallScore = calculateOverallScore()

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: 'Critical', color: 'text-red-600 bg-red-100' }
    if (score >= 50) return { level: 'High', color: 'text-orange-600 bg-orange-100' }
    if (score >= 30) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-100' }
    return { level: 'Low', color: 'text-green-600 bg-green-100' }
  }

  const riskLevel = getRiskLevel(overallScore)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risk Scoring Methodology</h1>
          <p className="text-gray-500 mt-1">
            Metodologi penilaian risiko AML/CFT berbasis analisis on-chain
          </p>
        </div>

        {/* Overall Risk Score */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Overall Risk Score</h2>
            <div className="relative inline-flex items-center justify-center">
              <svg className="h-48 w-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - overallScore / 100)}`}
                  className={cn(
                    "transition-all duration-1000",
                    overallScore >= 70 ? "text-red-500" :
                    overallScore >= 50 ? "text-orange-500" :
                    overallScore >= 30 ? "text-yellow-500" : "text-green-500"
                  )}
                />
              </svg>
              <div className="absolute">
                <div className="text-5xl font-bold text-gray-900">{overallScore}</div>
                <div className="text-sm text-gray-500">out of 100</div>
              </div>
            </div>
            <div className="mt-6">
              <span className={cn(
                "inline-flex items-center px-4 py-2 rounded-full text-lg font-medium",
                riskLevel.color
              )}>
                {riskLevel.level} Risk
              </span>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Factor Analysis</h3>
          <div className="space-y-4">
            {riskFactors.map((factor, index) => {
              const Icon = factor.icon
              return (
                <motion.div
                  key={factor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    selectedFactor === factor.id 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => setSelectedFactor(
                    selectedFactor === factor.id ? null : factor.id
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        factor.impact === 'high' ? "bg-red-100" :
                        factor.impact === 'medium' ? "bg-yellow-100" : "bg-green-100"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          factor.impact === 'high' ? "text-red-600" :
                          factor.impact === 'medium' ? "text-yellow-600" : "text-green-600"
                        )} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{factor.name}</h4>
                        <p className="text-sm text-gray-500">{factor.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{factor.score}</div>
                      <div className="text-xs text-gray-500">Weight: {factor.weight}%</div>
                    </div>
                  </div>
                  {selectedFactor === factor.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Contribution to Overall Score:</span>
                          <span className="ml-2 font-medium">
                            {Math.round(factor.score * factor.weight / 100)} points
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Impact Level:</span>
                          <span className={cn(
                            "ml-2 font-medium capitalize",
                            factor.impact === 'high' ? "text-red-600" :
                            factor.impact === 'medium' ? "text-yellow-600" : "text-green-600"
                          )}>
                            {factor.impact}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Methodology Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Assessment Methodology</h3>
          <div className="space-y-4">
            {methodologySteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{step.step}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{step.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Compliance Standards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h3 className="font-semibold text-gray-900">FATF Standards</h3>
            </div>
            <p className="text-sm text-gray-600">
              Compliant dengan 40 Rekomendasi FATF untuk pencegahan money laundering
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Compliance Level</span>
                <span className="font-medium text-green-600">98%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '98%' }} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-blue-500" />
              <h3 className="font-semibold text-gray-900">OJK Regulations</h3>
            </div>
            <p className="text-sm text-gray-600">
              Sesuai dengan POJK tentang Penerapan Program APU PPT di Sektor Jasa Keuangan
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Compliance Level</span>
                <span className="font-medium text-blue-600">95%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Info className="h-8 w-8 text-purple-500" />
              <h3 className="font-semibold text-gray-900">BI Standards</h3>
            </div>
            <p className="text-sm text-gray-600">
              Mengikuti pedoman Bank Indonesia untuk transaksi aset kripto
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Compliance Level</span>
                <span className="font-medium text-purple-600">92%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}