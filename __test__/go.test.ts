import {to, withPathParameters} from "../src";
import {Pattern} from "../src/Pattern";
import {withQueryParameters} from "../src/Go";


describe("withParameters", () => {
    test("setting path variables", () => {
        const result = withPathParameters({
            "name": "Joe"
        }, withQueryParameters({
            "age": "25"
        }, to("/the/name/is/{name}")))({}, new Pattern())
        console.log("result", result)
        expect(result.pathname).toBe("/the/name/is/Joe")
        expect(result.searchParams?.get("age")).toBe("25")
    })


    test("settings with wildcard", () => {
        const result = withPathParameters({
            "name": "Joe",
            "age": "25",
        }, to("/the/name/is/{name}/..."))({}, new Pattern())
        expect(result.pathname).toBe("/the/name/is/Joe")
    })
})