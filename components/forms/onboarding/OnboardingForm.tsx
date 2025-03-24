"use client"
import Image from "next/image";
import logo from "@/public/logo.png";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { UserTypeSelection } from "./UserTypeForm";

type UserSelectionType = "jobSeeker" | "company" | null

export function OnboardingForm() {
    const [step, setStep] = useState(1)
    const [userType, setUserType] = useState<UserSelectionType>(null)

    function handleUserTypeChange(type: UserSelectionType) {
        setUserType(type)
        setStep(2)
    }

    function renderStep() {
        switch (step) {
            case 1:
                return <UserTypeSelection />
            case 2:
                return userType === "company" ? <p>Company form</p> : <p>Job seeker form</p>
            
            default:
                return null
        }
    }
    return (
        <>
        <div className="flex items-center gap-4 mb-10">
            <Image src={logo} alt="logo" width={50} height={50} />
            <h1 className="text-4xl font-bold">Job<span className="text-primary">Daniel</span></h1>
        </div>

        <Card className="max-w-lg w-full">
            <CardContent className="p-6">
                {renderStep()}
            </CardContent>
        </Card>
        </>
    )
}