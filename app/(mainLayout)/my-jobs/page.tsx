import { prisma } from "@/app/utils/db"
import { requireUser } from "@/app/utils/requireUser"
import { EmptyState } from "@/components/general/EmptyState"
import { JobCard } from "@/components/general/JobCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CopyCheckIcon, MoreHorizontal, PenBoxIcon, TrashIcon } from "lucide-react"

import Image from "next/image"
import Link from "next/link"
async function getJobs(userId: string) {
    const data = await prisma.jobPost.findMany({
        where: {
            company: {
                userId: userId
            }
        },
        select: {
            id: true,
            jobTitle: true,
            status: true,
            createdAt: true,
            company: {
                select: {
                    name: true,
                    logo: true,
                }
            }
            
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return data
}

export default async  function MyJobsPage() {
    const session = await requireUser()

    const data = await getJobs(session?.id as string)
    
    return (
        <>
        {data.length === 0 ? (
            <EmptyState
                title="No jobs found"
                description="You haven't posted any jobs yet."
                buttonText="Post a job"
                href="/post-job"
            />
        ) : (
            <Card>
                <CardHeader>
                    <CardTitle>
                        My Jobs
                    </CardTitle>
                    <CardDescription>
                        Manage your job listings and applications here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Logo</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Job Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((listing) => (
                                <TableRow key={listing.id}>
                                    <TableCell>
                                        <Image src={listing.company.logo} alt={listing.company.name} width={40} height={40} className="rounded-full size-10" />
                                    </TableCell>
                                    <TableCell>
                                        {listing.company.name}
                                    </TableCell>
                                    <TableCell>
                                        {listing.jobTitle}
                                    </TableCell>
                                    <TableCell>
                                        {listing.status}
                                    </TableCell>
                                    <TableCell>
                                        {listing.createdAt.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric"
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/my-jobs/${listing.id}/edit`}>
                                                        <PenBoxIcon />
                                                        Edit 
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem asChild>
                                                    <Link href={`/my-jobs/${listing.id}/edit`}>
                                                        <CopyCheckIcon />
                                                        Copy Job Url
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/my-jobs/${listing.id}/delete`}>
                                                        <TrashIcon />
                                                        Delete
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )}
        </>
    )
}