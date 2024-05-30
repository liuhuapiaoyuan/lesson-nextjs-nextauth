import { auth } from "@/auth";
import { SignInButton } from "@/components/SignInButton";
import { SignOutButton } from "@/components/SignOutButton";
import Image from "next/image";

export default async function Home() {
  const session = await auth();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div>当前账号信息 ：{session?.user?.email ?? "未登录"}</div>
        <div className="flex gap-4">
          <SignInButton />
          {session?.user && <SignOutButton />}
        </div>
      </main>
    </div>
  );
}
