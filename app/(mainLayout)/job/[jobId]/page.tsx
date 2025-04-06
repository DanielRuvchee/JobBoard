import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";

export default function JobIdPage() {
    return (
        <div className="grid lg:grid-cols-[1fr, 400px] gap-8">

            <div className="space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Job Title</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <p className="font-medium">Marshall LLC</p>

                            <span className="hidden md:inline text-muted-foreground">*</span>

                            <Badge className="rounded-full" variant="secondary">
                                Full-Time
                            </Badge>
                            <span className="hidden md:inline text-muted-foreground">*</span>
                            <Badge className="rounded-full">
                                Macedonia
                            </Badge>
                        </div>
                    </div>

                    <Button variant="outline">
                        <HeartIcon size={4}/>
                        Save Job
                    </Button>
                </div>

                <section>
                    A lot of data here.....
                </section>
            </div>
            
        </div>
    )
}