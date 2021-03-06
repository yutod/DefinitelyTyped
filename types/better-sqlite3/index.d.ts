// Type definitions for better-sqlite3 5.2
// Project: http://github.com/JoshuaWise/better-sqlite3
// Definitions by: Ben Davies <https://github.com/Morfent>
//                 Mathew Rumsey <https://github.com/matrumz>
//                 Santiago Aguilar <https://github.com/sant123>
//                 Alessandro Vergani <https://github.com/loghorn>
//                 Andrew Kaiser <https://github.com/andykais>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

import Integer = require("integer");

type VariableArgFunction = (...params: any[]) => any;
type ArgumentTypes<F extends VariableArgFunction> = F extends (...args: infer A) => any
  ? A
  : never;

declare namespace BetterSqlite3 {
    interface Statement {
        database: Database;
        source: string;
        reader: boolean;

        run(...params: any[]): Database.RunResult;
        get(...params: any[]): any;
        all(...params: any[]): any[];
        iterate(...params: any[]): IterableIterator<any>;
        pluck(toggleState?: boolean): this;
        expand(toggleState?: boolean): this;
        raw(toggleState?: boolean): this;
        bind(...params: any[]): this;
        columns(): ColumnDefinition[];
        safeIntegers(toggleState?: boolean): this;
    }

    interface ColumnDefinition {
        name: string;
        column: string | null;
        table: string | null;
        database: string | null;
        type: string | null;
    }

    interface Transaction<F extends VariableArgFunction> {
        (...params: ArgumentTypes<F>): any;
        default(...params: ArgumentTypes<F>): any;
        deferred(...params: ArgumentTypes<F>): any;
        immediate(...params: ArgumentTypes<F>): any;
        exclusive(...params: ArgumentTypes<F>): any;
    }

    interface Database {
        memory: boolean;
        readonly: boolean;
        name: string;
        open: boolean;
        inTransaction: boolean;

        prepare(source: string): Statement;
        transaction<F extends VariableArgFunction>(fn: F): Transaction<F>;
        exec(source: string): this;
        pragma(source: string, options?: Database.PragmaOptions): any;
        checkpoint(databaseName?: string): this;
        function(name: string, cb: (...params: any[]) => any): this;
        function(name: string, options: Database.RegistrationOptions, cb: (...params: any[]) => any): this;
        aggregate(name: string, options: Database.AggregateOptions): this;
        loadExtension(path: string): this;
        close(): this;
        defaultSafeIntegers(toggleState?: boolean): this;
    }

    interface DatabaseConstructor {
        new(filename: string, options?: Database.Options): Database;
        (filename: string, options?: Database.Options): Database;
        prototype: Database;

        Integer: typeof Integer;
        SqliteError: typeof SqliteError;
    }
}

declare class SqliteError implements Error {
    name: string;
    message: string;
    code: string;
    constructor(message: string, code: string);
}

declare namespace Database {
    interface RunResult {
        changes: number;
        lastInsertRowid: Integer.IntLike;
    }

    interface Options {
        memory?: boolean;
        readonly?: boolean;
        fileMustExist?: boolean;
        timeout?: number;
    }

    interface PragmaOptions {
        simple?: boolean;
    }

    interface RegistrationOptions {
        varargs?: boolean;
        deterministic?: boolean;
        safeIntegers?: boolean;
    }

    interface AggregateOptions extends RegistrationOptions {
        start?: any;
        step: (total: any, next: any) => any;
        inverse?: (total: any, dropped: any) => any;
        result?: (total: any) => any;
    }

    type Integer = typeof Integer;
    type SqliteError = typeof SqliteError;
    type Statement = BetterSqlite3.Statement;
    type ColumnDefinition = BetterSqlite3.ColumnDefinition;
    type Transaction = BetterSqlite3.Transaction<VariableArgFunction>;
    type Database = BetterSqlite3.Database;
}

declare const Database: BetterSqlite3.DatabaseConstructor;
export = Database;
