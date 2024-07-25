

export class BadRequest extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InternalError extends Error {
  constructor(message: string) {
    super(message);
  }
}
