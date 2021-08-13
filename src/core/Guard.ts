export interface IGuardResult {
  message?: string;
  succeeded: boolean;
}

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export class Guard {
  public static combine(guardResults: IGuardResult[]): IGuardResult {
    return (
      guardResults.find((guardResult) => !guardResult.succeeded) || {
        succeeded: true,
      }
    );
  }

  public static greaterThan(
    minValue: number,
    actualValue: number,
  ): IGuardResult {
    return actualValue > minValue
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `Number given {${actualValue}} is not greater than {${minValue}}`,
        };
  }

  public static againstAtLeast(numChars: number, text: string): IGuardResult {
    return text.length >= numChars
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `Text is not at least ${numChars} chars.`,
        };
  }

  public static againstAtMost(numChars: number, text: string): IGuardResult {
    return text.length <= numChars
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `Text is greater than ${numChars} chars.`,
        };
  }

  public static againstNullOrUndefined(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

  public static againstNullOrUndefinedBulk(
    args: IGuardArgument[],
  ): IGuardResult {
    return (
      args
        .map(({ argument, argumentName }) =>
          Guard.againstNullOrUndefined(argument, argumentName),
        )
        .find((result) => !result.succeeded) || { succeeded: true }
    );
  }

  public static isOneOf(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    value: any,
    validValues: any[],
    argumentName: string,
  ): IGuardResult {
    return validValues.includes(value)
      ? { succeeded: true }
      : {
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
    const failingResult = numbers
      .map((n) => Guard.inRange(n, min, max, argumentName))
      .find((inRangeResult) => !inRangeResult.succeeded);

    if (failingResult) {
      return {
        succeeded: false,
        message: `${argumentName} is not within the range.`,
      };
    }
    return { succeeded: true };
  }
}
