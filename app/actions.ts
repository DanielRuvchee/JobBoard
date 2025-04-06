"use server"

import { requireUser } from "./utils/requireUser"
import { z } from "zod"
import { companySchema, jobSchema, jobSeekerSchema } from "./utils/zodSchemas"
import { prisma } from "./utils/db"
import { redirect } from "next/navigation"
import arcjet from "./utils/arcjet"
import { request } from "@arcjet/next"
import { shield, detectBot } from "@arcjet/next"
import { stripe } from "./utils/stripe"
import { jobListingDurationPricing } from "./utils/JobListinDurationPricing"
import { inngest } from "./utils/inngest/client"
import { revalidatePath } from "next/cache"

const aj = arcjet.withRule(
    shield({
        mode: 'LIVE'
    })
).withRule(
    detectBot({
        mode: 'LIVE',
        allow: []
    })
)

export async function createCompany(data: z.infer<typeof companySchema>) {
    const session =  await requireUser()

    const req = await request()

    const decision = await aj.protect(req)

    if(decision.isDenied()) {
        throw new Error("Forbidden")
    }

    const validateData = companySchema.parse(data)

    await prisma.user.update({
        where: {
            id: session.id
        },
        data: {
            onboardingCompleted: true,
            userType: "COMPANY",
            company: {
                create: {
                    ...validateData,
                }
            }
        }
    })
    return redirect("/")
    
}

export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
    const user =  await requireUser()

    const req = await request()

    const decision = await aj.protect(req)

    if(decision.isDenied()) {
        throw new Error("Forbidden")
    }


    const validateData = jobSeekerSchema.parse(data)
    
    await prisma.user.update({
        where: {
            id: user.id as string
        },
        data: {
            onboardingCompleted: true,
            userType: "JOB_SEEKER",
            jobSeeker: {
                create: {
                    ...validateData,
                }
            }   
        }
    })
    return redirect("/")
}


export async function createJob(data: z.infer<typeof jobSchema>) {
    try {
        const user = await requireUser()

        const req = await request()
        const decision = await aj.protect(req)

        if(decision.isDenied()) {
            throw new Error("Forbidden")
        }

        const validateData = jobSchema.parse(data)

        const company = await prisma.company.findUnique({
            where:{
                userId: user.id
            },
            select: {
                id: true,
                user: {
                    select: {
                        stripeCustomerId: true
                    }
                }
            }
        })

        if (!company?.id) {
            return redirect("/")
        }

        let stripeCustomerId = company.user.stripeCustomerId

        if(!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email as string,
                name: user.name as string
            })

            stripeCustomerId = customer.id

            //update user with stripeCustomerId
            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    stripeCustomerId: customer.id
                }
            })
        }

       const jobpost = await prisma.jobPost.create({
            data: {
                jobDescription: validateData.jobDescription,
                jobTitle: validateData.jobTitle,
                employmentType: validateData.employmentType,
                location: validateData.location,
                salaryFrom: validateData.salaryFrom,
                salaryTo: validateData.salaryTo,
                listingDuration: validateData.listingDuration,
                benefits: validateData.benefits,
                companyId: company.id,
                status: "ACTIVE"
            },

            select: {
                id: true
            }
        })

        const pricingTier = jobListingDurationPricing.find(
            (tier) => tier.days === validateData.listingDuration
        )

        if(!pricingTier) {
            throw new Error("Invalid listing duration selected")
        }

        await inngest.send({
            name: "job/created",
            data: {
                jobId: jobpost.id,
                expirationDays: validateData.listingDuration
            }
        })

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            line_items: [
                {
                    price_data: {
                        product_data: {
                            name: `Job Posting - ${pricingTier.days} Days`,
                            description: pricingTier.description,
                            images: [
                                "https://r87auogaak.ufs.sh/f/e3EtAtSZyN2CkNwNBXEo2crCt0T5WFqX1nL4jdRJy8wu9Ehz"
                            ]
                        },
                        currency: "usd",
                        unit_amount: pricingTier.price * 100,
                    },
                    quantity: 1
                }
            ],

            metadata: {
                jobId: jobpost.id
            },

            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
        })

        if (session.url) {
            return redirect(session.url)
        }
        
        // Fallback if no session URL
        return redirect("/")

    } catch (error) {
        console.error("Server error in createJob:", error);
        throw error;
    }
}


export async function saveJobPost(jobId: string) {
    const user = await requireUser()

    const req = await request()

    const decision = await aj.protect(req)

    if(decision.isDenied()) {
        throw new Error("Forbidden")
    }

    // Check if already saved first
    const existingSave = await prisma.savedJobPost.findFirst({
        where: {
            jobPostId: jobId,
            userId: user.id as string
        }
    })
    
    // Only create if not already saved
    if (!existingSave) {
        await prisma.savedJobPost.create({
            data: {
                jobPostId: jobId,
                userId: user.id as string
            }
        })
        revalidatePath(`/job/${jobId}`);
    }
}

export async function unSaveJobPost(savedJobPostId: string) {
    const user = await requireUser()

    const req = await request()

    const decision = await aj.protect(req)

    if(decision.isDenied()) {
        throw new Error("Forbidden")
    }

    const data =await prisma.savedJobPost.delete({
        where: {
            id: savedJobPostId,
            userId: user.id 
        },
        select: {
            jobPostId: true
        }
    })
    revalidatePath(`/job/${data.jobPostId}`);
    
}