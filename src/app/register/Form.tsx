"use client";
import { getCsrfToken } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import loginAction, { ActionState } from "./action";

const defaultState: ActionState = {
  status: "pending",
};

export function RegisterForm() {
  const [csrfToken, setCsrfToken] = useState("");
  const urlParams = useSearchParams();
  const redirectUri = urlParams.get("callbackUrl") || "/";

  const [state, formAction] = useActionState(loginAction, defaultState);

  useEffect(() => {
    getCsrfToken().then(setCsrfToken);
  }, []);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="redirectUri" value={redirectUri} />
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <div>登录状态:{state.status}</div>
      <div className="block relative">
        <label
          htmlFor="email"
          className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
        >
          账号
        </label>
        <input
          type="text"
          name="username"
          placeholder="输入账号/邮箱/电话"
          className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0"
        />
      </div>
      <div className="block relative">
        <label
          htmlFor="password"
          className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
        >
          密码
        </label>
        <input
          type="text"
          name="password"
          placeholder="输入您的登录密码"
          className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
        />
      </div>
      <div className="block relative">
        <label
          htmlFor="password"
          className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
        >
          确认密码
        </label>
        <input
          type="text"
          name="password"
          placeholder="确认您的登录密码"
          className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
        />
      </div>

      {state.status == "error" && (
        <div>
          <span className="text-sm text-red-500">{state.errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        className="bg-[#7747ff] w-max m-auto px-6 py-2 rounded text-white text-sm font-normal"
      >
        注册
      </button>
    </form>
  );
}
