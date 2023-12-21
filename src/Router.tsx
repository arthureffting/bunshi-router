import React from "react";
import {RouteProvider, usePattern} from "./Scope";
import {useLocation} from "./Go";
import {Pattern} from "./Pattern";

export interface RouteProps {
    path?: string
}

export const Route: React.FunctionComponent<RouteProps & {
    children: any
}> = (props) => {
    const pattern = usePattern()
    pattern.extend(props.path).value
    return <RouteProvider value={pattern.extend(props.path).value}>
        {props.children}
    </RouteProvider>
}

export const Router = (props: {
    root?: boolean,
    base?: string,
    children: any
}) => {
    const pattern = usePattern()
    const location = useLocation()
    return <RouteProvider value={(props.root ? new Pattern() : pattern).extend(props.base).value}>
        {(Array.isArray(props.children) ? props.children : [props.children])
            .find(route => {
                if (!route.props.path) {
                    // A route with no path definition has no path requirements, always matches
                    return true;
                } else if (location.pathname) {
                    return pattern.extend(route.props.path).match(location.pathname).valid
                } else return false;
            })}
    </RouteProvider>


}

