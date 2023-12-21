import React, {useCallback} from "react";
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

    const routePattern = useCallback(() => {
        return (props.root ? new Pattern() : pattern).extend(props.base)
    }, [props.root, props.base, pattern])

    return <RouteProvider value={routePattern().value}>
        {(Array.isArray(props.children) ? props.children : [props.children])
            .find(route => {
                if (!route.props.path) {
                    // A route with no path definition has no path requirements, always matches
                    return true;
                } else if (location.pathname) {
                    return routePattern().extend(route.props.path).match(location.pathname).valid
                } else return false;
            })}
    </RouteProvider>


}

