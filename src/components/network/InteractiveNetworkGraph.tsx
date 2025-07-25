'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, Maximize2, RefreshCw, Filter, Download } from 'lucide-react'

interface NetworkNode extends d3.SimulationNodeDatum {
  id: string
  label: string
  type: 'wallet' | 'exchange' | 'mixer' | 'contract' | 'defi'
  risk: 'low' | 'medium' | 'high' | 'critical'
  value: number
  transactions: number
  group: number
}

interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
  source: string | NetworkNode
  target: string | NetworkNode
  value: number
  transactions: number
  type: 'normal' | 'suspicious' | 'high_volume'
}

interface InteractiveNetworkGraphProps {
  width?: number
  height?: number
  className?: string
}

const generateNetworkData = (): { nodes: NetworkNode[], links: NetworkLink[] } => {
  const nodes: NetworkNode[] = [
    { id: '1', label: '0x742d...E8E0', type: 'wallet', risk: 'critical', value: 150000, transactions: 234, group: 1 },
    { id: '2', label: 'Binance Hot', type: 'exchange', risk: 'low', value: 890000, transactions: 1456, group: 2 },
    { id: '3', label: 'Tornado Cash', type: 'mixer', risk: 'critical', value: 450000, transactions: 678, group: 3 },
    { id: '4', label: '0x1234...7890', type: 'wallet', risk: 'medium', value: 45000, transactions: 123, group: 1 },
    { id: '5', label: 'Uniswap V3', type: 'defi', risk: 'low', value: 234000, transactions: 456, group: 4 },
    { id: '6', label: '0xABCD...EF12', type: 'wallet', risk: 'high', value: 78000, transactions: 89, group: 1 },
    { id: '7', label: 'Unknown Mixer', type: 'mixer', risk: 'critical', value: 123000, transactions: 234, group: 3 },
    { id: '8', label: 'Coinbase Pro', type: 'exchange', risk: 'low', value: 567000, transactions: 890, group: 2 },
    { id: '9', label: '0x9876...4321', type: 'wallet', risk: 'medium', value: 34000, transactions: 67, group: 1 },
    { id: '10', label: 'Compound', type: 'defi', risk: 'low', value: 189000, transactions: 345, group: 4 },
    { id: '11', label: '0xFEDC...BA98', type: 'wallet', risk: 'high', value: 92000, transactions: 156, group: 1 },
    { id: '12', label: 'Privacy Coin', type: 'mixer', risk: 'critical', value: 67000, transactions: 123, group: 3 }
  ]

  const links: NetworkLink[] = [
    { source: '1', target: '3', value: 45000, transactions: 12, type: 'suspicious' },
    { source: '3', target: '4', value: 23000, transactions: 8, type: 'suspicious' },
    { source: '1', target: '2', value: 67000, transactions: 23, type: 'high_volume' },
    { source: '4', target: '5', value: 12000, transactions: 5, type: 'normal' },
    { source: '6', target: '3', value: 34000, transactions: 15, type: 'suspicious' },
    { source: '7', target: '1', value: 56000, transactions: 19, type: 'suspicious' },
    { source: '2', target: '5', value: 89000, transactions: 34, type: 'normal' },
    { source: '8', target: '9', value: 23000, transactions: 11, type: 'normal' },
    { source: '9', target: '10', value: 15000, transactions: 7, type: 'normal' },
    { source: '11', target: '12', value: 41000, transactions: 18, type: 'suspicious' },
    { source: '12', target: '1', value: 28000, transactions: 9, type: 'suspicious' },
    { source: '6', target: '11', value: 19000, transactions: 6, type: 'normal' }
  ]

  return { nodes, links }
}

