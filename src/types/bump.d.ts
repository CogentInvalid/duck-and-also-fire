/** @noSelfInFile **/

declare module Bump {
	/** default cellSize is 64 */
	let newWorld: (cellSize?: number) => BumpWorld;
}

type CollisionType = "touch" | "cross" | "slide" | "bounce" | null;
type Filter = (item: any, other: any) => CollisionType;
type SimpleFilter = (item: any) => boolean;
declare interface BumpCollisionTable<T> {
	/** the item being moved / checked */
	item: T;
	/** an item colliding with the item being moved */
	other: T;
	/** the result of `filter(other)`. It's usually "touch", "cross", "slide" or "bounce" */
	type: CollisionType;
	/** boolean. True if item "was overlapping" other when the collision started. False if it didn't but "tunneled" through other */
	overlaps: boolean;
	/** Number between 0 and 1. How far along the movement to the goal did the collision occur> */
	ti: number;
	/** Vector({x=number,y=number}). The difference between the original coordinates and the actual ones. */
	move: Vector2;
	/** Vector({x=number,y=number}). The collision normal; usually -1,0 or 1 in `x` and `y` */
	normal: Vector2;
	/** Vector({x=number,y=number}). The coordinates where item started touching other */
	touch: Vector2;
	/** The rectangle item occupied when the touch happened({x = N, y = N, w = N, h = N}) */
	itemRect: {x: number, y: number, w: number, h: number};
	/** The rectangle other occupied when the touch happened({x = N, y = N, w = N, h = N}) */
	otherRect: {x: number, y: number, w: number, h: number};
}

declare class BumpWorld {
	/** Adds an item to the world. */
	add: (item: any, x: number, y: number, w: number, h: number) => void;
	remove: (item: any) => void;
	update: (item: any, x: number, y: number, w?: number, h?: number) => void;
	move: (item: any, goalX: number, goalY: number, filter?: Filter) => LuaMultiReturn<[number, number, BumpCollisionTable<any>[], number]>;
	hasItem: (item: any) => boolean;
	check: (item: any, goalX: number, goalY: number, filter?: Filter) => LuaMultiReturn<[number, number, BumpCollisionTable<any>[], number]>;
	queryPoint: (x: number, y: number, filter: SimpleFilter) => LuaMultiReturn<[any[], number]>;
	queryRect: (x: number, y: number, w: number, h: number, filter: SimpleFilter) => LuaMultiReturn<[any[], number]>;
	querySegment: (x1: number, y1: number, x2: number, y2: number, filter: SimpleFilter) => LuaMultiReturn<[any[], number]>;
}