declare module 'sqlstring-sqlite' {
  class SqlString {
    constructor();
    static format: (a: string, b: unknown[]) => string;

    static escape: (a: string) => string;
  }
  export = SqlString;
}
