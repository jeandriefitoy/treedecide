"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Network } from "lucide-react";

export default function Header() {
    return (
        <header className="w-full border-b bg-white/60 backdrop-blur-sm dark:bg-black/60 shadow-md">
            <div className="mx-auto flex items-center justify-between gap-4 px-12 py-4">
                <div className="flex flex-row gap-3 items-center">
                    <div className="w-10 h-10 bg-green-500 flex items-center jusitfy-center rounded-lg text-white font-bold text-lg">
                        <Network size={20} className="mx-auto" />
                    </div>
                    <Link href="/" className="font-heading text-lg font-semibold">
                        TreeDecide
                    </Link>
                </div>
                <nav className="flex items-center gap-3">
                    <Link href="/workspace">
                        <Button variant="default" size={"lg"} className="px-6 cursor-pointer shadow-md">
                            Get Started
                        </Button>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
