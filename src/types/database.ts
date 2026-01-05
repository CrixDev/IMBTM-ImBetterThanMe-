export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      addictions: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          name: string
          icon: string
          start_date: string
          last_relapse?: string | null
          is_active?: boolean
          created_at?: string
          max_streak_days?: number
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          icon?: string
          start_date?: string
          last_relapse?: string | null
          is_active?: boolean
          created_at?: string
          max_streak_days?: number
        }
      }
      relapses: {
        Row: {
          id: string
          addiction_id: string
          relapse_date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          addiction_id: string
          relapse_date: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          addiction_id?: string
          relapse_date?: string
          notes?: string | null
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          addiction_id: string
          achievement_type: string
          streak_days: number
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          addiction_id: string
          achievement_type: string
          streak_days: number
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          addiction_id?: string
          achievement_type?: string
          streak_days?: number
          unlocked_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

