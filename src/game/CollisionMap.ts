export enum PhysType {
	NONE = 			0b00000000,
	WALL = 			0b00000001,
	PLAYER = 		0b00000010,
	OBJECT =	 	0b00100000,
}

type ColMap = CollisionMapJIT | CollisionMapWeb;
type CollisionMapJIT = { [key: number]: number };
type CollisionMapWeb = { [key: number]: number[] };

export class CollisionMap {

	isJIT: boolean;
	jit: CollisionMapJIT = {};
	web: CollisionMapWeb = {};
	includesFunc: (this: void, collisionMap: ColMap, type1: number, type2: number) => boolean;
	aggregateFunc: (this: void, collidesWith: number[]) => any;

	constructor(jit: boolean) {
		this.isJIT = jit;

		let path = "libs/collisionFilter" + (jit ? "JIT" : "Web");
		let module = require(path);
		this.includesFunc = module.includes;
		this.aggregateFunc = module.aggregate;

		this.add(PhysType.NONE);
		// this.add(PhysType.WALL, PhysType.NONE);
		this.add(PhysType.PLAYER, PhysType.WALL, PhysType.OBJECT);
	}

	add(type: number, ...collidesWith: number[]) {
		let map = this.isJIT ? this.jit : this.web;
		map[type] = this.aggregateFunc(collidesWith);
	}

	includes(type1: number, type2: number) {
		let map = this.isJIT ? this.jit : this.web;
		return this.includesFunc(map, type1, type2);
	}

}