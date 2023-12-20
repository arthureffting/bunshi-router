import {createScope, molecule} from "bunshi";
import {atom, useAtomValue} from "jotai";
import {Pattern} from "./Pattern";
import {locationAtom} from "./Go";
import {ScopeProvider, useMolecule} from "bunshi/react";
import React from "react";

const RouterScope = createScope("/");

export const RouteProvider = (props: {
    value: string
} & React.PropsWithChildren) => {
    return <ScopeProvider scope={RouterScope}
                          value={props.value}>
        {props.children}
    </ScopeProvider>
}

export const RouteMolecule = molecule((_, scope) => {
    const scopeValue = scope(RouterScope);
    const parameters = atom((get) => {
        return new Pattern(scopeValue).getParameters(get(locationAtom).pathname)
    })
    return {
        pattern: new Pattern(scopeValue),
        parameters
    }
});

export const usePattern = () => useMolecule(RouteMolecule).pattern

export const useParameters = () => useAtomValue(useMolecule(RouteMolecule).parameters)