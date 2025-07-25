import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
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
  if (score >= 80) return 'text-red-600 bg-red-50 border-red-200'
  if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200'
  if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  return 'text-green-600 bg-green-50 border-green-200'
}

export function getRiskLevel(score: number): string {
  if (score >= 80) return 'Risiko Tinggi'
  if (score >= 60) return 'Risiko Sedang'
  if (score >= 40) return 'Risiko Rendah'
  return 'Aman'
}