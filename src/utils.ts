
export function objToRevMap(obj: Object): Map<string, string> {
    return Object.keys(obj)
        .reduce((crr, k) => crr.set(obj[k], k), new Map<string, string>())
}

export function objToValArray(obj: Object): Array<string> {
    return Object.values(obj)
        .reduce<Array<string>>((crr, v) => crr.concat(v), [])
}

export function objToValInitials(obj: Object): Array<String> {
    return Object.values(obj)
        .reduce<Array<string>>((crr, v) => crr.concat(v.charAt(0)), [])
}

