'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { 
  Settings as SettingsIcon,
  Save,
  AlertTriangle,
  Bell,
  Shield,
  Database,
  Globe,
  Key,
  Users,
  Mail,
  Smartphone
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ThresholdSetting {
  id: string
  name: string
  description: string
  value: number
  min: number
  max: number
  unit: string
  category: 'risk' | 'alert' | 'compliance'
}

const thresholdSettings: ThresholdSetting[] = [
  {
    id: 'high_risk_threshold',
    name: 'High Risk Score Threshold',
    description: 'Wallet dengan skor risiko di atas nilai ini akan dikategorikan sebagai high risk',
    value: 70,
    min: 50,
    max: 100,
    unit: '%',
    category: 'risk'
  },
  {
    id: 'medium_risk_threshold',
    name: 'Medium Risk Score Threshold',
    description: 'Wallet dengan skor risiko di atas nilai ini akan dikategorikan sebagai medium risk',
    value: 40,
    min: 20,
    max: 70,
    unit: '%',
    category: 'risk'
  },
  {
    id: 'transaction_velocity',
    name: 'Transaction Velocity Alert',
    description: 'Alert akan dibuat jika jumlah transaksi per jam melebihi nilai ini',
    value: 50,
    min: 10,
    max: 200,
    unit: 'tx/hour',
    category: 'alert'
  },
  {
    id: 'large_transaction',
    name: 'Large Transaction Threshold',
    description: 'Transaksi di atas nilai ini akan dianggap sebagai transaksi besar',
    value: 100,
    min: 10,
    max: 1000,
    unit: 'M IDR',
    category: 'alert'
  },
  {
    id: 'mixer_interaction',
    name: 'Mixer Interaction Risk Score',
    description: 'Tambahan skor risiko untuk wallet yang berinteraksi dengan mixer',
    value: 30,
    min: 10,
    max: 50,
    unit: 'points',
    category: 'risk'
  },
  {
    id: 'compliance_threshold',
    name: 'Minimum Compliance Score',
    description: 'Skor kepatuhan minimum yang harus dipenuhi',
    value: 85,
    min: 70,
    max: 100,
    unit: '%',
    category: 'compliance'
  }
]

export default function Settings() {
  const [settings, setSettings] = useState(thresholdSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'thresholds' | 'notifications' | 'api' | 'users'>('thresholds')

  const handleSettingChange = (id: string, newValue: number) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, value: newValue } : setting
    ))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Pengaturan berhasil disimpan!')
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1">Konfigurasi sistem deteksi risiko AML/CFT</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('thresholds')}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === 'thresholds'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Risk Thresholds
              </div>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === 'notifications'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </div>
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === 'api'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Configuration
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === 'users'
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                User Management
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'thresholds' && (
          <div className="space-y-6">
            {/* Risk Thresholds */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Score Thresholds</h3>
              <div className="space-y-6">
                {settings.filter(s => s.category === 'risk').map((setting, index) => (
                  <motion.div
                    key={setting.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{setting.name}</h4>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">{setting.value}</span>
                        <span className="text-sm text-gray-500 ml-1">{setting.unit}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{setting.min}</span>
                      <input
                        type="range"
                        min={setting.min}
                        max={setting.max}
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm text-gray-500">{setting.max}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Alert Thresholds */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Alert Thresholds</h3>
              <div className="space-y-6">
                {settings.filter(s => s.category === 'alert').map((setting, index) => (
                  <motion.div
                    key={setting.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{setting.name}</h4>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">{setting.value}</span>
                        <span className="text-sm text-gray-500 ml-1">{setting.unit}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{setting.min}</span>
                      <input
                        type="range"
                        min={setting.min}
                        max={setting.max}
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm text-gray-500">{setting.max}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Compliance Thresholds */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Compliance Thresholds</h3>
              <div className="space-y-6">
                {settings.filter(s => s.category === 'compliance').map((setting, index) => (
                  <motion.div
                    key={setting.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{setting.name}</h4>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">{setting.value}</span>
                        <span className="text-sm text-gray-500 ml-1">{setting.unit}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{setting.min}</span>
                      <input
                        type="range"
                        min={setting.min}
                        max={setting.max}
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm text-gray-500">{setting.max}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive alerts via email</p>
                  </div>
                </div>
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive critical alerts via SMS</p>
                  </div>
                </div>
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-500">Browser push notifications</p>
                  </div>
                </div>
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">API Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="sk_live_4242424242424242"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to regenerate the API key?')) {
                        alert('New API key generated: sk_live_' + Math.random().toString(36).substr(2, 16))
                      }
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                <input
                  type="text"
                  placeholder="https://your-domain.com/webhook"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limit</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>1000 requests/hour</option>
                  <option>5000 requests/hour</option>
                  <option>10000 requests/hour</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">User Management</h3>
            <div className="mb-4">
              <button 
                onClick={() => alert('Opening Add New User form...')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add New User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Admin OJK</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">admin@ojk.go.id</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Administrator</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => alert('Opening edit form...')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Analyst BI</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">analyst@bi.go.id</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Analyst</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => alert('Opening edit form...')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}