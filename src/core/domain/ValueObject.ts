import { isEqual } from 'lodash';

interface ValueObjectProps {
  [key: string]: any;
}

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structrual property.
 */

export abstract class ValueObject<TProps extends ValueObjectProps> {
  public readonly props: TProps;

  constructor(props: TProps) {
    this.props = Object.freeze(props);
  }

  public equals(otherValueObject?: ValueObject<TProps>): boolean {
    if (otherValueObject === null || otherValueObject === undefined) {
      return false;
    }

    if (otherValueObject.props === undefined) {
      return false;
    }

    return isEqual(this.props, otherValueObject.props);
  }
}
