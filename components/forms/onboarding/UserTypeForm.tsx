import { Button } from "@/components/ui/button";
import { Building2, UserRound } from "lucide-react";

export function UserTypeSelection() {
    return ( 
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Welcome! Lets get started</h2>
                <p className="text-muted-foreground">Please select the type of account you want to use!</p>
            </div>

            <div className="grid gap-4">
                <Button variant="outline"
                 className="w-full h-auto p-6 items-center gap-4 border-2
                 tranistion-all duration-200 hover:border-primary hover:bg-primary/5">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="size-6 text-primary" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-lg font-semibold">Company / Organization</h3>
                        <p>Post jobs and find exceptional talent</p>
                        
                    </div>
                </Button>

                <Button variant="outline"
                 className="w-full h-auto p-6 items-center gap-4 border-2
                 tranistion-all duration-200 hover:border-primary hover:bg-primary/5">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserRound className="size-6 text-primary" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-lg font-semibold">Job Seeker</h3>
                        <p>Find your dream job and apply to it</p>
                        
                    </div>
                </Button>
            </div>
        </div>
    )
}