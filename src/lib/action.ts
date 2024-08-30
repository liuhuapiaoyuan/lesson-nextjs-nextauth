import { BizException } from "./exception/BizException";


export type ResultType = {
  status: "success" | "error" | "pending";
  message: string;
  data?: Record<string, any>;
}

class Result {
  static success(message: string, data:Record<string, any> = {}) :ResultType{
    return {status:"success", message, data}
  }
  static error(message: string, data:Record<string, any>= {}) :ResultType{
    return {status:"error", message, data}
  }
  static pending(message?: string, data:Record<string, any>= {}) :ResultType{
    return {status:"pending",message: message || "Pending...", data}
  }
  static exception(bizException:BizException):ResultType {
    return {status:"error", message: bizException.message, data: bizException.data}
  }
}

export const DefaultResult = Result.pending();  

export { Result };

