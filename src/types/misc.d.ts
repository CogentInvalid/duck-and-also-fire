declare var lume: typeof Lume;
declare var jsonParser: typeof JSONParser;
type InspectOptions = {
	depth?: number,
	indent?: string,
	newline?: string,
	process?: (this: void, item: any, path: string[]) => any,
}
declare let inspect: ((arg: any, options?: InspectOptions) => string) & {METATABLE: string};
declare let bump: typeof Bump;

declare interface Point {x: number, y: number}
declare interface Vector2 {x: number, y: number}
declare interface Rect {x: number, y: number, width: number, height: number}