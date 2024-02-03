export function requiredIsNull(value : string | undefined | null) : boolean {
    if (value === null || value === undefined || value === '') {
        return true;
    } else {
        return false;
    }
}

export function valueExceedsLength(value: string, length: number) : boolean {
    if (value.length > length) {
        return true;
    } else {
        return false;
    }
}