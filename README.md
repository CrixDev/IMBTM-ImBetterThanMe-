# ImBetterThanMe (IMBTM)

Una PWA minimalista y profesional para el control de adicciones y hábitos con sistema de rachas y logros.

## Características

- **Control de Rachas**: Registra cuántos días llevas sin consumir una adicción
- **Sistema de Logros**: Desbloquea logros basados en tus rachas máximas
  - Primera Semana (7 días)
  - Un Mes Fuerte (30 días)
  - Trimestre de Oro (90 días)
  - Medio Año (180 días)
  - Leyenda (365 días)
- **PWA Instalable**: Añade la app a tu pantalla de inicio
- **Modo Offline**: Visualiza tus datos sin conexión
- **Diseño Minimalista**: Estilo profesional blanco y negro
- **Mobile-First**: Optimizado para uso en móvil

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS v4 (tema B&N personalizado)
- **Iconos**: Lucide React
- **Backend**: Supabase (Auth + PostgreSQL)
- **Estado**: Zustand
- **PWA**: vite-plugin-pwa
- **Utilidades**: clsx, tailwind-merge, class-variance-authority

## Diseño

La aplicación sigue un sistema de diseño minimalista y profesional:

- **Colores**: Esquema estricto blanco y negro
- **Tipografía**: Outfit (Google Fonts)
- **Espaciado**: Generoso y nunca pegado a bordes
- **Componentes**: Inspirados en shadcn/ui
- **Consistencia**: Reglas definidas en `.cursorrules`

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

Crea un archivo `.env` con tus credenciales de Supabase:
```
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

4. Configura Supabase:

Ejecuta los scripts SQL en el dashboard de Supabase (ver sección "Base de Datos")

5. Inicia el servidor de desarrollo:
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
│   ├── RelapseModal.tsx
│   └── icons.tsx
├── pages/               # Páginas principales
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── Achievements.tsx
├── hooks/               # Custom hooks
│   └── useStreak.ts
├── lib/                 # Configuración externa
│   ├── supabase.ts
│   └── utils.ts
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

Ejecuta estos scripts en el SQL Editor de Supabase:

**1. Tabla `addictions`:**
```sql
CREATE TABLE IF NOT EXISTS public.addictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'target',
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_relapse TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_streak_days INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addictions_user_id ON public.addictions(user_id);
ALTER TABLE public.addictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own addictions" ON public.addictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own addictions" ON public.addictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addictions" ON public.addictions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own addictions" ON public.addictions FOR DELETE USING (auth.uid() = user_id);
```

**2. Tabla `relapses`:**
```sql
CREATE TABLE IF NOT EXISTS public.relapses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  addiction_id UUID NOT NULL REFERENCES public.addictions(id) ON DELETE CASCADE,
  relapse_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_relapses_addiction_id ON public.relapses(addiction_id);
ALTER TABLE public.relapses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view relapses of their addictions" ON public.relapses FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.addictions WHERE addictions.id = relapses.addiction_id AND addictions.user_id = auth.uid()));
CREATE POLICY "Users can create relapses for their addictions" ON public.relapses FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.addictions WHERE addictions.id = relapses.addiction_id AND addictions.user_id = auth.uid()));
CREATE POLICY "Users can delete relapses of their addictions" ON public.relapses FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.addictions WHERE addictions.id = relapses.addiction_id AND addictions.user_id = auth.uid()));
```

**3. Tabla `achievements`:**
```sql
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addiction_id UUID NOT NULL REFERENCES public.addictions(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  streak_days INTEGER NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(addiction_id, achievement_type)
);

CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements" ON public.achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own achievements" ON public.achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la app para producción
- `npm run preview` - Previsualiza la build de producción

## API Documentation

La documentación de la API está disponible en `openapi.yaml`.

## Sistema de Diseño

El proyecto sigue reglas estrictas de diseño definidas en `.cursorrules`:
- Esquema de colores blanco y negro puro
- Espaciado generoso (nunca pegado a bordes)
- Contenido máximo: 672px (max-w-2xl)
- Componentes minimalistas y profesionales

## Licencia

MIT
