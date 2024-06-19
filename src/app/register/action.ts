'use server'


type Status = "success" | "error" |"pending";
export type ActionState = {
  status: Status;
  errorMessage?: string;
};

export default async function registAction(
  _prevState: ActionState,
  formData: FormData,
) {
  
}
