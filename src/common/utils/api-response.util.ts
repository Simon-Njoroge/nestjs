// src/common/utils/api-response.util.ts
export class ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;

  constructor(init: Partial<ApiResponse<T>>) {
    this.success = init.success || true;
    this.data = init.data;
    this.message = init.message;
    this.timestamp = new Date().toISOString();
  }
}
