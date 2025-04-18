'use client'

import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import Link from 'next/link'
import { RiArrowGoBackFill } from "react-icons/ri"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useState } from 'react'

type LoginData = {
  email: string
  password: string
}

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithFacebook } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>()

  const onSubmit = (data: LoginData) => {
    login.mutate(data, {
      onSuccess: () => {
        toast.success('Login successful!')
        router.push('/homepage')
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message)
        } else {
          toast.error('Login failed')
        }
      },
    })
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Google login failed')
      }
    }
  }
  

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Facebook login failed')
      }
    }
  }
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Link
        href="/"
        className="absolute top-5 right-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        <RiArrowGoBackFill />
        Back
      </Link>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-6 rounded-md w-[90%] md:min-w-[400px] max-w-md mx-auto space-y-4 shadow-line"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>

        <input
          {...register('email', { required: 'Email is required' })}
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <div className="relative">
          <input
            {...register('password', { required: 'Password is required' })}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xl text-gray-600"
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>

        <div className="flex items-center justify-center text-sm text-gray-500">or</div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center gap-2 w-full justify-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <FcGoogle className="text-xl" />
          Login with Google
        </button>

        <button
          type="button"
          onClick={handleFacebookLogin}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          <FaFacebook className="text-xl" />
          Login with Facebook
        </button>

        <div className="flex flex-col items-end gap-2 text-sm text-blue-600 dark:text-blue-400 pb-2">
          <Link href="/forgot-password" className="hover:underline mt-3">
            Forgot password?
          </Link>
          <p>
            {`Don't have an account?`}{' '}
            <Link href="/signup" className="underline hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
