export function getStatus(status: any) : object {
    return {
        'status' : status
    }
}

export function getErrors(errors: [any]) : object {
    return {
        'errors' : errors
    }
}

export function getError(error: any) : object {
    return {
        'error' : error
    }
}