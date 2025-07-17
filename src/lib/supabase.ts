import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://akjokhtbzyxmoydnpsvp.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFram9raHRienl4bW95ZG5wc3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NTQyMTQsImV4cCI6MjA2ODMzMDIxNH0.U3IDARkyM6W9X_DKbllJK7wzoJAYKoeqrYxb6I84RpU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Message {
  id: string
  user_id: string
  content: string
  type: 'user' | 'assistant'
  attachments?: any[]
  is_streaming?: boolean
  created_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
}