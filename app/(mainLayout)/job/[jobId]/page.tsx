import arcjet, { detectBot, tokenBucket } from "@/app/utils/arcjet";
import { auth } from "@/app/utils/auth";
import { getFlagEmoji } from "@/app/utils/countryList";
import { countryList } from "@/app/utils/countryList";
import { prisma } from "@/app/utils/db";
import { benefits } from "@/app/utils/listOfBenefits";
import { JsonToHtml } from "@/components/general/JsonToHtml";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { request } from "@arcjet/next";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

const aj = arcjet.withRule(
    detectBot({
        mode: "LIVE",
        allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW']
    })
)

function getClient(session: boolean) {
    if(session) {
        return aj.withRule(
            tokenBucket({
                mode: "DRY_RUN",
                capacity: 100,
                interval: 60,
                refillRate: 30,
            })
        )
    } else {
        return aj.withRule(
            tokenBucket({
                mode: "DRY_RUN",
                capacity: 100,
                interval: 60,
                refillRate: 10,
            })
        )
    }

}



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
            listingDuration: true,
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
    const session = await auth()
    const { jobId } = await params

    const req = await request()
    const decision = await getClient(!!session).protect(req, {requested: 10})

    if(decision.isDenied()) {
        throw new Error("Forbidden")
    }

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
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">

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
            <div className="space-y-6">
                <Card className="p-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold">Apply Now</h3>
                            <p className="text-sm text-muted-foreground mt-1">Please let {data.company.name} know you are interested in the role of {data.jobTitle}.</p>
                        </div>

                        <Button className="w-full" >
                            Apply Now
                        </Button>
                    </div>
                </Card>

                {/* job details card */}
                <Card className="p-6">
                    <h3 className="font-semibold">About the Job</h3>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Apply before</span>
                            <span className="text-sm">{new Date(data.createdAt.getTime() + data.listingDuration * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"})}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Posted on</span>
                            <span className="text-sm">{data.createdAt.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"})}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Employment Type</span>
                            <span className="text-sm">{data.employmentType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Location</span>
                            <span className="text-sm">{locationFlag && <span className="mr-1">{locationFlag}</span>}
                                {locationName}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Company details card */} 
                <Card className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Image src={data.company.logo} alt={data.company.name} width={48} height={48} className="rounded-full size-12" />
                            <div className="flex flex-col">
                                <h3 className="font-semibold">{data.company.name}</h3>
                                <p className="text-sm text-muted-foreground align-clamp-3">{data.company.about}</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            
        </div>
    )
}