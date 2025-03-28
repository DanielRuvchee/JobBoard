"use client"
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { jobSchema } from "@/app/utils/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";




export function CreateJobForm() {
    const form = useForm<z.infer<typeof jobSchema>>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            benefits: [],
            companyName: "",
            companyLocation: "",
            companyAbout: "",
            companyLogo: "",
            companyWebsite: "",
            companyXAccount: "",
            employmentType: "",
            jobDescription: "",
            jobTitle: "",
            listingDuration: "30",
            location: "",
            salaryFrom: 0,
            salaryTo: 0,
        }
    })

    return (
        <Form {...form}>
            <form className="col-span-1 lg:col-span-2 flex flex-col gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Job Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}