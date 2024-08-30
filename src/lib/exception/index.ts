import { BizException } from "./BizException"



export const BizExceptionBuilder = {
    dataValidationFailed: (message: string) => {
        return new BizException(400, message)
    }
}