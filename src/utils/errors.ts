export class ApplicationError extends Error {
    public statusCode: number;
    public code: string;

    constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_SERVER_ERROR') {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends ApplicationError {
    constructor(message: string) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}
