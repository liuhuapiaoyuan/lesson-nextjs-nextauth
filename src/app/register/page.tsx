import { signIn } from "@/auth";

export default function RegisterPage() {
  return (
    <div>
      Register Page
      {/* 注册 */}
      <form
        action={async (data) => {
          "use server";
          return signIn("credentials", data);
        }}
      >
        <label>
          Email
          <input type="text" name="username" />
        </label>
        <label>
          Password
          <input type="password" name="password" />
        </label>
        <label>
          确认密码
          <input type="password" name="confirm-password" />
        </label>
        <div>
          <button type="submit">登录</button>
        </div>
      </form>
    </div>
  );
}
