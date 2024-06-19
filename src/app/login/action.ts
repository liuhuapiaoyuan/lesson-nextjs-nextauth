'use server'

import { signIn } from "@/auth";
import { cookies } from "next/headers";

type Status = "success" | "error" |"pending";
export type ActionState = {
  status: Status;
  errorMessage?: string;
};

export default async function loginAction(
  _prevState: ActionState,
  formData: FormData,
) {
  const requestCookies = cookies();
  const csrfToken = requestCookies.get("authjs.csrf-token");
  const tokenValue = csrfToken?.value?.split("|").at(0);

  if (tokenValue && formData.get("csrfToken") !== tokenValue) {
    throw new Error("CSRF token mismatch");
  }
 
  try {
    const data = Object.fromEntries(formData);
    await signIn("credentials", {
      ...data,
      redirect: false,
      redirectTo: formData.get("redirectUri") as string,
    });
    return {
      status: "success" as Status,
    };
  } catch (error) {
    return {
      status: "error" as Status,
      errorMessage: "登录失败:" + JSON.stringify(error?.message??error),
    };
  }
}
