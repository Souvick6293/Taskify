'use client'

import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import Link from 'next/link'
import { RiArrowGoBackFill } from "react-icons/ri";

type FormData = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  otp: string
}

export default function SignUpPage() {
  const { signUp, verifyEmailOtp, loginWithGoogle, loginWithFacebook } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState<'signup' | 'otp'>('signup')
  const [email, setEmail] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [password, setPassword] = useState('')
  const [timeLeft, setTimeLeft] = useState(120)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  useEffect(() => {
    if (step === 'otp' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [step, timeLeft])

  const onSubmitSignup = (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setEmail(data.email)
    setPassword(data.password)

    signUp.mutate(
      {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      },
      {
        onSuccess: () => {
          toast.success('OTP sent to your email')
          setStep('otp')
          setTimeLeft(120)
        },
        onError: (err: any) => {
          const errorMessage =
            err?.response?.data?.message || err?.message || 'Signup failed'

          if (errorMessage.toLowerCase().includes('user already registered')) {
            toast.error('This email is already registered. Please login.')
          } else {
            toast.error(errorMessage)
          }

          setStep('signup')
        },
      }
    )
  }

  const onSubmitOtp = (data: { otp: string }) => {
    if (timeLeft <= 0) {
      toast.error('OTP expired. Please sign up again.')
      return
    }

    verifyEmailOtp.mutate(
      { email, token: data.otp },
      {
        onSuccess: () => {
          toast.success('Email verified successfully!')
          router.push('/login')
        },
        onError: (err: any) => toast.error(err.message),
      }
    )
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
        onSubmit={handleSubmit(step === 'signup' ? onSubmitSignup : onSubmitOtp)}
        className="bg-white dark:bg-gray-800 p-6 rounded-md w-[90%] md:min-w-[400px] max-w-md mx-auto space-y-4 shadow-line"
      >
        <h2 className="text-xl font-bold text-center">
          {step === 'signup' ? 'Sign Up with Email OTP' : 'Verify OTP'}
        </h2>

        {/* OAuth Buttons */}
        {step === 'signup' && (
          <>
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FcGoogle className="text-xl" />
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={loginWithFacebook}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              <FaFacebook className="text-xl" />
              <span>Continue with Facebook</span>
            </button>
            <div className="text-center text-gray-400">OR</div>
          </>
        )}

        {step === 'signup' && (
          <>
            <input
              {...register('fullName', { required: 'Full Name is required' })}
              placeholder="Full Name"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}

            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <input
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              })}
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

            <input
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              })}
              type="password"
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </>
        )}

        {step === 'otp' && (
          <>
            <input
              {...register('otp', { required: 'OTP is required' })}
              placeholder="Enter OTP"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}

            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Time left: {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
              {(timeLeft % 60).toString().padStart(2, '0')}
            </p>
          </>
        )}

        <button
          type="submit"
          disabled={step === 'otp' && timeLeft <= 0}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {step === 'signup' ? 'Send OTP' : 'Verify'}
        </button>
        <div className="text-sm text-right text-blue-600 dark:text-blue-400 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="underline hover:text-blue-800">
            Login
          </Link>
        </div>

      </form>
    </div>
  )
}
