export interface User {
  id: string
  email: string
  created_at: string
}

export interface Addiction {
  id: string
  user_id: string
  name: string
  icon: string
  start_date: string
  last_relapse: string | null
  is_active: boolean
  created_at: string
  max_streak_days: number
}

export interface Relapse {
  id: string
  addiction_id: string
  relapse_date: string
  notes: string | null
  created_at: string
}

export interface Achievement {
  id: string
  user_id: string
  addiction_id: string
  achievement_type: AchievementType
  streak_days: number
  unlocked_at: string
}

export type AchievementType = 
  | 'first_week'      // 7 días
  | 'one_month'       // 30 días
  | 'quarter'         // 90 días
  | 'half_year'       // 180 días
  | 'legend'          // 365 días

export interface AchievementDefinition {
  type: AchievementType
  name: string
  description: string
  days: number
  icon: string
  color: string
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    type: 'first_week',
    name: 'Primera Semana',
    description: '7 días de racha',
    days: 7,
    icon: 'sprout',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    type: 'one_month',
    name: 'Un Mes Fuerte',
    description: '30 días de racha',
    days: 30,
    icon: 'biceps-flexed',
    color: 'from-amber-500 to-amber-600'
  },
  {
    type: 'quarter',
    name: 'Trimestre de Oro',
    description: '90 días de racha',
    days: 90,
    icon: 'trophy',
    color: 'from-yellow-400 to-yellow-500'
  },
  {
    type: 'half_year',
    name: 'Medio Año',
    description: '180 días de racha',
    days: 180,
    icon: 'star',
    color: 'from-violet-500 to-violet-600'
  },
  {
    type: 'legend',
    name: 'Leyenda',
    description: '365 días de racha',
    days: 365,
    icon: 'crown',
    color: 'from-rose-500 to-rose-600'
  }
]

export const ADDICTION_ICONS = [
  { icon: 'cigarette', label: 'Tabaco' },
  { icon: 'beer', label: 'Alcohol' },
  { icon: 'smartphone', label: 'Redes Sociales' },
  { icon: 'gamepad-2', label: 'Videojuegos' },
  { icon: 'coffee', label: 'Cafeína' },
  { icon: 'candy', label: 'Azúcar' },
  { icon: 'utensils', label: 'Comida rápida' },
  { icon: 'pill', label: 'Medicamentos' },
  { icon: 'dice-5', label: 'Apuestas' },
  { icon: 'shopping-cart', label: 'Compras' },
  { icon: 'tv', label: 'TV/Streaming' },
  { icon: 'moon', label: 'Dormir tarde' }
]
