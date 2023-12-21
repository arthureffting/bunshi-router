import {useAtomValue, useSetAtom} from "jotai";
import {Pattern} from "./Pattern";
import {RouteMolecule} from "./Scope";
import {useMolecule} from "bunshi/react";

export type Location = {
    pathname?: string;
    searchParams?: URLSearchParams;
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


export const withParameters = (parameters: { [key: string]: string }, inner: LocationTransformer) => {
    return (prev: Location, pattern: Pattern) => {
        const location = inner(prev, pattern)
        const locationPattern = new Pattern(location.pathname)
        const filled = locationPattern.fill(parameters)
        const params = location.searchParams ?? new URLSearchParams()
        Object.keys(parameters)
            .filter(name => !locationPattern.hasVariable(name))
            .forEach(queryParameter => {
                params.append(queryParameter, parameters[queryParameter])
            })
        return {
            ...prev,
            pathname: filled.value,
            searchParams: params
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
    return (prev: Location, base: Pattern) => {
        return {
            ...prev,
            pathname: base.fill(parameters).value
        }
    }
}

export const useGo = () => {
    const {pattern, location} = useMolecule(RouteMolecule)
    const setLocation = useSetAtom(location)
    return (transform: LocationTransformer) => setLocation((prev: Location) => transform(prev, pattern))
}