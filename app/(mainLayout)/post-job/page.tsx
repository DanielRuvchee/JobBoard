import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import arcjetLogo from "@/public/arcjet.jpg";
import inngestLogo from "@/public/inngest-locale.png";
import Image from "next/image";

const companies = [
    {
        id: 0, name: "Arcjet", logo: arcjetLogo,

    },
    {
        id: 1, name: "Inngest", logo: inngestLogo,
    },
    {
        id: 2, name: "Arcjet", logo: arcjetLogo,

    },
    {
        id: 3, name: "Inngest", logo: inngestLogo,
    },
    {
        id: 4, name: "Arcjet", logo: arcjetLogo,

    },
    {
        id: 5, name: "Inngest", logo: inngestLogo,
    }
]

const testimonials = [
    {
        quote: "I love this product it is amazing and I use it every day so good",
        author: "John Doe",
        company: "Arcjet",
    },
    {
        quote: "Awesome product designed by the best in the business",
        author: "Jane Doe",
        company: "Inngest",
    },
    {
        quote: "I love this product it is amazing and I use it every day",
        author: "John Doe",
        company: "Arcjet",
    },  
]

const stats = [
    {id: 0, value: "10k+", label: "Jobs Posted"},
    {id: 1, value: "48h", label: "Average Time to Hire"},
    {id: 2, value: "95%", label: "Employer Satisfaction"},
    {id: 3, value: "500+", label: "Companies Using Us"},
   
    
]

export default function PostJobPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 mt-5 gap-4">
            <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Hey this is our form</CardTitle>
                </CardHeader>
            </Card>

            <div className="col-span-1 ">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Trusted by industry leaders</CardTitle>
                        <CardDescription>
                            Join 1000+ companies that trust our platform to find the right talent.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Company logos */}

                        <div className="grid grid-cols-3 gap-4">
                            {companies.map((company) => (
                                <div key={company.id}>
                                    <Image src={company.logo} alt={company.name} width={80} height={80} className="rounded-lg opacity-75 transition-opacity hover:opacity-100" />
                                </div>
                            ))}
                        </div>


                        <div className="space-y-4">
                            {testimonials.map((testimonial, index) => (
                                <blockquote key={index} className="border-l-2 border-primary pl-4">
                                    <p className="text-sm text-muted-foreground italic">{testimonial.quote}</p>

                                    <footer className="mt-2 text-sm font-medium">
                                        -{testimonial.author}, {testimonial.company}
                                    </footer>
                                </blockquote>
                            ))}
                        </div>

                        {/* Stats */}

                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat) => (
                                <div key={stat.id} className="rounded-lg bg-muted p-4">
                                    <h4 className="text-2xl font-bold">{stat.value}</h4>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}