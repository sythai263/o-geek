/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export interface IGuardResult {
    succeeded: boolean;
    message?: string;
}

export interface IGuardArgument {
    argument: any;
    argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
    public static combine(guardResults: IGuardResult[]): IGuardResult {
        for (const result of guardResults) {
            if (result.succeeded === false) {
                return result;
            }
        }

        return { succeeded: true };
    }

    public static againstNullOrUndefined(
        argument: any,
        argumentName: string,
    ): IGuardResult {
        if (argument === null || argument === undefined) {
            return {
                succeeded: false,
                message: `${argumentName} is null or undefined`,
            };
        }
        return { succeeded: true };
    }

    // @TODO not implement yet
    public static isEmail(
        argument: string,
        argumentName: string,
    ): IGuardResult {
        // eslint-disable-next-line max-len
        const testEmail =
            /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;
        if (!testEmail.test(argument)) {
            return {
                succeeded: false,
                message: `${argumentName} is not an valid email address`,
            };
        }

        return { succeeded: true };
    }

    public static againstNullOrUndefinedBulk(
        args: GuardArgumentCollection,
    ): IGuardResult {
        for (const arg of args) {
            const result = this.againstNullOrUndefined(
                arg.argument,
                arg.argumentName,
            );
            if (!result.succeeded) {
                return result;
            }
        }

        return { succeeded: true };
    }

    public static startTimeLessThanEndTime(
        startAt: Date,
        endAt: Date,
    ): IGuardResult {
        if (startAt > endAt) {
            return {
                succeeded: false,
                message: 'startAt must less than endAt',
            };
        }

        return { succeeded: true };
    }

    public static isOneOf(
        value: any,
        validValues: any[],
        argumentName: string,
    ): IGuardResult {
        let isValid = false;
        for (const validValue of validValues) {
            if (value === validValue) {
                isValid = true;
            }
        }

        if (isValid) {
            return { succeeded: true };
        }
        return {
            succeeded: false,
            message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(
                validValues,
            )}. Got "${value}".`,
        };
    }

    public static inRange(
        num: number,
        min: number,
        max: number,
        argumentName: string,
    ): IGuardResult {
        const isInRange = num >= min && num <= max;
        if (!isInRange) {
            return {
                succeeded: false,
                message: `${argumentName} is not within range ${min} to ${max}.`,
            };
        }
        return { succeeded: true };
    }

    public static allInRange(
        numbers: number[],
        min: number,
        max: number,
        argumentName: string,
    ): IGuardResult {
        let failingResult: IGuardResult = null;
        for (const num of numbers) {
            const numIsInRangeResult = this.inRange(
                num,
                min,
                max,
                argumentName,
            );
            if (!numIsInRangeResult.succeeded) {
                failingResult = numIsInRangeResult;
            }
        }

        if (failingResult) {
            return {
                succeeded: false,
                message: `${argumentName} is not within the range.`,
            };
        }
        return { succeeded: true };
    }
}
