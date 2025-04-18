'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export const useAuth = () => {
  const queryClient = useQueryClient()

  // Fetch current user using TanStack Query
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw new Error(error.message)
      return data.user
    },
  })

  // Email/Password Signup
  const signUp = useMutation({
    mutationFn: async ({
      email,
      password,
      fullName,
    }: {
      email: string
      password: string
      fullName: string
    }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${location.origin}/auth/callback`, 
        },
      })
      if (error) throw new Error(error.message)
    },
  })

  // OTP Verify after Signup
  const verifyEmailOtp = useMutation({
    mutationFn: async ({
      email,
      token,
    }: { email: string; token: string }) => {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      })
      if (error) throw new Error(error.message)
    },
  })

  // Email/Password Login
  const login = useMutation({
    mutationFn: async ({
      email,
      password,
    }: { email: string; password: string }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw new Error(error.message)
    },
  })

  // Forgot Password → Send OTP
  const sendOtpForReset = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw new Error(error.message)
    },
  })

  // Verify OTP & Set New Password
  const verifyForgotPasswordOtp = useMutation({
    mutationFn: async ({
      email,
      token,
      newPassword,
    }: {
      email: string
      token: string
      newPassword: string
    }) => {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery',
      })
      if (error) throw new Error(error.message)

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (updateError) throw new Error(updateError.message)
    },
  })

  // ✅ Logout
  const logout = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.setQueryData(['current-user'], null) 
    },
  })

  // Login with Google
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) throw new Error(error.message)
  }

  // Login with Facebook
  const loginWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' })
    if (error) throw new Error(error.message)
  }

  return {
    user,
    isUserLoading,
    signUp,
    verifyEmailOtp,
    login,
    sendOtpForReset,
    verifyForgotPasswordOtp,
    logout,
    loginWithGoogle,
    loginWithFacebook,
  }
}
