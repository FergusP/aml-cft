'use client'

import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  AlertTriangle,
  Activity,
  Info,
  Users,
  Clock,
  TrendingUp,
  Download
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAlertModal } from '@/hooks/useModal'
import { AlertModal } from '@/components/ui/Modal'
import InteractiveNetworkGraph from '@/components/network/InteractiveNetworkGraph'

interface Node {
  id: string
  label: string
  type: 'wallet' | 'exchange' | 'mixer' | 'contract'
  risk: 'high' | 'medium' | 'low'
  value: number
  transactions: number
}

interface Edge {
  from: string
  to: string
  value: number
  count: number
}

const mockNodes: Node[] = [
  { id: '1', label: '0x742d...E8E0', type: 'wallet', risk: 'high', value: 150000000000, transactions: 234 },
  { id: '2', label: 'Binance Hot', type: 'exchange', risk: 'low', value: 890000000000, transactions: 1456 },
  { id: '3', label: 'Tornado Cash', type: 'mixer', risk: 'high', value: 450000000000, transactions: 678 },
  { id: '4', label: '0x1234...7890', type: 'wallet', risk: 'medium', value: 45000000000, transactions: 123 },
  { id: '5', label: 'Uniswap V3', type: 'contract', risk: 'low', value: 234000000000, transactions: 456 },
  { id: '6', label: '0xABCD...EF12', type: 'wallet', risk: 'high', value: 78000000000, transactions: 89 },
  { id: '7', label: 'Unknown Mixer', type: 'mixer', risk: 'high', value: 123000000000, transactions: 234 },
]

const mockEdges: Edge[] = [
  { from: '1', to: '3', value: 45000000000, count: 12 },
  { from: '3', to: '4', value: 23000000000, count: 8 },
  { from: '1', to: '2', value: 67000000000, count: 23 },
  { from: '4', to: '5', value: 12000000000, count: 5 },
  { from: '6', to: '3', value: 34000000000, count: 15 },
  { from: '7', to: '1', value: 56000000000, count: 19 },
  { from: '2', to: '5', value: 89000000000, count: 34 },
]

export default function InvestigationTools() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const alertModal = useAlertModal()

  useEffect(() => {
    drawNetwork()
  }, [zoomLevel])

  const drawNetwork = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate positions
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 200 * zoomLevel

    // Position nodes in a circle
    const nodePositions: { [key: string]: { x: number, y: number } } = {}
    mockNodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / mockNodes.length
      nodePositions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    })

    // Draw edges
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 2
    mockEdges.forEach(edge => {
      const from = nodePositions[edge.from]
      const to = nodePositions[edge.to]
      if (from && to) {
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
      }
    })

    // Draw nodes
    mockNodes.forEach(node => {
      const pos = nodePositions[node.id]
      if (!pos) return

      // Node color based on risk
      ctx.fillStyle = node.risk === 'high' ? '#ef4444' : 
                      node.risk === 'medium' ? '#f59e0b' : '#10b981'
      
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 30 * zoomLevel, 0, 2 * Math.PI)
      ctx.fill()

      // Node label
      ctx.fillStyle = 'white'
      ctx.font = `${12 * zoomLevel}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label.slice(0, 10), pos.x, pos.y)
    })
  }

  const handleAnalyzeNetwork = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      alertModal.showAlert({
        type: 'success',
        title: 'Analisis Network Selesai',
        message: 'Ditemukan 3 pola transaksi mencurigakan:\n\n• Circular transaction pattern\n• Multiple mixer interactions\n• Rapid fund movement\n\nSilakan lihat detail di panel kanan untuk investigasi lebih lanjut.'
      })
    }, 2000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investigation Tools</h1>
            <p className="text-gray-500 mt-1">Analisis network dan visualisasi transaksi blockchain</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAnalyzeNetwork}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Network className="h-4 w-4" />
                  Analyze Network
                </>
              )}
            </button>
            <button 
              onClick={() => alertModal.showAlert({
                type: 'info',
                title: 'Export Network Graph',
                message: 'Network graph sedang diproses untuk export. File akan diunduh dalam format PNG dan JSON untuk analisis lebih lanjut.'
              })}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export Graph
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Interactive Network Visualization */}
          <div className="w-full">
            <InteractiveNetworkGraph 
              width={1200} 
              height={600} 
              className="w-full"
            />
          </div>

          {/* Node Details */}
          <div className="space-y-6">
            {/* Selected Node Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Node Details</h3>
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-mono text-sm font-medium">{selectedNode.label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="text-sm font-medium capitalize">{selectedNode.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Risk Level</p>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      selectedNode.risk === 'high' ? "bg-red-100 text-red-800" :
                      selectedNode.risk === 'medium' ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    )}>
                      {selectedNode.risk === 'high' ? 'High Risk' :
                       selectedNode.risk === 'medium' ? 'Medium Risk' : 'Low Risk'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="text-sm font-medium">Rp {(selectedNode.value / 1000000).toFixed(0)}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transactions</p>
                    <p className="text-sm font-medium">{selectedNode.transactions}</p>
                  </div>
                  <button 
                    onClick={() => window.location.href = `/wallet?address=${selectedNode.label}`}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Full Analysis
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Click on a node to view details</p>
              )}
            </div>

            {/* Analysis Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Total Nodes</span>
                  </div>
                  <span className="text-sm font-medium">{mockNodes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Connections</span>
                  </div>
                  <span className="text-sm font-medium">{mockEdges.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">High Risk Nodes</span>
                  </div>
                  <span className="text-sm font-medium text-red-600">
                    {mockNodes.filter(n => n.risk === 'high').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Total Volume</span>
                  </div>
                  <span className="text-sm font-medium">
                    Rp {(mockEdges.reduce((sum, e) => sum + e.value, 0) / 1000000000).toFixed(1)}B
                  </span>
                </div>
              </div>
            </div>

            {/* Pattern Detection */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-orange-600" />
                <h4 className="font-medium text-orange-900">Suspicious Patterns</h4>
              </div>
              <ul className="space-y-1 text-sm text-orange-800">
                <li>• Circular transaction pattern detected</li>
                <li>• Multiple mixer interactions</li>
                <li>• Rapid fund movement</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Investigation Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investigation Timeline</h3>
          <div className="space-y-4">
            {[
              { time: '10:45', event: 'Initial transaction from flagged wallet', risk: 'high' },
              { time: '10:52', event: 'Funds moved to Tornado Cash mixer', risk: 'high' },
              { time: '11:15', event: 'Partial withdrawal to new wallet', risk: 'medium' },
              { time: '11:28', event: 'Exchange deposit detected', risk: 'low' },
              { time: '11:45', event: 'Conversion to stablecoin', risk: 'low' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-2 min-w-[80px]">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{item.time}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{item.event}</p>
                </div>
                <span className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  item.risk === 'high' ? "bg-red-100 text-red-800" :
                  item.risk === 'medium' ? "bg-yellow-100 text-yellow-800" :
                  "bg-green-100 text-green-800"
                )}>
                  {item.risk} risk
                </span>
              </motion.div>
            ))}
          </div>
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