import { PhysicsBody } from "core/components/PhysicsBody";
import { UpdateComponent } from "core/components/UpdateComponent";
import { Scene } from "core/Scene";
import { CollisionMap } from "game/CollisionMap";
import { System } from "./System";

export type CollisionTable = BumpCollisionTable<PhysicsBody>;

export class CollisionManager extends System {

	world: BumpWorld;
	bodies: PhysicsBody[] = [];
	collisionMap: CollisionMap;
	debugCollisionsEnabled = false;
	debugHitboxesEnabled = false;

	constructor(scene: Scene, collisionMap: CollisionMap) {
		super(scene);
		this.world = bump.newWorld(72);
		this.collisionMap = collisionMap;
	}

	add(body: PhysicsBody) {
		this.bodies.push(body);
		this.world.add(body, body.x, body.y, body.width, body.height);
	}

	has(body: PhysicsBody): boolean {
		return this.world.hasItem(body);
	}

	postUpdate(dt: number) {
		if (this.debugHitboxesEnabled) this.debugHitboxes();
		for (let body of this.bodies) {
			if (body.updates) {
				if (!body.static) {
					let [newX, newY, collisions, numCollisions] = this.world.move(body, body.x, body.y, (...a) => this.defaultFilter(...a));
					body.setPosition(newX, newY);
					if (this.debugCollisionsEnabled) collisions.forEach(c => this.debugCollision(c));
					body.collide(collisions);
					for (const col of collisions) {
						if (col.other.solid && Math.sign(col.normal.x) == -Math.sign(body.vx)) body.vx = 0;
						if (col.other.solid && Math.sign(col.normal.y) == -Math.sign(body.vy)) body.vy = 0;
					}
				}
				else {
					this.world.update(body, body.x, body.y);
				}
			}
		}
	}

	updateObject(body: PhysicsBody, x?: number, y?: number): void {
		this.world.update(body, x ?? body.x, y ?? body.y, body.width, body.height);
	}

	remove(body: PhysicsBody) {
		lume.remove(this.bodies, body);
		this.world.remove(body);
	}

	debugCollision(col: BumpCollisionTable<any>): void {
		const rects = [
			{ rect: col.itemRect, color: { r: 1, g: 0.2, b: 0.2 } },
			{ rect: col.otherRect, color: { r: 0.2, g: 1, b: 0.2 } },
		];

		for (const { rect, color } of rects) {
			let debug = this.scene.addImage("whiteSquare");
			debug.transform.setPosition(rect.x, rect.y);
			debug.setSize(rect.w, rect.h);
			debug.setOrigin(0, 0);
			debug.setColor(color.r, color.g, color.b, 0.5);
			let timer = debug.image.alpha;
			debug.addComponent(UpdateComponent, (dt) => {
				timer -= dt;
				debug.image.alpha = timer;
				if (timer <= 0) debug.destroy();
			});
		}
	}

	debugHitboxes(): void {
		for (const body of this.bodies) {
			if (!(body.static && body.solid)) {
				let debug = this.scene.addImage("whiteSquare");
				debug.transform.setPosition(body.x, body.y);
				if (body.obj.type == "Bullet") print(body.x);
				debug.setSize(body.width, body.height);
				debug.setOrigin(0, 0);
				debug.setColor(0.2, 1, 0.2, 0.5);
				let timer = debug.image.alpha;
				debug.addComponent(UpdateComponent, (dt) => {
					timer -= dt;
					debug.image.alpha = timer;
					if (timer <= 0) debug.destroy();
				});
			}
		}
	}

	defaultFilter(item: PhysicsBody, other: PhysicsBody): CollisionType {
		if (this.collisionMap.includes(item.type, other.type)) return (other.solid) ? "slide" : "cross";
	}

}