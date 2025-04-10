'use client'

import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RiArrowGoBackFill } from "react-icons/ri";

export default function ForgotPasswordPage() {
    const { register, handleSubmit } = useForm<{ email: string }>()
    const { sendOtpForReset } = useAuth()
    const router = useRouter()

    const onSubmit = ({ email }: { email: string }) => {
        sendOtpForReset.mutate(
            { email },
            {
                onSuccess: () => {
                    sessionStorage.setItem('reset-email', email)
                    router.push('/forgot-password/verify')
                },
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
                <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
                <input
                    type="email"
                    {...register('email', { required: true })}
                    placeholder="Enter your email"
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded"
                >
                    Send OTP
                </button>
            </form>
        </div>
    )
}
