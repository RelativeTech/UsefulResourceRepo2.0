## API Report File for "@firebase/database-exp"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { FirebaseApp } from '@firebase/app';

// @public (undocumented)
export function child(parent: Reference, path: string): Reference;

// @public
export class DataSnapshot {
    child(path: string): DataSnapshot;
    exists(): boolean;
    exportVal(): any;
    forEach(action: (child: DataSnapshot) => boolean | void): boolean;
    hasChild(path: string): boolean;
    hasChildren(): boolean;
    get key(): string | null;
    get priority(): string | number | null;
    readonly ref: Reference;
    get size(): number;
    toJSON(): object | null;
    val(): any;
}

// @public
export function enableLogging(enabled: boolean, persistent?: boolean): any;

// @public
export function enableLogging(logger: (message: string) => unknown): any;

// @public
export function endAt(value: number | string | boolean | null, key?: string): QueryConstraint;

// @public
export function endBefore(value: number | string | boolean | null, key?: string): QueryConstraint;

// @public
export function equalTo(value: number | string | boolean | null, key?: string): QueryConstraint;

// @public
export type EventType = 'value' | 'child_added' | 'child_changed' | 'child_moved' | 'child_removed';

// @public
export class FirebaseDatabase {
    readonly app: FirebaseApp;
    readonly 'type' = "database";
}

// @public
export function get(query: Query): Promise<DataSnapshot>;

// @public
export function getDatabase(app?: FirebaseApp, url?: string): FirebaseDatabase;

// @public
export function goOffline(db: FirebaseDatabase): void;

// @public
export function goOnline(db: FirebaseDatabase): void;

// @public
export function increment(delta: number): object;

// @public
export function limitToFirst(limit: number): QueryConstraint;

// @public
export function limitToLast(limit: number): QueryConstraint;

// @public
export interface ListenOptions {
    readonly onlyOnce?: boolean;
}

// @public
export function off(query: Query, eventType?: EventType, callback?: (snapshot: DataSnapshot, previousChildName?: string | null) => unknown): void;

// @public
export function onChildAdded(query: Query, callback: (snapshot: DataSnapshot, previousChildName?: string | null) => unknown, cancelCallback?: (error: Error) => unknown): Unsubscribe;

// @public
export function onChildAdded(query: Query, callback: (snapshot: DataSnapshot, previousChildName: string | null) => unknown, options: ListenOptions): Unsubscribe;

// @public
export function onChildAdded(query: Query, callback: (snapshot: DataSnapshot, previousChildName: string | null) => unknown, cancelCallback: (error: Error) => unknown, options: ListenOptions): Unsubscribe;

// @public
export function onChildChanged(query: Query, callback: (snapshot: DataSnapshot, previousChildName: string | null) => unknown, cancelCallback?: (error: Error) => unknown): Unsubscribe;

// @public
export function onChildChanged(query: Query, callback: (snapshot: DataSnapshot, previousChildName: string | null) => unknown, options: ListenOptions): Unsubscribe;

// @public
export function onChildChanged(query: Query, callback: (snapshot: DataSnapshot, previousChildName: string | null) => unknown, cancelCallback: (error: Error) => unknown, options: ListenOptions): Unsubscribe;

// @public
export function onChildMoved(query: Query, callback: (snapshot: DataSnapshot, previousChildName: string | null) => unknown, cancelCallback?: (error: Error) => unknown): Unsubscribe;

// @public
export function onChildMoved(query: Query, callback: (snapshot: DataSnapshot, previousChildName: string | null) => unknown, options: ListenOptions): Unsubscribe;

// @public
export function onChildMoved(query: Query, callback: (snapshot: DataSnapshot, previousChildName: string | null) => unknown, cancelCallback: (error: Error) => unknown, options: ListenOptions): Unsubscribe;

// @public
export function onChildRemoved(query: Query, callback: (snapshot: DataSnapshot) => unknown, cancelCallback?: (error: Error) => unknown): Unsubscribe;

// @public
export function onChildRemoved(query: Query, callback: (snapshot: DataSnapshot) => unknown, options: ListenOptions): Unsubscribe;

// @public
export function onChildRemoved(query: Query, callback: (snapshot: DataSnapshot) => unknown, cancelCallback: (error: Error) => unknown, options: ListenOptions): Unsubscribe;

// @public
export class OnDisconnect {
    cancel(): Promise<void>;
    remove(): Promise<void>;
    set(value: unknown): Promise<void>;
    setWithPriority(value: unknown, priority: number | string | null): Promise<void>;
    update(values: object): Promise<void>;
}

// @public
export function onDisconnect(ref: Reference): OnDisconnect;

// @public
export function onValue(query: Query, callback: (snapshot: DataSnapshot) => unknown, cancelCallback?: (error: Error) => unknown): Unsubscribe;

// @public
export function onValue(query: Query, callback: (snapshot: DataSnapshot) => unknown, options: ListenOptions): Unsubscribe;

// @public
export function onValue(query: Query, callback: (snapshot: DataSnapshot) => unknown, cancelCallback: (error: Error) => unknown, options: ListenOptions): Unsubscribe;

// @public
export function orderByChild(path: string): QueryConstraint;

// @public
export function orderByKey(): QueryConstraint;

// @public
export function orderByPriority(): QueryConstraint;

// @public
export function orderByValue(): QueryConstraint;

// @public
export function push(parent: Reference, value?: unknown): ThenableReference;

// @public
export interface Query {
    isEqual(other: Query | null): boolean;
    readonly ref: Reference;
    toJSON(): string;
    toString(): string;
}

// @public
export function query(query: Query, ...queryConstraints: QueryConstraint[]): Query;

// @public
export abstract class QueryConstraint {
    abstract readonly type: QueryConstraintType;
}

// @public
export type QueryConstraintType = 'endAt' | 'endBefore' | 'startAt' | 'startAfter' | 'limitToFirst' | 'limitToLast' | 'orderByChild' | 'orderByKey' | 'orderByPriority' | 'orderByValue' | 'equalTo';

// @public
export function ref(db: FirebaseDatabase, path?: string): Reference;

// @public
export interface Reference extends Query {
    readonly key: string | null;
    readonly parent: Reference | null;
    readonly root: Reference;
}

// @public
export function refFromURL(db: FirebaseDatabase, url: string): Reference;

// @public
export function remove(ref: Reference): Promise<void>;

// @public
export function runTransaction(ref: Reference, transactionUpdate: (currentData: any) => unknown, options?: TransactionOptions): Promise<TransactionResult>;

// @public
export function serverTimestamp(): object;

// @public
export function set(ref: Reference, value: unknown): Promise<void>;

// @public
export function setPriority(ref: Reference, priority: string | number | null): Promise<void>;

// @public
export function setWithPriority(ref: Reference, value: unknown, priority: string | number | null): Promise<void>;

// @public
export function startAfter(value: number | string | boolean | null, key?: string): QueryConstraint;

// @public
export function startAt(value?: number | string | boolean | null, key?: string): QueryConstraint;

// @public
export interface ThenableReference extends Reference, Pick<Promise<Reference>, 'then' | 'catch'> {
}

// @public
export interface TransactionOptions {
    readonly applyLocally?: boolean;
}

// @public
export class TransactionResult {
    readonly committed: boolean;
    readonly snapshot: DataSnapshot;
    toJSON(): object;
}

// @public
export type Unsubscribe = () => void;

// @public
export function update(ref: Reference, values: object): Promise<void>;

// @public
export function useDatabaseEmulator(db: FirebaseDatabase, host: string, port: number): void;


```
