"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight, CircleCheck, Dot } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full gap-12 py-14 items-center justify-center">
      <div className="flex flex-row gap-3 items-center bg-white px-4 rounded-full shadow-md w-full max-w-3xl">
        <Dot size={30} className="text-green-500" />
        <h1 className="text-gray-500 font-semibold text-sm">ID3 & C4.5 Algorithm Engine</h1>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-5xl">
        <h1 className="text-6xl font-bold text-center">Make smarter decisions</h1>
        <h1 className="text-6xl font-bold text-primary">from your data</h1>
      </div>

      <p className="text-center text-gray-500 max-w-3xl">Upload a dataset, let TreeDecide automatically analyze it with ID3 or C4.5 algorithms, and get a clear decision tree with IF-THEN rules — in seconds.</p>

      <Button variant="default" size={"lg"} className="px-8 py-6 font-bold text-lg cursor-pointer shadow-md rounded-xl" onClick={() => router.push("/workspace")}>
        Get Started
        <ArrowRight size={20} className="ml-2" />
      </Button>

      <div className="flex flex-row items-center justify-between w-full max-w-2xl">
        <div className="flex flex-row items-center gap-3">
          <CircleCheck size={20} className="text-gray-500" />
          <p className="text-gray-500 text-sm">No login required</p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <CircleCheck size={20} className="text-gray-500" />
          <p className="text-gray-500 text-sm">No login required</p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <CircleCheck size={20} className="text-gray-500" />
          <p className="text-gray-500 text-sm">No login required</p>
        </div>
      </div>
    </div>
  )
}
