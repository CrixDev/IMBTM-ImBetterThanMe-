interface LogoProps {
  className?: string
  variant?: 'isotipo' | 'full'
}

export function Logo({ className = '', variant = 'isotipo' }: LogoProps) {
  if (variant === 'isotipo') {
    return (
      <img 
        src="/src/assets/Isotipo_IMBTM.svg" 
        alt="IMBTM" 
        className={className}
      />
    )
  }

  return (
    <img 
      src="/src/assets/Logo_IMBTM.svg" 
      alt="ImBetterThanMe" 
      className={className}
    />
  )
}

