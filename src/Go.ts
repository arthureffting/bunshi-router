import {useAtomValue, useSetAtom} from "jotai";
import {Pattern} from "./Pattern";
import {LocationAtom, RouteMolecule, useHistory} from "./Scope";
import {useMolecule} from "bunshi/react";
import {Location} from "./Scope";

export const parseLocation = (relativePath: string) => {
    const url = new URL(relativePath, "http://dummy");
    return {
        pathname: url.pathname,
        searchParams: new URLSearchParams(url.search)
    }
}

export type LocationTransformer = (prev: Location, pattern: Pattern, history: Location[]) => Location

export const useLocation = () => useAtomValue(LocationAtom)

export const back: (by: number) => LocationTransformer = (by) => {
    return (prev, _, history) => {
        if(history.length > by){
            return history[history.length - by]
        }else {
            return prev
        }
    }
}

export const to: (path: string) => LocationTransformer = (path) => {
    return (prev: Location) => ({
        ...prev,
        searchParams: new URLSearchParams(),
        pathname: path
    })
}


export const withQueryParameters = (parameters: { [key: string]: string }, inner: LocationTransformer) => {
    return (prev: Location, pattern: Pattern, history: Location[]) => {
        const location = inner(prev, pattern, history)
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
    return (prev: Location, pattern: Pattern, history: Location[]) => {
        const location = inner(prev, pattern, history)
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
    const history = useHistory()
    const {pattern} = useMolecule(RouteMolecule)
    const setLocation = useSetAtom(LocationAtom)
    return (transform: LocationTransformer) => setLocation((prev: Location) => transform(prev, pattern, history))
}