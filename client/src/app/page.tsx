"use client";


import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="text-4xl italic flex flex-col items-center justify-center h-screen">
      AIxSocialx
      <button onClick={() => router.push("/auth/signup")} className="px-4 py-2 text-xl mt-4 border border-gray-200 text-black rounded-xl">Get Started</button>
    </div>
  );
}
