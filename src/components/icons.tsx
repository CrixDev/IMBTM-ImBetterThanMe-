import {
  Cigarette,
  Beer,
  Smartphone,
  Gamepad2,
  Coffee,
  Candy,
  Utensils,
  Pill,
  Dice5,
  ShoppingCart,
  Tv,
  Moon,
  Sprout,
  Trophy,
  Star,
  Crown,
  Target,
  Home,
  Sparkles,
  LogOut,
  Plus,
  X,
  RefreshCw,
  Lock,
  AlertTriangle,
  Check,
  type LucideIcon
} from 'lucide-react'

// Map icon names to components
const iconMap: Record<string, LucideIcon> = {
  'cigarette': Cigarette,
  'beer': Beer,
  'smartphone': Smartphone,
  'gamepad-2': Gamepad2,
  'coffee': Coffee,
  'candy': Candy,
  'utensils': Utensils,
  'pill': Pill,
  'dice-5': Dice5,
  'shopping-cart': ShoppingCart,
  'tv': Tv,
  'moon': Moon,
  'sprout': Sprout,
  'trophy': Trophy,
  'star': Star,
  'crown': Crown,
  'target': Target,
  'home': Home,
  'sparkles': Sparkles,
  'log-out': LogOut,
  'plus': Plus,
  'x': X,
  'refresh-cw': RefreshCw,
  'lock': Lock,
  'alert-triangle': AlertTriangle,
  'check': Check,
  'biceps-flexed': Trophy, // Fallback since biceps-flexed might not exist
}

interface IconProps {
  name: string
  className?: string
  size?: number
}

export function Icon({ name, className = '', size = 24 }: IconProps) {
  const IconComponent = iconMap[name] || Target
  return <IconComponent className={className} size={size} />
}

// Export individual icons for direct use
export {
  Cigarette,
  Beer,
  Smartphone,
  Gamepad2,
  Coffee,
  Candy,
  Utensils,
  Pill,
  Dice5,
  ShoppingCart,
  Tv,
  Moon,
  Sprout,
  Trophy,
  Star,
  Crown,
  Target,
  Home,
  Sparkles,
  LogOut,
  Plus,
  X,
  RefreshCw,
  Lock,
  AlertTriangle,
  Check
}

