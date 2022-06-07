declare module 'sqlstring-sqlite' {
  class SqlString {
    constructor();
    static format: (a: string, b: unknown[]) => string;
  }
  export = SqlString;
}
