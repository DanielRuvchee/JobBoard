import { Ban, Plus, PlusCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export function EmptyState() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center h-full rounded-md border border-dashed p-8">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
               <Ban className="size-10 text-primary"/>
            </div>

            <h2 className="mt-6 text-xl font-semibold">No Jobs Posted</h2>
            <p className="mb-8 mt-2 text-sm text-center leading-tight text-muted-foreground max-w-sm text-balance">Filters not set correctly</p>

            <Link href="/" className={buttonVariants()}>
                <PlusCircle /> Go to Homepage
            </Link>
        </div>
    )
}