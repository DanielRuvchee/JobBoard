import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { jobSeekerSchema } from "@/app/utils/zodSchemas"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import { UploadDropzone } from "@/components/general/UploadThingsReexported"
import Image from "next/image"
import { useState } from "react"    
import { createJobSeeker } from "@/app/actions"
import PDFImage from "@/public/pdf.png"

export function JobSeekerForm() {
    const form = useForm<z.infer<typeof jobSeekerSchema>>({
        resolver: zodResolver(jobSeekerSchema),
        defaultValues: {
            name: "",
            about: "",
            resume: ""
        }
    })

    const [pending, setPending] = useState(false)

    async function onSubmit(data: z.infer<typeof jobSeekerSchema>) {
        try {
            setPending(true)
            // This will either redirect or throw an error
            await createJobSeeker(data)
        } catch (error) {
            if(error instanceof Error && error.message !== "NEXT_REDIRECT") {
                console.log("Something went wrong")
            }
        } finally {
            setPending(false)
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your Full Name" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="about"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Short Bio</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Tell us about yourself" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                    control={form.control}
                    name="resume"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Resume (PDF)</FormLabel>
                            <FormControl>
                                <div>
                                    {field.value ? (
                                        <div className="relative w-fit">
                                            <Image src={PDFImage} alt="Company Logo" width={100} height={100} className="rounded-lg" />
                                            <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2"
                                            onClick={() => field.onChange("")}>
                                                <XIcon className="size-4"/>
                                            </Button>
                                            
                                        </div>
                                    ): (
                                        <UploadDropzone endpoint="resumeUploader"
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

                <Button type="submit" className="w-full" disabled={pending}>
                    {pending ? "Submitting..." : "Continue"}
                </Button>
            </form>
        </Form>
    )
}
