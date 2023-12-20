import {Route, Router} from "./Router";
import React from "react";


export const Example = () => {
    return <Router>
        <Route path={"/dashboard/..."} element={<>Dashboard</>}>
            <Route path={"/users/..."}>
                <Route path={"/{userId}"} element={<>My user</>}/>
                <Route element={<>Fallback</>}/>
            </Route>
        </Route>
    </Router>

}