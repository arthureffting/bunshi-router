import {Pattern} from "../src/Pattern";


describe("parameters", () => {

    test("variables", () => {
        let parameters = new Pattern("/test/{first}/{second}")
            .match("/test/this/that")
            .parameters
        expect(parameters["first"]).toBe("this")
        expect(parameters["second"]).toBe("that")
    })

    test("wildcards", () => {
        let parameters = new Pattern("/test/?/?")
            .match("/test/this/that")
            .parameters
        expect(parameters["0"]).toBe("this")
        expect(parameters["1"]).toBe("that")
    })
})


describe("pattern matching", () => {

    test("simple parsing", () => {
        expect(new Pattern("/definite/pattern").match("/definite/pattern").valid).toBe(true)
        expect(new Pattern("definite/pattern").match("/definite/pattern").valid).toBe(true)
        expect(new Pattern("/definite/pattern").match("definite/pattern").valid).toBe(true)
        expect(new Pattern("/definite/{between}/pattern").match("/definite/x/pattern").valid).toBe(true)
        expect(new Pattern("definite/{between}/pattern").match("/definite/x/pattern").valid).toBe(true)
        expect(new Pattern("/definite/{between}/pattern").match("definite/x/pattern").valid).toBe(true)
    })

    test("variables", () => {
        expect(new Pattern("/{1}/{2}/...").match("/um").valid).toBe(false)
        expect(new Pattern("/{1}/{2}/...").match("/um/dois").valid).toBe(true)
        expect(new Pattern("/{1}/{2}/...").match("/um/dois/tres").valid).toBe(true)
        expect(new Pattern("/{1}/{2}/...").match("/um/dois/tres/quatro/cinco").valid).toBe(true)
    })

    test("wildcards", () => {
        expect(new Pattern("/?").match("/hello").valid).toBe(true)
        expect(new Pattern("/?/?").match("/hello").valid).toBe(false)
        expect(new Pattern("/?").match("/hello/hello").valid).toBe(false)
        expect(new Pattern("/?/?").match("/hello/hello").valid).toBe(true)
        expect(new Pattern("/?/...").match("/hello/hello").valid).toBe(true)
        expect(new Pattern("/?/...").match("/hello/hello/hello").valid).toBe(true)
        expect(new Pattern("/...").match("/oi/oi").valid).toBe(true)

    })
})


describe("pattern filling", () => {


    test("pattern matches", () => {
        expect(new Pattern("/the/name/is/{name}").fill({
            "name": "Joe"
        }).value).toBe("/the/name/is/Joe")
    })


    test("array pattern matching", () => {
        expect(new Pattern("/?/?/?").fill(["1", "2", "3"]).value)
            .toBe("/1/2/3")
    })

})