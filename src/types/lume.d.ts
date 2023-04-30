/** @noSelfInFile **/

declare type Table = object
declare type TableKey = object

declare module Lume {
	/**
	 * Returns the number `x` clamped between the numbers `min` and `max`.
	 */
	let clamp: (x: number, min: number, max: number) => number;

	/**
	 * Rounds `x` to the nearest integer; rounds away from zero if we're midway between two integers. If `increment` is set then the number is rounded to the nearest increment.
	 */
	let round: (x: number, increment?: number) => number;

	/**
	 * Returns 1 if `x` is 0 or above, returns -1 when `x` is negative.
	 */
	let sign: (x: number) => number;

	/**
	 * Returns the linearly interpolated number between `a` and `b`, `amount` should be in the range of 0 - 1; if `amount` is outside of this range it is clamped.
	 */
	let lerp: (a: number, b: number, amount: number) => number;

	/**
	 * Similar to `lume.lerp()` but uses cubic interpolation instead of linear interpolation.
	 */
	let smooth: (a: number, b: number, amount: number) => number;

	/**
	 * Ping-pongs the number `x` between 0 and 1.
	 */
	let pingpong: (x: number) => number;

	/**
	 * Returns the distance between the two points. If `squared` is true then the squared distance is returned -- this is faster to calculate and can still be used when comparing distances.
	 */
	let distance: (x1: number, y1: number, x2: number, y2: number, squared?: boolean) => number;

	/**
	 * Returns the angle between the two points.
	 */
	let angle: (x1: number, y1: number, x2: number, y2: number) => number;

	/**
	 * Given an angle and magnitude, returns a vector.
	 */
	/** @TupleReturn */
	let vector: (angle: number, magnitude: number) => [number, number];

	/**
	 * Returns a random number between `a` and `b`. If only `a` is supplied a number between 0 and a is returned. If no arguments are supplied a random number between 0 and 1 is returned.
	 */
	let random: (a?: number, b?: number) => number;

	/**
	 * Returns a random value from array `t`. If the array is empty an error is raised.
	 */
	let randomchoice:<T> (t: T[]) => T;

	/**
	 * Takes the argument table `t` where the keys are the possible choices and the value is the choice's weight. A weight should be 0 or above, the larger the number the higher the probability of that choice being picked. If the table is empty, a weight is below zero or all the weights are 0 then an error is raised.
	 */
	let weightedchoice: (t: { [key: string]: number;[key: number]: number }) => string | number;

	/**
	 * Pushes all the given values to the end of the table `t` and returns the pushed values. Nil values are ignored.
	 */
	/** @TupleReturn */
	let push: (t: Table, ...vals: any[]) => any[];

	/**
	 * Removes the first instance of the value `x` if it exists in the table `t`. Returns `x`.
	 */
	let remove: (t: Table, x: any) => any;

	/**
	 * Nils all the values in the table `t`, this renders the table empty. Returns `t`.
	 */
	let clear: (t: Table) => Table;

	/**
	 * Copies all the fields from the source tables to the table `t` and returns `t`. If a key exists in multiple tables the right-most table's value is used.
	 */
	let extend: (t: Table, ...vals: Table[]) => Table;

	/**
	 * Returns a shuffled copy of the array `t`.
	 */
	let shuffle: (t: any[]) => any[];

	/**
	 * Returns a copy of the array `t` with all its items sorted. If `comp` is a function it will be used to compare the items when sorting. If `comp` is a string it will be used as the key to sort the items by.
	 */
	let sort:<T> (t: T[], comp?: (a: T, b: T) => boolean | string) => T[];

	/**
	 * Iterates the table `t` and calls the function `fn` on each value followed by the supplied additional arguments; if `fn` is a string the method of that name is called for each value. The function returns `t` unmodified.
	 */
	let each: (t: Table, fn: (arg: any, ...args: any[]) => any | string, ...args: any[]) => Table;

	/**
	 * Applies the function `fn` to each value in table `t` and returns a new table with the resulting values.
	 */
	let map: (t: Table, fn: (arg: any) => any) => Table;

