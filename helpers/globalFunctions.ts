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

export function isValidDate(dateString: any) : boolean {
    let dateParsed = Date.parse(dateString);

    return isNaN(dateString) && !isNaN(dateParsed);
}