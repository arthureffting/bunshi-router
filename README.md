# bunshi-router

Simple library to provide routing based on [bunshi](https://www.bunshi.org/) and [jotai-location](https://github.com/jotaijs/jotai-location).

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
            <Fallback/>
        </Route>
    </Router>

}

```

You can use the `useParameters()` hook to access path variables within routes.

````typescript jsx
import {useParameters} from "./Scope";

const Dashboard = () => {

    const {userId} = useParameters()

    return <>
        Hello {userId}
    </>

}
````
