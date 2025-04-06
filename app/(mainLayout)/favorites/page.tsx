import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { EmptyState } from "@/components/general/EmptyState";
import { JobCard } from "@/components/general/JobCard";

async function getFavorites(userId: string) {
    const data = await prisma.savedJobPost.findMany({
        where: {
            userId: userId
        },
        select: {
            jobPost: {
                select: {
                    id: true,
                    jobTitle: true,
                    salaryFrom: true,
                    salaryTo: true,
                    location: true,
                    employmentType: true,
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
            }
        }
    })

    return data
}

export default async function FavoritesPage() {
    const session = await requireUser()

    const data = await getFavorites(session?.id as string)

    if(data.length === 0) {
        return (
            <EmptyState
                title="No favorites found"
                description="You haven't saved any job posts yet."
                buttonText="Browse jobs"
                href="/"
            />
        )
    }

    return (
        <div className="grid grid-cols-1 mt-5 gap-4">
            {data.map((favorite) => (
                <JobCard key={favorite.jobPost.id} job={favorite.jobPost} />
            ))}
        </div>
    )


}