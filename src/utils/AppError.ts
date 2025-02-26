export class AppError {
  errorMessage
  statusCode

  constructor(errorMessage: string, statusCode: number = 400) {
    this.errorMessage = errorMessage
    this.statusCode = statusCode
  }
}