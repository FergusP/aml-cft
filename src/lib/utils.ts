import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  // For very large numbers, use compact notation
  if (value >= 1_000_000_000_000) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      notation: 'compact',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value)
  }
  
  // For smaller numbers, use standard formatting
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value)
}

export function getRiskColor(score: number): string {
  if (score >= 80) return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20'
  if (score >= 60) return 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20'
  if (score >= 40) return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/20'
  return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20'
}

export function getRiskLevel(score: number): string {
  if (score >= 80) return 'Risiko Tinggi'
  if (score >= 60) return 'Risiko Sedang'
  if (score >= 40) return 'Risiko Rendah'
  return 'Aman'
}