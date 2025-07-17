import { createContext } from 'react'
import { User, Session } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  auth_id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  api_keys: Record<string, string>
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface AuthContextType {
  user: User | null
  session: Session | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)