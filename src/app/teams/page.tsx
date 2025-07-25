'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { Users, Mail, Phone, Shield, Clock, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAlertModal } from '@/hooks/useModal'
import { AlertModal } from '@/components/ui/Modal'

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  phone: string
  status: 'available' | 'busy' | 'offline'
  currentCases: number
  completedCases: number
  expertise: string[]
  image?: string
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Budi Santoso',
    role: 'Lead Investigator',
    email: 'budi.santoso@ojk.go.id',
    phone: '+62 812-3456-7890',
    status: 'available',
    currentCases: 3,
    completedCases: 127,
    expertise: ['Crypto Forensics', 'Network Analysis', 'AML Compliance']
  },
  {
    id: '2',
    name: 'Siti Rahma',
    role: 'Senior Analyst',
    email: 'siti.rahma@ojk.go.id',
    phone: '+62 813-4567-8901',
    status: 'busy',
    currentCases: 5,
    completedCases: 89,
    expertise: ['Transaction Tracing', 'Risk Assessment', 'FATF Standards']
  },
  {
    id: '3',
    name: 'Ahmad Faisal',
    role: 'Blockchain Specialist',
    email: 'ahmad.faisal@bi.go.id',
    phone: '+62 814-5678-9012',
    status: 'available',
    currentCases: 2,
    completedCases: 65,
    expertise: ['Smart Contracts', 'DeFi Protocols', 'Chain Analysis']
  },
  {
    id: '4',
    name: 'Dewi Kusuma',
    role: 'Compliance Officer',
    email: 'dewi.kusuma@ojk.go.id',
    phone: '+62 815-6789-0123',
    status: 'offline',
    currentCases: 0,
    completedCases: 102,
    expertise: ['Regulatory Compliance', 'Report Writing', 'Legal Framework']
  }
]

const statusColors = {
  available: 'bg-green-100 text-green-800 border-green-200',
  busy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  offline: 'bg-gray-100 text-gray-800 border-gray-200'
}

const statusDots = {
  available: 'bg-green-500',
  busy: 'bg-yellow-500',
  offline: 'bg-gray-400'
}

export default function InvestigationTeams() {
  const alertModal = useAlertModal()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tim Investigasi</h1>
          <p className="text-gray-500 mt-1">Kelola tim investigasi AML/CFT</p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Team</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
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
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamMembers.filter(m => m.status === 'available').length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamMembers.reduce((sum, m) => sum + m.currentCases, 0)}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamMembers.reduce((sum, m) => sum + m.completedCases, 0)}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={cn(
                      "absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white",
                      statusDots[member.status]
                    )} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 border",
                      statusColors[member.status]
                    )}>
                      {member.status === 'available' ? 'Available' :
                       member.status === 'busy' ? 'Busy' : 'Offline'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => alertModal.showAlert({
                    type: 'info',
                    title: 'Assign Case',
                    message: `Form penugasan kasus untuk ${member.name} akan segera dibuka. Anda dapat memilih kasus dan mengatur prioritas penugasan.`
                  })}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Assign Case
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{member.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Current Cases</p>
                    <p className="font-semibold text-gray-900">{member.currentCases}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Completed Cases</p>
                    <p className="font-semibold text-gray-900">{member.completedCases}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Case Assignment Panel */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Case Assignment</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">Select Case</label>
              <select className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white">
                <option>ALT-2024-001 - High Risk Wallet</option>
                <option>ALT-2024-002 - Suspicious Pattern</option>
                <option>ALT-2024-003 - Velocity Anomaly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">Assign To</label>
              <select className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white">
                {teamMembers.filter(m => m.status === 'available').map(m => (
                  <option key={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">Priority</label>
              <select className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
          <button 
            onClick={() => alertModal.showAlert({
              type: 'success',
              title: 'Kasus Berhasil Ditugaskan',
              message: 'Kasus telah berhasil ditugaskan ke investigator yang dipilih. Notifikasi akan dikirim ke investigator terkait.'
            })}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Assign Case
          </button>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={alertModal.close}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onConfirm={alertModal.onConfirm}
      />
    </DashboardLayout>
  )
}