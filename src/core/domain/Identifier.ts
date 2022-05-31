export class Identifier<T> {
    constructor(private _value: T) {
        this._value = _value;
    }

    equals(id?: Identifier<T>): boolean {
        if (id === null || id === undefined) {
            return false;
        }
        if (!(id instanceof this.constructor)) {
            return false;
        }
        return id.toValue() === this._value;
    }

    toString(): string {
        return String(this._value);
    }

    /**
     * Return raw value of identifier
     */

    toValue(): T {
        return this._value;
    }
}
