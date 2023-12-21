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

const LocationAtom = atomWithLocation()

export const RouteMolecule = molecule((_, scope) => {
    const scopeValue = scope(RouterScope);
    const parameters = atom((get) => {
        return new Pattern(scopeValue).match(get(LocationAtom).pathname).parameters
    })

    const location = atom((get) => get(LocationAtom),
        (_, set, value) => set(LocationAtom, value)
    )

    return {
        pattern: new Pattern(scopeValue),
        parameters,
        location
    }
});

export const usePattern = () => useMolecule(RouteMolecule).pattern

export const useParameters = () => useAtomValue(useMolecule(RouteMolecule).parameters)