	/**
	 * Returns true if all the values in table `t` are true. If a `fn` function is supplied it is called on each value, true is returned if all of the calls to `fn` return true.
	 */
	let all: (t: Table, fn?: (arg: any) => boolean) => boolean;

	/**
	 * Returns true if any of the values in table `t` are true. If a `fn` function is supplied it is called on each value, true is returned if any of the calls to fn return true.
	 */
	let any: (t: Table, fn?: (arg: any) => boolean) => boolean;

	/**
	 * Applies `fn` on two arguments cumulative to the items of the array `t`, from left to right, so as to reduce the array to a single value. If a `first` value is specified the accumulator is initialised to this, otherwise the first value in the array is used. If the array is empty and no `first` value is specified an error is raised.
	 */
	let reduce: (t: any[], fn: (a: any, b: any) => any, first?: any) => any;

	/**
	 * Returns a copy of the `t` array with all the duplicate values removed.
	*/
	let unique: (t: any[]) => any[];

	/**
	 * Calls `fn` on each value of table `t`. Returns a new table with only the values where `fn` returned true. If `retainkeys` is true the table is not treated as an array and retains its original keys.
	 */
	let filter: (t: Table, fn: (val: any) => boolean, retainkeys?: boolean) => Table;

	/**
	 * The opposite of `lume.filter()`: Calls `fn` on each value of table `t`; returns a new table with only the values where `fn` returned false. If `retainkeys` is true the table is not treated as an array and retains its original keys.
	 */
	let reject: (t: Table, fn: (val: any) => boolean, retainKeys?: boolean) => Table;

	/**
	 * Returns a new table with all the given tables merged together. If a key exists in multiple tables the right-most table's value is used.
	 */
	let merge: <A, B>(a: A, b: B) => A & B;

	/**
	 * Returns a new array consisting of all the given arrays concatenated into one.
	 */
	let concat: (...arrays: any[][]) => any[];

	/**
	 * Returns the index/key of `value` in `t`. Returns nil if that value does not exist in the table.
	 */
	let find: (t: Table, value: any) => string | number;

	/**
	 * Returns the value and key of the value in table `t` which returns true when `fn` is called on it. Returns nil if no such value exists.
	 */
	/** @TupleReturn */
	let match: (t: Table, fn: (val: any) => boolean) => [any, string | number]

	/**
	 * Counts the number of values in the table `t`. If a `fn` function is supplied it is called on each value, the number of times it returns true is counted.
	 */
	let count: <T>(t: T[], fn?: (val: T) => boolean) => number;

	/**
	 * Mimics the behaviour of Lua's `string.sub`, but operates on an array rather than a string. Creates and returns a new array of the given slice.
	 */
	let slice: (t: any[], i?: number, j?: number) => any[];

	/**
	 * Returns the first element of an array or nil if the array is empty. If `n` is specificed an array of the first `n` elements is returned.
	 */
	let first: (t: any[], n?: number) => any | any[];

	/**
	 * Returns the last element of an array or nil if the array is empty. If `n` is specificed an array of the last `n` elements is returned.
	 */
	//last: <T>(t: T[], n?: number) => T | T[];
	let last: <T, N extends number | undefined>(t: T[], n?: N) => N extends number ? T[] : T;

	/**
	 * Returns a copy of the table where the keys have become the values and the values the keys.
	 */
	let invert: (t: Table) => Table;

	/**
	 * Returns a copy of the table filtered to only contain values for the given keys.
	 */
	let pick: (t: Table, ...keys: TableKey[]) => Table;

	/**
	 * Returns an array containing each key of the table.
	 */
	let keys: (t: Table) => any[];

	/**
	 * Returns a shallow copy of the table `t`.
	 */
	let clone: (t: Table) => Table;

	/**
	 * Creates a wrapper function around function `fn`, automatically inserting the arguments into `fn` which will persist every time the wrapper is called. Any arguments which are passed to the returned function will be inserted after the already existing arguments passed to `fn`.
	 */
	let fn: (fn: (...args: any[]) => any, ...args: any[]) => (...args: any[]) => any;

