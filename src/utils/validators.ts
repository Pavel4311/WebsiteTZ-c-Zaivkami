export function validateRequestData(data: any): boolean {
    const { clientName, phone, address, problemText } = data;
    if (!clientName || typeof clientName !== 'string') {
        return false;
    }
    if (!phone || typeof phone !== 'string') {
        return false;
    }
    if (!address || typeof address !== 'string') {
        return false;
    }
    if (!problemText || typeof problemText !== 'string') {
        return false;
    }
    return true;
}

export function validateUserData(data: any): boolean {
    const { name, role, password } = data;
    if (!name || typeof name !== 'string') {
        return false;
    }
    if (!role || typeof role !== 'string') {
        return false;
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        return false;
    }
    return true;
}