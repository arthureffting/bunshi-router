import {render, screen, cleanup} from "@testing-library/react";
import '@testing-library/jest-dom'
import {Route, Router} from "../src";
import React from "react";

afterEach(() => {
    cleanup(); // Resets the DOM after each test suite
})

test("Fallback route", async () => {
    render(<Router>
        <Route>
            <div data-testid={"fallback"}/>
        </Route>
    </Router>);
    expect(screen.getByTestId("fallback")).toBeInTheDocument()
})

test("Order matters", async () => {
    render(<Router>
        <Route>
            <div data-testid={"primary"}/>
        </Route>
        <Route>
            <div data-testid={"fallback"}/>
        </Route>
    </Router>);
    expect(screen.getByTestId("primary")).toBeInTheDocument()
    expect(screen.queryByTestId("fallback")).toBeNull()
})
test("Wildcard gets rendered", async () => {
    render(<Router>
        <Route path={"/..."}>
            <div data-testid={"primary"}/>
        </Route>
        <Route>
            <div data-testid={"fallback"}/>
        </Route>
    </Router>);
    expect(screen.getByTestId("primary")).toBeInTheDocument()
    expect(screen.queryByTestId("fallback")).toBeNull()
})

test("Route pattern gets not rendered when at default location", async () => {
    render(<Router>
        <Route path={"/{id}/..."}>
            <div data-testid={"primary"}/>
        </Route>
        <Route>
            <div data-testid={"fallback"}/>
        </Route>
    </Router>);
    expect(screen.queryByTestId("primary")).toBeNull()
    expect(screen.getByTestId("fallback")).toBeInTheDocument()
})


test("Route pattern gets rendered when at a matching location", async () => {
    window.location.assign("/id/hello");
    render(<Router>
        <Route path={"/{id}/..."}>
            <div data-testid={"primary"}/>
        </Route>
        <Route>
            <div data-testid={"fallback"}/>
        </Route>
    </Router>);
    expect(screen.queryByTestId("primary")).toBeNull()
    expect(screen.getByTestId("fallback")).toBeInTheDocument()
})