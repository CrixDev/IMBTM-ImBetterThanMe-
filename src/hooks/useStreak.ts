import { useMemo } from 'react'
import type { Addiction } from '@/types'

export function useStreak(addiction: Addiction) {
  return useMemo(() => {
    const startDate = addiction.last_relapse || addiction.start_date
    const now = new Date()
    const start = new Date(startDate)
    
    const diffTime = now.getTime() - start.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
    
    return {
      days: Math.max(0, diffDays),
      hours: Math.max(0, diffHours),
      minutes: Math.max(0, diffMinutes),
      totalHours: Math.max(0, Math.floor(diffTime / (1000 * 60 * 60))),
      maxStreak: addiction.max_streak_days
    }
  }, [addiction.last_relapse, addiction.start_date, addiction.max_streak_days])
}

export function formatStreakText(days: number): string {
  if (days === 0) return 'Comenzando'
  if (days === 1) return '1 día'
  if (days < 7) return `${days} días`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    const remainingDays = days % 7
    if (remainingDays === 0) return `${weeks} semana${weeks > 1 ? 's' : ''}`
    return `${weeks} semana${weeks > 1 ? 's' : ''} y ${remainingDays} día${remainingDays > 1 ? 's' : ''}`
  }
  if (days < 365) {
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    if (remainingDays === 0) return `${months} mes${months > 1 ? 'es' : ''}`
    return `${months} mes${months > 1 ? 'es' : ''} y ${remainingDays} día${remainingDays > 1 ? 's' : ''}`
  }
  const years = Math.floor(days / 365)
  const remainingDays = days % 365
  if (remainingDays === 0) return `${years} año${years > 1 ? 's' : ''}`
  return `${years} año${years > 1 ? 's' : ''} y ${remainingDays} día${remainingDays > 1 ? 's' : ''}`
}

