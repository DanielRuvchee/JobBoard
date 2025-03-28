
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { ChevronDown } from "lucide-react"
import { DropdownMenuLabel } from "../ui/dropdown-menu"
export function UserDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                    <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                            Daniel
                        </AvatarFallback>
                    </Avatar>

                    <ChevronDown size={16} strokeWidth={2} className="ml-2 opacity-60" />
                </Button>
            </DropdownMenuTrigger>

            
                <DropdownMenuContent className="w-48 align-end">
                    <DropdownMenuLabel>
                        <span className="font-medium text-sm text-foreground">Daniel</span>
                    </DropdownMenuLabel>
                </DropdownMenuContent>
        </DropdownMenu>
    )
}