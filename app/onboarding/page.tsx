import { OnboardingForm } from "@/components/forms/onboarding/OnboardingForm";
import { requireUser } from "@/app/utils/requireUser";
import { prisma } from "@/app/utils/db";
import { redirect } from "next/navigation";

async function checkIfUserHasFinishedOnboarding(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            onboardingCompleted: true
        }
    })

    if(user?.onboardingCompleted === true) {
        redirect("/")
    }

    return user
}

export default async function OnboardingPage() {
    const session = await requireUser()
    await checkIfUserHasFinishedOnboarding(session.id as string)
    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-10">
            <OnboardingForm />
        </div>
    )
}