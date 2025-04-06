"use client";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form";
import {jobSchema} from "@/app/utils/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card";
import {Input} from "../ui/input";

import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "../ui/select";
import {countryList} from "@/app/utils/countryList";
import {SalaryRangeSelector} from "../general/SalaryRangeSelector";
import {JobDescriptionEditor} from "../richTextEditor/JobDescriptionEditor";
import {BenefitsSelector} from "../general/BenefitsSelector";
import {Textarea} from "../ui/textarea";
import {Button} from "../ui/button";
import {XIcon} from "lucide-react";
import {UploadDropzone} from "../general/UploadThingsReexported";
import Image from "next/image";
import {JobListingDuration} from "../general/JobListingDurationSelector";
import {createJob} from "@/app/actions";
import {useState} from "react";

interface iAppProps {
  companyLocation: string;
  companyName: string;
  companyAbout: string;
  companyLogo: string;
  companyWebsite: string;
  companyXAccount: string | null;
}

export function CreateJobForm({companyLocation, companyName, companyAbout, companyLogo, companyWebsite, companyXAccount}: iAppProps) {
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      benefits: [],
      companyName: companyName,
      companyLocation: companyLocation,
      companyAbout: companyAbout,
      companyLogo: companyLogo,
      companyWebsite: companyWebsite,
      companyXAccount: companyXAccount || "",
      employmentType: "",
      jobDescription: "",
      jobTitle: "",
      listingDuration: 30,
      location: "",
      salaryFrom: 0,
      salaryTo: 0,
    },
  });

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof jobSchema>) {
    setPending(true);
    setError(null);
    try {
      console.log("Submitting values:", values);
      // The createJob function will handle the redirect
      const result = await createJob(values);
      
      // If we get here, it means the redirect didn't happen
      // We can manually redirect the user
      window.location.href = "/";
    } catch (error) {
      // In Next.js, redirect() throws a NEXT_REDIRECT error which is expected
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        console.log("Redirect happening...");
        // The redirect is being handled by Next.js, no need to do anything
        return;
      }
      
      // Handle other errors
      console.error("Error creating job:", error);
      setError(error instanceof Error ? error.message : "Failed to create job. Please try again.");
      console.error("Full error:", error);
      setPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="col-span-1 lg:col-span-2 flex flex-col gap-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({field}) => {
                  const formId = `form-field-${field.name}`;
                  return (
                  <FormItem>
                    <FormLabel htmlFor={formId}>Job Title</FormLabel>
                    <FormControl>
                      <Input id={formId} placeholder="Job Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="employmentType"
                render={({field}) => {
                  const formId = `form-field-${field.name}`;
                  return (
                  <FormItem className="w-full">
                    <FormLabel htmlFor={formId}>Employment Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id={formId} className="w-full">
                          <SelectValue placeholder="Select Employment Type" />
                        </SelectTrigger>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({field}) => {
                  const formId = `form-field-${field.name}`;
                  return (
                  <FormItem className="w-full">
                    <FormLabel htmlFor={formId}>Select Job Location</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id={formId} className="w-full">
                          <SelectValue placeholder="Job Location" />
                        </SelectTrigger>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  );
                }}
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
              render={({field}) => (
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
              render={({field}) => (
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

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyLocation"
                render={({field}) => (
                  <FormItem className="w-full">
                    <FormLabel>Select Company Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Company Location" />
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <FormField
                control={form.control}
                name="companyWebsite"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Company Website</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyXAccount"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Company X Account</FormLabel>
                    <FormControl>
                      <Input placeholder="@Company X Account" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="companyAbout"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Say something about your company" {...field} className="min-h-[120px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyLogo"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Company Logo</FormLabel>
                  <FormControl>
                    <div>
                      {field.value ? (
                        <div className="relative w-fit">
                          <Image 
                            src={field.value} 
                            alt="Company Logo" 
                            width={100} 
                            height={100} 
                            className="rounded-lg object-contain"
                            style={{ width: '100px', height: 'auto' }} 
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2"
                            onClick={() => field.onChange("")}>
                            <XIcon className="size-4" />
                          </Button>
                        </div>
                      ) : (
                        <UploadDropzone
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]?.url) {
                              field.onChange(res[0].url);
                            }
                          }}
                          onUploadError={(error: Error) => {
                            console.error("Upload error:", error);
                          }}
                          className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Listing Duration</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <FormField
              control={form.control}
              name="listingDuration"
              render={({field}) => (
                <FormItem className="w-full">
                  <FormControl className="w-full">
                    <JobListingDuration field={field as any} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Job...
            </>
          ) : (
            "Create Job"
          )}
        </Button>
      </form>
    </Form>
  );
}
