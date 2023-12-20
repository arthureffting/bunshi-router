import {RouteProvider, usePattern} from "./Scope";
import {useLocation} from "./Go";
import {Pattern} from "./Pattern";
import React from "react";


export const useChosenRoute = (children: any) => {
    const pattern = usePattern()
    const location = useLocation()
    return (Array.isArray(children) ? children : [children])
        .find(route => {
            if (!route.props.path) {
                // A route with no path definition has no path requirements, always matches
                return true;
            } else if (location.pathname) {
                return pattern.extend(route.props.path).matches(location.pathname)
            } else return false;
        })
}

export const Route: React.FunctionComponent<{
    path?: string,
    element?: React.ReactElement,
    children?: any
}> = (props) => {
    const pattern = usePattern()
    return <RouteProvider value={pattern.extend(props.path).value}>
        {props.element ? React.cloneElement(props.element, {}, <Router>
            {props.children}
        </Router>) : null}
    </RouteProvider>
}

export const Router = (props: {
    root?: boolean,
    base?: string,
    children: any
}) => {
    const pattern = usePattern()
    const chosen = useChosenRoute(props.children)
    return <RouteProvider value={(props.root ? new Pattern() : pattern).extend(props.base ? props.base : "").value}>
        {chosen}
    </RouteProvider>


}

Router.propTypes = {
    children: (props: any, propName: string, componentName: string) => {
        return React.Children.map(props[propName], (child: any) => {
            if (!React.isValidElement(child) || child.type !== Route) {
                return new Error(
                    `Invalid child component type found in ${componentName}. Expected 'Route' components as children.`
                );
            }
            return child
        });
    },
};