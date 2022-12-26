class ApiError extends Error {
    constructor(message, name='ApiError') {
        super(message)
        this.name = name
    }
}

class InvalidOperation extends ApiError {
    constructor(message) {
        super(message, 'InvalidOperation')
    }
}

class BadRequest extends ApiError {
    constructor(message) {
        super(message, 'BadRequest')
    }
}

export {ApiError, InvalidOperation, BadRequest}