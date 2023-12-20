import {atomWithLocation} from 'jotai-location'
import {useAtomValue, useSetAtom} from "jotai";
import {Pattern} from "./Pattern";
import {usePattern} from "./Scope";

export type Location = {
    pathname?: string;
    searchParams?: URLSearchParams;
}

export type LocationTransformer = (prev: Location, pattern: Pattern) => Location

export const locationAtom = atomWithLocation()

export const useLocation = () => useAtomValue(locationAtom)

export const back: (by: number) => LocationTransformer = (by) => {
    let parts = (location.pathname ?? "").split("/")
        .filter(x => x && x.length > 0)
    return (prev: Location) => ({
        ...prev,
        searchParams: new URLSearchParams(),
        pathname: parts.length === 1 ? "/" : parts.slice(0, parts.length - by).join("/"),
    })
}
export const into: (...newParts: string[]) => LocationTransformer = (...newParts) => {
    let parts = (location.pathname ?? "").split("/").filter(x => x && x.length > 0)
    parts = parts.concat(newParts)
    return (prev: Location) => ({
        ...prev,
        searchParams: new URLSearchParams(),
        pathname: parts.join("/"),
    })
}

export const set: (parameters: {
    [key: string]: string
}) => LocationTransformer = (parameters) => {
    return (prev: Location, base: Pattern) => {
        return {
            searchParams: new URLSearchParams(),
            pathname: base.fill(prev.pathname!, parameters)
        }
    }
}

export const useGo = () => {
    const pattern = usePattern()
    const setLocation = useSetAtom(locationAtom)
    return (transform: LocationTransformer) => setLocation((prev) => transform(prev, pattern))
}