"use server"

import { signIn } from "@/app/utils/auth"

export async function signInWithGithub() {
    await signIn("github", { redirectTo: "/" })
} 