import { getFlagEmoji } from "@/app/utils/countryList";
import { countryList } from "@/app/utils/countryList";
import { prisma } from "@/app/utils/db";
import { benefits } from "@/app/utils/listOfBenefits";
import { JsonToHtml } from "@/components/general/JsonToHtml";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeartIcon } from "lucide-react";
import { Span } from "next/dist/trace";
import { notFound } from "next/navigation";

async function getJob(jobId: string) {
    const jobData = await prisma.jobPost.findUnique({
        where: {
            status: "ACTIVE",
            id: jobId
        },
        select: {
            jobTitle: true,
            jobDescription: true,
            location: true,
            employmentType: true,
            benefits: true,
            createdAt: true,
            company: {
                select: {
                    name: true,
                    logo: true,
                    location: true,
                    about: true,
                }
            }
        }
    })

    if(!jobData) {
        return notFound()
    }

    return jobData
}

type Params = Promise<{jobId: string}>

export  default async function JobIdPage({params}: {params: Params}) {
    const { jobId } = await params
    const data = await getJob(jobId)
    const locationFlag = getFlagEmoji(data.location)
    
    // Get the country name if it's a country code
    let locationName = data.location;
    if (data.location !== "worldwide") {
        const country = countryList.find(c => c.code === data.location);
        if (country) {
            locationName = country.name;
        }
    } else {
        locationName = "Worldwide / Remote";
    }

    return (
        <div className="grid lg:grid-cols-[1fr, 400px] gap-8">

            <div className="space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{data.jobTitle}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <p className="font-medium">{data.company.name}</p>

                            <span className="hidden md:inline text-muted-foreground">*</span>

                            <Badge className="rounded-full" variant="secondary">
                                {data.employmentType}
                            </Badge>
                            <span className="hidden md:inline text-muted-foreground">*</span>
                            <Badge className="rounded-full">
                                {locationFlag && <span className="mr-1">{locationFlag}</span>}
                                {locationName}
                            </Badge>
                        </div>
                    </div>

                    <Button variant="outline">
                        <HeartIcon size={4}/>
                        Save Job
                    </Button>
                </div>

                <section>
                    <JsonToHtml json={JSON.parse(data.jobDescription)} />
                </section>

                <section>
                    <h3 className="font-semibold mb-4">
                        Benefits {" "}
                        <span className="text-muted-foreground text-sm font-normal">(green is offered)</span>
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        {benefits.map((benefit) => {
                            const isOffered = data.benefits.includes(benefit.id)
                            return <Badge className={cn(
                                isOffered ? "" : "opacity-75 cursor-not-allowed", "text-sm px-4 py-1.5 rounded-full"
                            )} key={benefit.id} variant={isOffered ? "default" : "outline"} >
                            <span className="flex items-center gap-2">
                                {benefit.icon}
                                {benefit.label}
                            </span>
                        </Badge>
                        })}
                    </div>
                </section>
            </div>
            
        </div>
    )
}