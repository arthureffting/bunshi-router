import {createScope, molecule} from "bunshi";
import {atom, useAtomValue} from "jotai";
import {Pattern} from "./Pattern";
import {ScopeProvider, useMolecule} from "bunshi/react";
import React from "react";
import {atomWithLocation} from "jotai-location";

const RouterScope = createScope("/");

export const RouteProvider = (props: {
    value: string
} & React.PropsWithChildren) => {
    return <ScopeProvider scope={RouterScope}
                          value={props.value}>
        {props.children}
    </ScopeProvider>
}

export interface Location {
    pathname?: string;
    searchParams?: URLSearchParams;
}

export type LocationUpdate = Location | ((prev: Location) => Location)

const LocationProxy = atomWithLocation()

const HistoryAtom = atom<Location[]>([] as Location[])

export const LocationAtom = atom((get) => {
    return get(LocationProxy)
}, (get, set, value: LocationUpdate) => {
    set(HistoryAtom, [...get(HistoryAtom), get(LocationProxy)])
    set(LocationProxy, value)
})

export const RouteMolecule = molecule((_, scope) => {

    const scopeValue = scope(RouterScope);
    const parameters = atom((get) => new Pattern(scopeValue).match(get(LocationAtom)).parameters)

    return {
        pattern: new Pattern(scopeValue),
        location: LocationAtom,
        parameters
    }

});

export const usePattern = () => useMolecule(RouteMolecule).pattern

export const usePathParameters = () => useAtomValue(useMolecule(RouteMolecule).parameters)