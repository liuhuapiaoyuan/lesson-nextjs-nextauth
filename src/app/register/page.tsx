import Link from "next/link";
import { RegisterForm } from "./Form";

export default function RegisterPage() {
  return (
    <>
      <div className="h-screen flex items-center justify-center flex-col">
        <div className="max-w-md relative flex flex-col p-10 rounded-xl text-black bg-white  shadow-xl border border-[#7747ff]-100">
          <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">
            欢迎注册 <span className="text-[#7747ff]">Nex-Auth上手指南</span>
          </div>

          <RegisterForm />
          <div className="text-sm text-center mt-[1.6rem]">
            <Link className="text-sm text-[#7747ff]" href="/login">
              立即登录!
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
