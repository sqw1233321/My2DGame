export default class Singleton {
  private static _instance: any = null;

  protected static GetInstance<T>(): T {
    if (this._instance === null) {
      this._instance = new this();
    }
    return this._instance;
  }

  protected constructor() {}
}
