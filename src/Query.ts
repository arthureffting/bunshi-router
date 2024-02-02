import {useGo, useLocation} from "./Go";

export const useQueryParameter: (key: string, orDefault?: string) => [string, (value: string) => void] = (key, orDefault) => {
    const read = useQueryParameterValue(key, orDefault)
    const set = useSetQueryParameter(key)
    return [read, set]
}

export const useQueryParameterValue: (key: string, orDefault?: string) => string = (key, orDefault) => {
    const location = useLocation()
    return location.searchParams?.has(key) ? location.searchParams.get(key)! : (orDefault ?? "")
}

export const useSetQueryParameter: (key: string) => (value: string) => void = (key: string) => {
    const go = useGo()
    return (value: string) => go((prev) => {
        const params = prev.searchParams
        if (!value || value.length === 0) {
            params?.delete(key)
        } else {
            params?.set(key, value)
        }
        return {
            ...prev,
            searchParams: params
        }
    })
}