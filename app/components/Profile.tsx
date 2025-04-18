"use client";

import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ChevronDown } from "lucide-react";

const Profile = () => {
    const { user, logout } = useAuth();
    const queryClient = useQueryClient();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleLogoutConfirm = () => {
        const isDarkMode = document.documentElement.classList.contains("dark");

        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out from your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: isDarkMode ? "#3b82f6" : "#3085d6",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "Yes, logout",
            cancelButtonText: "Cancel",
            background: isDarkMode ? "#1f2937" : "#ffffff",
            color: isDarkMode ? "#f3f4f6" : "#000000",
        }).then((result) => {
            if (result.isConfirmed) {
                logout.mutate(undefined, {
                    onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["current-user"] });
                        router.push("/");
                    },
                });
            }
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const userInitial =
        user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || "U";
    const userName = user?.user_metadata?.full_name || "Unknown User";
    const userEmail = user?.email || "unknown@example.com";

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="flex items-center gap-0 cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
            >
                <Avatar className="w-12 h-12 border-2 shadow-sm">
                    <AvatarFallback
                        className="w-full h-full flex items-center justify-center rounded-full text-lg font-bold
                        text-black dark:text-white 
                        bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 
                        dark:from-pink-600 dark:via-purple-600 dark:to-indigo-600"
                    >
                        {userInitial}
                    </AvatarFallback>
                </Avatar>
                <ChevronDown size={18} className="text-gray-500 dark:text-gray-300" />
            </div>

            {open && (
                <div className="absolute right-5 mt-2 w-56 z-50">
                    <div className="absolute top-[-5px] right-6 w-3 h-3 rotate-45 bg-white dark:bg-gray-800 border-l border-t border-gray-300 dark:border-gray-600 z-20"></div>

                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                        <div className="p-4">
                            <div className="text-sm font-medium">{userName}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleLogoutConfirm}
                                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
