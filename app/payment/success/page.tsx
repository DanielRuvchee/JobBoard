import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccess() {
    return (
        <div className="w-full min-h-screen flex flex-1 items-center justify-center">
            <Card className="w-[350px]">
                <div className="p-6">
                    <div className="w-full flex items-center justify-center">
                        <Check className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full"/>
                    </div>

                    <div className="mt-3 text-center sm:mt-5 w-full">
                        <h2 className="text-xl font-semibold">Payment Successful</h2>
                        <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">Thank you for your payment. Your job post has been created and is now live on the platform.</p>

                        <Button asChild className="w-full mt-5">
                            <Link href="/">
                                Go Back to Homepage
                            </Link>
                        </Button>
                    </div>
                </div>

            </Card>
            
        </div>
    )
}