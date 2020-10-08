export class ServiceError extends Error {
  private errorMessage: string;
  constructor(message: string) {
    super(message);
    this.errorMessage = message;
  }
}
