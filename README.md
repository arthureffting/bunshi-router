# bunshi-router

Lightweight [open-source]("https://github.com/arthureffting/bunshi-router") library to provide routing based on [bunshi](https://www.bunshi.org/) and [jotai-location](https://github.com/jotaijs/jotai-location).

# Usage

Create routes within a router to render them according to the current location.

```typescript jsx
import {Route, Router} from "./Router";

const MyComponent = () => {

    return <Router>
        <Route path={"/dashboard"}>
            <Home/>
        </Route>
        <Route path={"/user/{userId}/..."}>
            <Dashboard/>
        </Route>
        <Route>
            <Redirect go={to("/dashboard")}/>
        </Route>
    </Router>

}

```

You can control the initial route of nested routers by two parameters:
- root: indicates that the router should ignore any route it finds itself in and start routing from an empty path
- base: adds a prefix to any route considered by this router

Within a route, you can use the `useParameters()` hook to access the current path variables.

````typescript jsx
import {useParameters} from "./Scope";

const Dashboard = () => {

    const {userId} = useParameters()

    return <>
        Hello {userId}
    </>

}
````

## Router nesting



## Navigating

The library offers the `useGo()`hook as an utility to navigate, as well as several functions to be used with it.

```typescript jsx
import {back, into, to, useGo, withParameters} from "./Go";

const OrderList = () => {

    const go = useGo()
    const openSettings = go(to("/settings"))
    const returnToDashboard = go(back(1))
    const openOrderDetails = (order: Order) => go(into(order.id))
    const openUserProfile = go(withParameters({
        userId: "1234"
    }, to("/profile/{userId}")))

    return <>
        ...
    </>
}
```

Alternatively, you can set the location obtained from the route molecule directly.


## Route molecule

The route molecule exposes the current route pattern (e.g /dashboard/{userId}), the location atom and the parameters atom (read-only).

```typescript jsx
import {useMolecule} from "bunshi/react";
import {RouteMolecule} from "./Scope";
import {useAtomValue} from "jotai";

const Component = () => {

    const route = useMolecule(RouteMolecule)
    const location = useAtomValue(route.location)
    const parameters = useAtomValue(route.parameters)
    
    return <>
        The current route is {route.pattern.value}
    </>

}

```