	/**
	 * Returns a wrapper function to `fn` which takes the supplied arguments. The wrapper function will call `fn` on the first call and do nothing on any subsequent calls.
	 */
	let once: (fn: (...args: any[]) => any, ...args: any[]) => (...args: any[]) => any;

	/**
	 * Returns a wrapper function to `fn` where the results for any given set of arguments are cached. `lume.memoize()` is useful when used on functions with slow-running computations.
	 */
	let memoize: <R>(fn: (...args: any[]) => R) => (...args: any[]) => R;

	/**
	 * Creates a wrapper function which calls each supplied argument in the order they were passed to `lume.combine()`; nil arguments are ignored. The wrapper function passes its own arguments to each of its wrapped functions when it is called.
	 */
	let combine: (...funcs: ((...args: any[]) => any)[]) => (...args: any[]) => any;

	/**
	 * Calls the given function with the provided arguments and returns its values. If `fn` is nil then no action is performed and the function returns nil.
	 */
	/** @TupleReturn */
	let call: <T>(fn: (...args: any[]) => T, ...args: any[]) => T[];

	/**
	 * Inserts the arguments into function `fn` and calls it. Returns the time in seconds the function `fn` took to execute followed by `fn`'s returned values.
	 */
	/** @TupleReturn */
	let time: Function;
	//time: <T>(fn: (...args: any[]) => T, ...args: any[]) => [number, ...T[]];

	/**
	 * Takes a string lambda and returns a function. `str` should be a list of comma-separated parameters, followed by ->, followed by the expression which will be evaluated and returned.
	 */
	let lambda: (str: string) => Function;

	/**
	 * Serializes the argument `x` into a string which can be loaded again using `lume.deserialize()`. Only booleans, numbers, tables and strings can be serialized. Circular references will result in an error; all nested tables are serialized as unique tables.
	 */
	let serialize: (x: any) => string;

	/**
	 * Deserializes a string created by `lume.serialize()` and returns the resulting value. This function should not be run on an untrusted string.
	 */
	let deserialize: (str: string) => any;

	/**
	 * Returns an array of the words in the string `str`. If `sep` is provided it is used as the delimiter, consecutive delimiters are not grouped together and will delimit empty strings.
	 */
	let split: (str: string, sep?: string) => string[];

	/**
	 * Trims the whitespace from the start and end of the string `str` and returns the new string. If a `chars` value is set the characters in `chars` are trimmed instead of whitespace.
	 */
	let trim: (str: string, chars?: string) => string;

	/**
	 * Returns `str` wrapped to `limit` number of characters per line, by default `limit` is `72`. `limit` can also be a function which when passed a string, returns `true` if it is too long for a single line.

	 */
	let wordwrap: (str: string, limit?: number) => string;
	
	/**
	 * Returns a formatted string. The values of keys in the table `vars` can be inserted into the string by using the form `"{key}"` in `str`; numerical keys can also be used.
	 */
	let format: (str: string, vars: {[key: string | number]: string} | string[]) => string;

	/**
	 * Prints the current filename and line number followed by each argument separated by a space.
	 */
	let trace: (...args: any[]) => void;

	/**
	 * Executes the lua code inside `str`.
	 */
	let dostring: (str: string) => void;

	/**
	 * Generates a random UUID string; version 4 as specified in RFC 4122.
	 */
	let uuid: () => string;

	/**
	 * Reloads an already loaded module in place, allowing you to immediately see the effects of code changes without having to restart the program. `modname` should be the same string used when loading the module with require(). In the case of an error the global environment is restored and `nil` plus an error message is returned.
	 */
	let hotswap: (modname: string) => void;

	/**
	 * Performs the same function as `ipairs()` but iterates in reverse; this allows the removal of items from the table during iteration without any items being skipped.
	 */
	let ripairs: (t: any[]) => void;

	/**
	 * Takes color string `str` and returns 4 values, one for each color channel (`r`, `g`, `b` and `a`). By default the returned values are between 0 and 1; the values are multiplied by the number `mul` if it is provided.
	 */
	let color: (str: string, mul?: number) => LuaMultiReturn<[number, number, number, number]>;

}