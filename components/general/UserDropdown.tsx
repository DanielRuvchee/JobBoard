import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { ChevronDown, Heart, Layers2, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/app/utils/auth"

interface iAppProps {
    email: string;
    name: string;
    image: string;
}

export function UserDropdown({email, name, image}: iAppProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                    <Avatar>
                        <AvatarImage src={image} />
                        <AvatarFallback>
                            {name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <ChevronDown size={16} strokeWidth={2} className="ml-2 opacity-60" />
                </Button>
            </DropdownMenuTrigger>

            
            <DropdownMenuContent className="w-48 align-end">
                <DropdownMenuLabel className="flex flex-col gap-1">
                    <span className="font-medium text-sm text-foreground">{name}</span>
                    <span className="text-xs text-muted-foreground">{email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/favorites" className="flex items-center gap-2 w-full">
                            <Heart size={16} strokeWidth={2} className="opacity-60" />
                            <span>Favorites Jobs</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/my-jobs" className="flex items-center gap-2 w-full">
                            <Layers2 size={16} strokeWidth={2} className="opacity-60" />
                            <span>My Job Listings</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/" });
                        }}
                    >
                        <button type="submit" className="w-full flex items-center gap-2">
                            <LogOut size={16} strokeWidth={2} className="opacity-60" />
                            <span>Log Out</span>
                        </button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}