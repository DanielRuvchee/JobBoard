import Link from "next/link";
import Logo from "@/public/logo.png";
import Image from "next/image";

export default function Login() {
    return (
        <div className="min-h-screen w-screen flex items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center">
                    <Image src={Logo}  alt="logo" className="size-10"></Image>
                    <h1 className="text-2xl font-bold">Job<span className="text-primary">Daniel</span></h1>
                </Link>
            </div>
        </div>
    )
}