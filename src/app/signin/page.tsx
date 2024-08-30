import { providerList, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

const SIGNIN_ERROR_URL = "/error";

export default async function SignInPage() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col gap-2 p-5 w-[400px]  rounded-md  border shadow-md">
        <form
          className="flex flex-col gap-2 p-2 "
          action={async (formData) => {
            "use server";
            try {
              await signIn("credentials", formData);
              await redirect("/");
            } catch (error) {
              if (error instanceof AuthError) {
                return redirect(
                  `${SIGNIN_ERROR_URL}?error=${
                    error.type
                  }&message=${encodeURIComponent(error.message)}`
                );
              }
              throw error;
            }
          }}
        >
          <label
            htmlFor="username"
            className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
          >
            账户
            <input
              name="username"
              id="username"
              placeholder="邮箱/账号/手机"
              className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0"
            />
          </label>
          <label
            htmlFor="password"
            className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
          >
            密码
            <input
              name="password"
              id="password"
              className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0"
            />
          </label>
          <div>
            <button
              type="submit"
              className="bg-[#7747ff] w-max m-auto px-6 py-2 rounded text-white text-sm font-normal"
            >
              登录
            </button>
          </div>
        </form>
        {Object.values(providerList).map((provider) => (
          <form
            action={async () => {
              "use server";
              try {
                await signIn(provider.id);
              } catch (error) {
                // Signin can fail for a number of reasons, such as the user
                // not existing, or the user not having the correct role.
                // In some cases, you may want to redirect to a custom error
                if (error instanceof AuthError) {
                  return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
                }

                // Otherwise if a redirects happens Next.js can handle it
                // so you can just re-thrown the error and let Next.js handle it.
                // Docs:
                // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                throw error;
              }
            }}
          >
            <button type="submit">
              <span>{provider.name}登录</span>
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
