'use client'

import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RiArrowGoBackFill } from "react-icons/ri"
import { toast } from 'react-hot-toast'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

export default function VerifyForgotPasswordPage() {
    const { register, handleSubmit } = useForm<{
        token: string
        newPassword: string
    }>()
    const { verifyForgotPasswordOtp } = useAuth()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        const savedEmail = sessionStorage.getItem('reset-email')
        if (!savedEmail) {
            router.push('/forgot-password')
        } else {
            setEmail(savedEmail)
        }
    }, [router])

    const onSubmit = (data: { token: string; newPassword: string }) => {
        verifyForgotPasswordOtp.mutate(
            { email, ...data },
            {
                onSuccess: () => {
                    toast.success('Password changed successfully!')
                    sessionStorage.removeItem('reset-email')
                    router.push('/login')
                },
                onError: (err: unknown) => {
                    if (err instanceof Error) {
                        toast.error(err.message)
                    } else {
                        toast.error('Something went wrong!')
                    }
                }
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
            <form onSubmit={handleSubmit(onSubmit)}
                className="bg-white dark:bg-gray-800 p-6 rounded-md w-[90%] md:min-w-[400px] max-w-md mx-auto space-y-4 shadow-line"
            >
                <h2 className="text-xl font-semibold mb-4">Verify OTP & Set New Password</h2>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    {...register('token', { required: true })}
                    className="w-full p-2 border rounded"
                />
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        {...register('newPassword', { required: true, minLength: 6 })}
                        className="w-full p-2 border rounded pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xl text-gray-600"
                    >
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded"
                >
                    Reset Password
                </button>
            </form>
        </div>
    )
}
