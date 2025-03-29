"use client"
import { useForm } from "react-hook-form";
import { Form, FormControl , FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { jobSchema } from "@/app/utils/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { countryList } from "@/app/utils/countryList";
import { SalaryRangeSelector } from "../general/SalaryRangeSelector";
import { JobDescriptionEditor } from "../richTextEditor/JobDescriptionEditor";
import { BenefitsSelector } from "../general/BenefitsSelector";




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
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                             control={form.control} 
                             name="jobTitle"
                             render={({field}) => (
                                <FormItem>
                                    <FormLabel>Job Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Job Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>  
                             )}
                            />

                            <FormField
                             control={form.control} 
                             name="employmentType"
                             render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Employment Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Employment Type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Employment Type</SelectLabel>
                                                <SelectItem value="full-time">Full-Time</SelectItem>
                                                <SelectItem value="part-time">Part-Time</SelectItem>
                                                <SelectItem value="internship">Internship</SelectItem>
                                                <SelectItem value="contractor">Contractor</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>  
                             )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                             control={form.control} 
                             name="location"
                             render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Select Job Location</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Job Location" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Worldwide</SelectLabel>
                                                <SelectItem value="worldwide">
                                                    <span>🌍</span>
                                                    <span className="pl-2">Worldwide / Remote</span>
                                                </SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel>Location</SelectLabel>
                                                {countryList.map((country) => (
                                                    <SelectItem key={country.code} value={country.code}>
                                                        <span>{country.flagEmoji}</span>
                                                        <span className="pl-2">{country.name}</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>  
                             )}
                            />

                            <FormItem>
                                <FormLabel>Salary Range</FormLabel>
                                <FormControl>
                                    <SalaryRangeSelector control={form.control} minSalary={10000} maxSalary={1000000} step={2000} currency="USD" />
                                </FormControl>
                            </FormItem>
                        </div>
                        <FormField 
                            control={form.control}
                            name="jobDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Description</FormLabel>
                                    <FormControl>
                                        <JobDescriptionEditor field={field as any} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="benefits"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Benefits</FormLabel>
                                    <FormControl>
                                        <BenefitsSelector field={field as any} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}