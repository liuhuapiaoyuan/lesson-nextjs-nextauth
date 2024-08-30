import { BizExceptionBuilder } from "@/lib/exception";
import prisma from "@/lib/prisma";
import { createHash } from "crypto";
import { AuthError } from "next-auth";
function md5(str: string) {
  return createHash("md5").update(str).digest("hex");
}

class UserService {

  async login(username: string, password: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new AuthError("账号或密码错误") 
    }
    const encryptedPassword = await md5(password);
    if (user.password !== encryptedPassword) {
      throw new AuthError("账号或密码错误") 
    }
    return {
      ...user,
      password:undefined
    }
  }
  async register(username: string, password: string) {
    const userNameExist = await prisma.user.count({ where: { username } });
    if (userNameExist > 0) {
      throw BizExceptionBuilder.dataValidationFailed(
        "账号已经存在，不可重复注册"
      );
    }
    const encryptedPassword = await md5(password);
    return prisma.user.create({
      data: {
        username,
        password: encryptedPassword,
      },
    });
  }
}

export const userService = new UserService();
