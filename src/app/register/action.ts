"use server";

import { Result, ResultType } from "@/lib/action";
import { BizException } from "@/lib/exception/BizException";
import { userService } from "@/service/user.service";

export default async function registAction(
  _prevState: ResultType,
  formData: FormData
) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const repeatPassword = formData.get("repeat-password") as string;
  if (password !== repeatPassword) {
    return Result.error("Passwords do not match");
  }

  try {
    await userService.register(username, password);
  } catch (error) {
    if (error instanceof BizException) {
      return Result.error(error.message);
    }
  }

  return Result.success("Registration successful");
}
