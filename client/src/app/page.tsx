"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowDown, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const xManagex = [
  {
    id: 1,
    name: "Instagram",
    text_colour: "text-pink-600",
  },
  {
    id: 2,
    name: "X",
    text_colour: "text-red-400",
  },
  {
    id: 3,
    name: "Linkedin",
    text_colour: "text-blue-600",
  },
  {
    id: 4,
    name: "Github",
    text_colour: "text-gray-800",
  },
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % xManagex.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-screen">
        <span className="text-base border rounded-xl px-4 border italic font-bold text-white">
          AIx<span className="text-red-600">Social_x</span>
        </span>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-snug">
            Manage your{" "}
            <span
              key={xManagex[index].id}
              className={`${xManagex[index].text_colour} transition-all duration-500`}
            >
              {xManagex[index].name}
            </span>{" "}
            in One Place
          </h1>
          <p className="text-sm md:text-base font-medium text-gray-400">
            Manage All Your Social Media — Powered by AI, Simplified for You.
          </p>
          <div className="flex flex-row justify-center mt-4 px-4 gap-4">
            <Button className="rounded text-base text-[#808080] border border-[#808080] py-2 px-6 sm:px-8 w-48 flex items-center justify-center">
              Get Started
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>

            <Button className="rounded text-base text-white bg-[#EA763F] hover:bg-[#EA763F]/90 border border-[#808080] py-2 px-4 sm:px-5 w-32 flex items-center justify-center">
              Explore Plus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
