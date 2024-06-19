import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ searchParams }: any) {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <div className="max-w-md relative flex flex-col p-10 rounded-xl text-black bg-white  shadow-xl border border-[#7747ff]-100">
        <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">
          欢迎登录 <span className="text-[#7747ff]">Nex-Auth上手指南</span>
        </div>
        <div className="text-sm font-normal mb-4 text-center text-[#1e0e4b]">
          使用您的账号密码登录
        </div>
        <LoginForm />
        <div className="text-sm text-center mt-[1.6rem]">
          没有账户?{" "}
          <Link className="text-sm text-[#7747ff]" href="/register">
            免费注册!
          </Link>
        </div>
      </div>
    </div>
  );
}
