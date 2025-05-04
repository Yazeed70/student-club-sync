
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export function useSupabase() {
  const { user } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase.from('users').select('count')
        if (error) throw error
        setIsConnected(true)
      } catch (error) {
        console.error('Supabase connection error:', error)
        setIsConnected(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()
  }, [])

  const createUserProfile = async (userData: any) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: userData.email,
            username: userData.username || userData.email.split('@')[0],
            name: userData.name || userData.username,
            role: 'student'
          }
        ])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating user profile:', error)
      return null
    }
  }

  return { 
    isConnected, 
    isLoading,
    createUserProfile,
    supabase
  }
}
