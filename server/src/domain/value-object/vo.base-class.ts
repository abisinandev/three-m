export abstract class ValueObjectBase<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }
}
