export default class ErrorHandler extends Error {

	message: string;
	data: any;
	message_code: string;
	status: number = 500;
	


	constructor(errorObj: {
	
		message: string;
		data?: any;
		message_code: string;
		status?: number;
	
	}) {
		super(errorObj.message);
		this.message = errorObj.message;
		this.data = errorObj.data;
		this.message_code = errorObj.message_code;
		this.status = errorObj.status || 500;
		// Capture the error's stack trace, excluding this constructor.
		// Simplifies error messages to show only relevant code for easier debugging.
		Error.captureStackTrace(this, this.constructor);
	}

	toString() {
		return {
			message: this.message,
			data: this.data,
			message_code: this.message_code,
			status: this.status,
		};
	}
}