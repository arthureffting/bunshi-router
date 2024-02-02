import {useAtomValue, useSetAtom} from "jotai";
import {Pattern} from "./Pattern";
import {RouteMolecule} from "./Scope";
import {useMolecule} from "bunshi/react";
import {Location} from "./Scope";

export const parseLocation = (relativePath: string) => {
    const url = new URL(relativePath, "http://dummy");
    return {
        pathname: url.pathname,
        searchParams: new URLSearchParams(url.search)
    }
}

export type LocationTransformer = (prev: Location, pattern: Pattern) => Location


export const useLocation = () => useAtomValue(useMolecule(RouteMolecule).location)

export const back: (by: number) => LocationTransformer = (by) => {
    let parts = (location.pathname ?? "").split("/")
        .filter(x => x && x.length > 0)
    return (prev: Location) => ({
        ...prev,
        searchParams: new URLSearchParams(),
        pathname: parts.length === 1 ? "/" : parts.slice(0, parts.length - by).join("/"),
    })
}

export const to: (path: string) => LocationTransformer = (path) => {
    return (prev: Location) => ({
        ...prev,
        searchParams: new URLSearchParams(),
        pathname: path
    })
}


export const withQueryParameters = (parameters: { [key: string]: string }, inner: LocationTransformer) => {
    return (prev: Location, pattern : Pattern) => {
        const location = inner(prev, pattern)
        const params = location.searchParams ?? new URLSearchParams()
        Object.keys(parameters).forEach(key => {
            params.set(key, parameters[key])
        })
        return {
            ...location,
            searchParams: params
        }
    }
}
export const withPathParameters = (parameters: { [key: string]: string }, inner: LocationTransformer) => {
    return (prev: Location, pattern: Pattern) => {
        const location = inner(prev, pattern)
        const locationPattern = new Pattern(location.pathname)
        const filled = new Pattern(locationPattern
            .parts
            .filter(part => !part.isMultiWildcard())
            .map(part => part.value)
            .join("/"))
            .fill(parameters)
        return {
            ...location,
            pathname: filled.value
        }
    }
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
    return withPathParameters(parameters, (prev) => prev)
}

export const useGo = () => {
    const {pattern, location} = useMolecule(RouteMolecule)
    const setLocation = useSetAtom(location)
    return (transform: LocationTransformer) => setLocation((prev: Location) => transform(prev, pattern))
}