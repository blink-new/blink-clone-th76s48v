import { useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AuthContext, AuthContextType, UserProfile } from './auth-context'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user profile from database
  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userId)
        .maybeSingle()
      
      if (error) {
        console.error('Error loading user profile:', error)
        return null
      }
      
      if (profile) {
        setUserProfile(profile)
      }
      return profile
    } catch (error) {
      console.error('Error loading user profile:', error)
      return null
    }
  }

  // Create user profile if it doesn't exist
  const createUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .insert({
          auth_id: authUser.id,
          email: authUser.email || '',
          display_name: authUser.user_metadata?.display_name || null,
          avatar_url: authUser.user_metadata?.avatar_url || null,
          api_keys: {},
          settings: {}
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error creating user profile:', error)
        return null
      }
      
      if (profile) {
        setUserProfile(profile)
      }
      return profile
    } catch (error) {
      console.error('Error creating user profile:', error)
      return null
    }
  }

  // Handle auth state changes
  const handleAuthStateChange = useCallback(async (authUser: User | null) => {
    try {
      if (authUser) {
        // Try to load existing profile
        let profile = await loadUserProfile(authUser.id)
        
        // If no profile exists, create one
        if (!profile) {
          profile = await createUserProfile(authUser)
        }
        
        setUser(authUser)
        setUserProfile(profile)
      } else {
        setUser(null)
        setUserProfile(null)
      }
    } catch (error) {
      console.error('Error handling auth state change:', error)
      // Still set the user even if profile operations fail
      setUser(authUser)
      setUserProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    
    // Get initial session with retry logic
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          console.error('Auth session error:', error)
          setSession(null)
          handleAuthStateChange(null)
        } else {
          setSession(session)
          handleAuthStateChange(session?.user ?? null)
        }
      } catch (error) {
        console.error('Auth session catch error:', error)
        if (mounted) {
          setSession(null)
          handleAuthStateChange(null)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session)
        handleAuthStateChange(session?.user ?? null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [handleAuthStateChange])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value: AuthContextType = {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}