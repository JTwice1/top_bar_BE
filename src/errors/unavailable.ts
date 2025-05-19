import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api';

class UnavailableError extends CustomAPIError {
  constructor(message?: string) {
    super(message || 'Service Unavailable, try again later');
    this.statusCode = StatusCodes.SERVICE_UNAVAILABLE;
  }
}

export default UnavailableError;
