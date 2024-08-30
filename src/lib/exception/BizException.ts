export class BizException extends Error {
  private code: number;
  data:Record<string,string> 
  constructor( code: number , message: string , data:Record<string,string> ={}) {
    super(message);
    this.code = code;
    this.name = "BizException";
    this.data = data
  }

  getCode(): number {
    return this.code;
  }
}
