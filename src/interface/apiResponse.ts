export interface IApiResponse<T> {
    message: string;
    data: T;   
    message_code: string;
    }