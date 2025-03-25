import { z } from "zod";

export const companySchema = z.object({
    name: z.string().min(2, "Company name is required and must be atleast 2 charachters"),
    location: z.string().min(1, "Location must be defined"),
    about: z.string().min(10, "Please provide a short description about your company"),
    logo: z.string().min(1, "Please upload a logo for your company"),
    website: z.string().url("Please enter a valid website URL"),
    xAccount: z.string().optional(),
})