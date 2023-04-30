/** @noSelfInFile **/

declare module JSONParser {

    /**
	 * Returns a string representing `value` encoded in JSON.
	 */
	let encode: (value: object) => string;

    /**
	 * Returns a value representing the decoded JSON string.
	 */
	let decode: (json: string) => object;

}