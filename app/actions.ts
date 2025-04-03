"use server"

import { requireUser } from "./utils/requireUser"
import { z } from "zod"
import { companySchema, jobSchema, jobSeekerSchema } from "./utils/zodSchemas"
import { prisma } from "./utils/db"
import { redirect } from "next/navigation"
import arcjet from "./utils/arcjet"
import { request } from "@arcjet/next"
import { shield, detectBot } from "@arcjet/next"

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
        console.log("User found:", user.id);

        const req = await request()
        const decision = await aj.protect(req)

        if(decision.isDenied()) {
            throw new Error("Forbidden")
        }

        console.log("Validating data with Zod schema");
        const validateData = jobSchema.parse(data)
        console.log("Data validated successfully");

        console.log("Finding company for user");
        const company = await prisma.company.findUnique({
            where:{
                userId: user.id
            },
            select: {
                id: true,
            }
        })
        console.log("Company found:", company);

        if (!company?.id) {
            console.log("No company found for user, redirecting");
            redirect("/")
        }

        console.log("Creating job post");
        await prisma.jobPost.create({
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
            }
        })
        console.log("Job post created successfully");

        redirect("/")
    } catch (error) {
        console.error("Server error in createJob:", error);
        throw error;
    }
}
