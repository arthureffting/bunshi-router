// An expression consists of a string which represents a path
import {Pattern} from "./Pattern";

export class PatternMatching {

    private _valid: boolean
    private _parameters: { [key: string]: string }

    constructor(private _expression: Pattern,
                private _location: Pattern) {
        this._valid = this.checkValidity()
        this._parameters = this.checkParameters()
    }

    get valid() {
        return this._valid
    }

    get parameters() {
        return this._parameters
    }

    private checkValidity() {

        const patternParts = this._expression.parts


        if(patternParts.length === 0){
            return this._location.parts.length === 0
        }

        if (patternParts[patternParts.length - 1].isMultiWildcard()) {
            // Route ends with multi wildcard, consider the route without it as well
            const alternativePattern = new Pattern("/" + patternParts.slice(0, patternParts.length - 1).join("/"))
            const alternativeMatching = alternativePattern.match(this._location)
            if (alternativeMatching.valid) {
                return true
            }
        }

        const minSize = Math.min(patternParts.length, this._location.parts.length);
        for (let i = 0; i < minSize; i++) {
            const routePart = patternParts[i];
            const locationPart = this._location.parts[i];
            if (!routePart.equals(locationPart)) {
                if (routePart.isIndependentFrom(locationPart)) {
                    return false;
                } else if (routePart.isMoreSpecificThan(locationPart)) {
                    return false;
                }
            }
        }

        if (patternParts.length == this._location.parts.length) {
            // All parts were equivalent and they have the same length
            return true;
        } else if (this._location.parts.length > patternParts.length) {
            // Path is more specific than route
            return patternParts[patternParts.length - 1].isMultiWildcard()
        } else {
            // Route is more specific than path
            return patternParts[this._location.parts.length].isMultiWildcard()
        }
    }

    private checkParameters: () => { [key: string]: string } = () => {
        if (!this._location) return {}
        else {
            const parameters: { [key: string]: string } = {}
            const patternParts = this._expression.parts
            const locationParts = this._location.parts
            const max = Math.max(patternParts.length, locationParts.length)
            for (let i = 0; i < max; i++) {
                if (patternParts[i]?.isSingleWildcard() && locationParts[i]) {
                    const variableName = patternParts[i].isVariable() ? patternParts[i].name : Object.keys(parameters).length
                    parameters[variableName] = locationParts[i].value
                }
            }
            return parameters
        }
    }
}