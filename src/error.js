class InvalidOperation extends Error {
    constructor(message) {
        super(message)
        this.name = "InvalidOperation"
    }
}

export {InvalidOperation}