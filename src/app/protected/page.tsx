import { auth, signIn } from "@/auth";
import Image from "next/image";

export default async function ProtectedPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return signIn();
  }

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
        <div>此处演示，必须登录才可以使用的页面</div>
        <div>如果没有登录直接访问，则会被跳转到登录页面</div>
      </main>
    </div>
  );
}
