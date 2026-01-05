# ImBetterThanMe (IMBTM)

Una PWA para el control de adicciones y hábitos con sistema de rachas y logros.

## Características

- **Control de Rachas**: Registra cuántos días llevas sin consumir una adicción
- **Sistema de Logros**: Desbloquea logros basados en tus rachas máximas
  - 🌱 Primera Semana (7 días)
  - 💪 Un Mes Fuerte (30 días)
  - 🏆 Trimestre de Oro (90 días)
  - ⭐ Medio Año (180 días)
  - 👑 Leyenda (365 días)
- **PWA Instalable**: Añade la app a tu pantalla de inicio
- **Modo Offline**: Visualiza tus datos sin conexión
- **Diseño Mobile-First**: Optimizado para uso en móvil

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS v4
- **Backend**: Supabase (Auth + PostgreSQL)
- **Estado**: Zustand
- **PWA**: vite-plugin-pwa

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/imbetterthanme.git
cd imbetterthanme
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:
```
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── AddictionCard.tsx
│   ├── AddAddictionModal.tsx
│   ├── AchievementBadge.tsx
│   ├── AchievementToast.tsx
│   ├── Layout.tsx
│   └── RelapseModal.tsx
├── pages/               # Páginas principales
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── Achievements.tsx
├── hooks/               # Custom hooks
│   └── useStreak.ts
├── lib/                 # Configuración externa
│   └── supabase.ts
├── stores/              # Estado global (Zustand)
│   ├── authStore.ts
│   └── addictionStore.ts
├── types/               # TypeScript types
│   ├── index.ts
│   └── database.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Base de Datos

El proyecto utiliza 3 tablas principales en Supabase:

- **addictions**: Almacena las adicciones/hábitos del usuario
- **relapses**: Registro de recaídas
- **achievements**: Logros desbloqueados

Todas las tablas tienen Row Level Security (RLS) habilitado.

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la app para producción
- `npm run preview` - Previsualiza la build de producción

## API Documentation

La documentación de la API está disponible en `openapi.yaml`.

## Licencia

MIT

