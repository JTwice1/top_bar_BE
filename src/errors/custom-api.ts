import { StatusCodes } from 'http-status-codes';

class CustomAPIError extends Error {
  statusCode: number;
  constructor(message?: string) {
    super(
      message || 'Something went wrong, Internal Server Error (CustomAPIError))'
    );
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export default CustomAPIError;
