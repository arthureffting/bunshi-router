const SINGLE_WILDCARD = "?";
const MULTI_WILDCARD = "...";

export class Part {
    constructor(public index: number, public value: string) {

    }

    equals = (other: Part) => {
        return this.value === other.value;
    }

    isIndependentFrom = (other: Part) => {
        return !this.isWildcard() && !other.isWildcard() && !this.equals(other);
    }

    isMoreSpecificThan = (other: Part) => {
        if (!this.isWildcard() && other.isWildcard()) {
            // something vs */**
            return true;
        } else if (this.isWildcard() && !other.isWildcard()) {
            // */** vs something
            return false;
        } else return other.isMultiWildcard();
    }

    isWildcard = () => {
        return this.isSingleWildcard() || this.isMultiWildcard();
    }

    isSingleWildcard = () => {
        return this.isVariable() || this.value === SINGLE_WILDCARD;
    }

    isMultiWildcard() {
        return this.value === MULTI_WILDCARD;
    }

    isVariable = () => {
        return this.value.startsWith("{") && this.value.endsWith("}")
    }

    get name() {
        return this.value.substring(1, this.value.length - 1)
    }

}