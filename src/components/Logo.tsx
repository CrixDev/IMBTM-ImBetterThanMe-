import IsotipoIMBTM from '@/assets/Isotipo_IMBTM.svg?url'
import LogoIMBTM from '@/assets/Logo_IMBTM.svg?url'

interface LogoProps {
  className?: string
  variant?: 'isotipo' | 'full'
}

export function Logo({ className = '', variant = 'isotipo' }: LogoProps) {
  if (variant === 'isotipo') {
    return (
      <img 
        src={IsotipoIMBTM} 
        alt="IMBTM" 
        className={className}
      />
    )
  }

  return (
    <img 
      src={LogoIMBTM} 
      alt="ImBetterThanMe" 
      className={className}
    />
  )
}

