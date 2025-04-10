"use client";

import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ChevronDown } from "lucide-react";

const Profile = () => {
    const { user, logout } = useAuth();
    const queryClient = useQueryClient();
    const router = useRouter();

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

    const userInitial =
        user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || "U";
    const userName = user?.user_metadata?.full_name || "Unknown User";
    const userEmail = user?.email || "unknown@example.com";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
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
            </DropdownMenuTrigger>

            <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={10}
                className="w-56 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
            >
                <DropdownMenuLabel>
                    <div className="text-sm font-medium">{userName}</div>
                    <div className="text-xs text-muted-foreground">{userEmail}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogoutConfirm}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Profile;
