import {Pattern} from "../src/Pattern";
import {parseLocation} from "../src/Go";


describe("Test parameter parsing", () => {


    test("path and query parameters", () => {
        const pattern = new Pattern("/profile/{profileId}")
        const location = parseLocation("/profile/1?age=25")
        const parameters = pattern.match(location).parameters
        expect(parameters["profileId"]).toBe("1")
        expect(parameters["age"]).toBe("25")
    })

})