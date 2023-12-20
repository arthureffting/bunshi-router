import {Part} from "./Part";

export class Pattern {

    constructor(public value: string = "/") {
    }

    matches = (path: string) => {
        if (!path.startsWith("/")) path = "/" + path
        const patternParts = this.value.split("/")
            .filter(x => x && x.length > 0);

        if (new Part(patternParts[patternParts.length - 1]).isMultiWildcard()) {
            // Route ends with multi wildcard, consider the route without it as well
            if (new Pattern("/" + patternParts.slice(0, patternParts.length - 1).join("/")).matches(path)) {
                return true
            }
        }

        const locationParts = path.split("/")
            .filter(x => x && x.length > 0);
        const minSize = Math.min(patternParts.length, locationParts.length);
        for (let i = 0; i < minSize; i++) {
            const routePart = new Part(patternParts[i]);
            const locationPart = new Part(locationParts[i]);
            if (!routePart.equals(locationPart)) {
                if (routePart.isIndependentFrom(locationPart)) {
                    return false;
                } else if (routePart.isMoreSpecificThan(locationPart)) {
                    return false;
                }
            }
        }

        if (patternParts.length == locationParts.length) {
            // All parts were equivalent and they have the same length
            return true;
        } else if (locationParts.length > patternParts.length) {
            // Path is more specific than route
            return new Part(patternParts[patternParts.length - 1]).isMultiWildcard()
        } else {
            // Route is more specific than path
            return new Part(patternParts[locationParts.length]).isMultiWildcard()
        }

    }

    getParts = (path: string) => {
        return path?.split("/")
            .filter(p => p && p.length > 0)
            .map(p => new Part(p)) ?? []
    }

    get parts() {
        return this.value.split("/")
            .filter(p => p && p.length > 0)
            .map(p => new Part(p))
    }

    extend = (path: any) => {
        return new Pattern("/" + this.value.split("/")
            .filter(p => p && p.length > 0)
            .map(p => new Part(p))
            .filter(p => !p.isMultiWildcard())
            .map(p => p.value)
            .concat(path?.split("/").filter((p: string) => p && p.length > 0) ?? [])
            .join("/"))
    }

    getParameters: (pathname: string | undefined) => { [key: string]: string } = (pathname) => {
        if (!pathname) return {}
        else {
            const parameters: { [key: string]: string } = {}
            const patternParts = this.getParts(this.value)
            const locationParts = this.getParts(pathname)
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

    getMinimalPath(pathname: string | undefined) {
        const parameters = this.getParameters(pathname)
        let path = this.value
        Object.keys(parameters).forEach(parameterName => {
            path = path.replace(`{${parameterName}}`, parameters[parameterName])
        })
        return path
    }

    reduce = (path: string) => {
        return new Pattern(this.value.substring(0, this.value.length - path.length))
    }

    fill = (pathname: string, parameters: { [key: string]: string }) => {
        const parts = this.getParts(pathname)
        const patternParts = this.getParts(this.value)
        Object.keys(parameters).forEach(parameter => {
            const lastIndexInPattern = patternParts.length - 1 - [...patternParts]
                .reverse()
                .findIndex(part => part.isVariable() && part.name == parameter)
            console.log("last index", patternParts.map(p => p.value), parameter, lastIndexInPattern)
            parts[lastIndexInPattern] = new Part(parameters[parameter])
        })
        return parts.map(p => p.value).join("/")
    }
}

