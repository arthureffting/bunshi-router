import {Part} from "./Part";
import {PatternMatching} from "./PatternMatching";
import {Location} from "./Scope";

export class Pattern {

    constructor(public _value: string = "/") {
    }


    get value() {
        if (!this._value.startsWith("/")) {
            return "/" + this._value
        } else return this._value
    }

    match = (path: Location | undefined) => {
        return new PatternMatching(this, path ?? {});
    }

    get parts() {
        return this.value.split("/")
            .filter(p => p && p.length > 0)
            .map((value, index) => new Part(index, value))
    }

    get variables() {
        return this.parts
            .filter(part => part.isVariable())
    }

    hasVariable = (name: string) => {
        return this.variables.some(variable => variable.name === name)
    }

    extend = (path: any) => {
        return new Pattern("/" + this.parts
            .filter(p => !p.isMultiWildcard())
            .map(p => p.value)
            .concat(path?.split("/").filter((p: string) => p && p.length > 0) ?? [])
            .join("/"))
    }

    fill = (parameters: string[] | { [key: string]: string }) => {
        if (Array.isArray(parameters)) {
            // Fill as array
            return new Pattern(this.parts
                .map((part, index) => {
                    if (part.isSingleWildcard()) {
                        return new Part(index, parameters[index])
                    } else {
                        return part
                    }
                })
                .map(part => part.value)
                .join("/"))
        } else {
            // Fill by name
            const patternParts = this.parts
            Object.keys(parameters).forEach(parameter => {
                const withName = this.variables.filter(variable => variable.name === parameter)
                if (withName.length > 0) {
                    const lastWithName = withName[withName.length - 1]
                    patternParts[lastWithName.index] = new Part(lastWithName.index, parameters[parameter])
                }
            })
            return new Pattern(patternParts.map(p => p.value).join("/"))
        }

    }
}

