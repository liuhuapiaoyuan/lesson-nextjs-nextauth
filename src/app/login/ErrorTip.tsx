import { useFormState } from "react-dom";

type FormState = {
  message: string;
};

export async function onFormPostAction(
  prevState: FormState,
  formData: FormData
) {
  // 处理表单数据并返回结果
  return { message: "表单数据已处理" };
}

export function ErrorTip() {
  const formState = useFormState();
  return <></>;
}