export default function InteractiveNetworkGraph({ 
  width = 800, 
  height = 600, 
  className = '' 
}: InteractiveNetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [filterRisk, setFilterRisk] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const { nodes, links } = generateNetworkData()

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Filter data based on current filters
    const filteredNodes = nodes.filter(node => {
      if (filterRisk !== 'all' && node.risk !== filterRisk) return false
      if (filterType !== 'all' && node.type !== filterType) return false
      return true
    })

    const filteredLinks = links.filter(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id
      const targetId = typeof link.target === 'string' ? link.target : link.target.id
      return filteredNodes.some(n => n.id === sourceId) && filteredNodes.some(n => n.id === targetId)
    })

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform)
        setZoomLevel(event.transform.k)
      })

    svg.call(zoom)

    const container = svg.append('g')

    // Create simulation
    const simulation = d3.forceSimulation<NetworkNode>(filteredNodes)
      .force('link', d3.forceLink<NetworkNode, NetworkLink>(filteredLinks).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30))

    // Color schemes
    const riskColors = {
      low: '#10b981',
      medium: '#f59e0b', 
      high: '#ef4444',
      critical: '#dc2626'
    }

    const typeColors = {
      wallet: '#3b82f6',
      exchange: '#10b981',
      mixer: '#ef4444',
      contract: '#8b5cf6',
      defi: '#06b6d4'
    }

    const linkColors = {
      normal: '#e5e7eb',
      suspicious: '#fca5a5',
      high_volume: '#93c5fd'
    }

    // Draw links
    const link = container.append('g')
      .selectAll('line')
      .data(filteredLinks)
      .enter().append('line')
      .attr('stroke', d => linkColors[d.type])
      .attr('stroke-width', d => Math.sqrt(d.value / 10000) + 1)
      .attr('stroke-opacity', 0.6)

    // Draw nodes
    const node = container.append('g')
      .selectAll('g')
      .data(filteredNodes)
      .enter().append('g')
      .call(d3.drag<SVGGElement, NetworkNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    // Node circles
    node.append('circle')
      .attr('r', d => Math.sqrt(d.value / 1000) + 10)
      .attr('fill', d => riskColors[d.risk])
      .attr('stroke', d => typeColors[d.type])
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedNode(d)
      })
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', Math.sqrt(d.value / 1000) + 15)
          .attr('stroke-width', 5)
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', Math.sqrt(d.value / 1000) + 10)
          .attr('stroke-width', 3)
      })

    // Node labels
    node.append('text')
      .text(d => d.label)
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .style('pointer-events', 'none')

    // Risk indicators
    node.filter(d => d.risk === 'critical' || d.risk === 'high')
      .append('circle')
      .attr('r', 5)
      .attr('cx', d => Math.sqrt(d.value / 1000) + 5)
      .attr('cy', d => -(Math.sqrt(d.value / 1000) + 5))
      .attr('fill', '#ef4444')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)

    function dragstarted(event: any, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: NetworkNode) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: NetworkNode) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as NetworkNode).x!)
        .attr('y1', d => (d.source as NetworkNode).y!)
        .attr('x2', d => (d.target as NetworkNode).x!)
        .attr('y2', d => (d.target as NetworkNode).y!)

      node
        .attr('transform', d => `translate(${d.x},${d.y})`)
    })

    return () => {
      simulation.stop()
    }
  }, [nodes, links, filterRisk, filterType, width, height])

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 3000)
  }

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.5
    )
  }

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.67
    )
  }

  const handleReset = () => {
    const svg = d3.select(svgRef.current)
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 ${className}`}
    >
      {/* Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-gray-900">Network Analysis</h3>
          <div className="flex items-center gap-2">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1"
            >
              <option value="all">All Types</option>
              <option value="wallet">Wallets</option>
              <option value="exchange">Exchanges</option>
              <option value="mixer">Mixers</option>
              <option value="defi">DeFi</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-xs text-gray-500 min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="h-3 w-3 border border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Analyzing...</span>
              </>
            ) : (
              <>
                <Filter className="h-3 w-3" />
                <span className="text-xs">Analyze</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Network Graph */}
      <div className="relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="cursor-move"
        />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-blue-500" />
              <span className="text-xs text-gray-600">Low Risk Wallet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-blue-500" />
              <span className="text-xs text-gray-600">Medium Risk Wallet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-blue-500" />
              <span className="text-xs text-gray-600">High Risk Wallet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-red-500" />
              <span className="text-xs text-gray-600">Critical Risk</span>
            </div>
          </div>
        </div>

        {/* Selected Node Info */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 bg-white rounded-xl p-4 shadow-lg border border-gray-200 min-w-[250px]"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Node Details</h4>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Address:</span>
                <span className="ml-2 font-mono">{selectedNode.label}</span>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <span className="ml-2 capitalize">{selectedNode.type}</span>
              </div>
              <div>
                <span className="text-gray-500">Risk Level:</span>
                <span className={`ml-2 capitalize font-medium ${
                  selectedNode.risk === 'critical' ? 'text-red-600' :
                  selectedNode.risk === 'high' ? 'text-red-500' :
                  selectedNode.risk === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {selectedNode.risk}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Volume:</span>
                <span className="ml-2">Rp {selectedNode.value.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-gray-500">Transactions:</span>
                <span className="ml-2">{selectedNode.transactions}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}