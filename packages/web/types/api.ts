export interface NestAPIError {
  message: string | string[];
  error: string;
  statusCode: number;
}
