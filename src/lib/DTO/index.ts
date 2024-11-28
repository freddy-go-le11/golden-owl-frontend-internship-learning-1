export class ResponseError extends Error {
  readonly code: number;

  constructor(res: Response) {
    super(res.statusText);
    this.name = "HTTPError";
    this.message = res.statusText;
    this.code = res.status;
  }
}
