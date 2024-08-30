"use client";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const params = useSearchParams();
  return (
    <div className="flex items-center flex-col justify-center h-screen w-full">
      <div>访问错误</div>
      <div>{params.get("error")}</div>
      <div>{params.get("message")}</div>
    </div>
  );
}
