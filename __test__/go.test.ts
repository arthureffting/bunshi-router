import {to, withParameters} from "../src";
import {Pattern} from "../src/Pattern";


describe("withParameters", () => {

    test("setting path variables", () => {


        const result = withParameters({
            "name": "Joe",
            "age": "25"
        }, to("/the/name/is/{name}"))({}, new Pattern())

        expect(result.pathname).toBe("/the/name/is/Joe")
        expect(result.searchParams.get("age")).toBe("25")

    })


})