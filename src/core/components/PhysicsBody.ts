import { Event } from "core/Event";
import { CollisionManager, CollisionTable } from "core/systems/CollisionManager";
import { Component } from "./Component";

export class PhysicsBody extends Component {

	collisions: CollisionManager;
	onCollisionEnter: Event<CollisionTable> = new Event();
	onCollideAll: Event<BumpCollisionTable<PhysicsBody>[]> = new Event();
	onCollide: Event<CollisionTable> = new Event();
	onCollisionExit: Event<PhysicsBody> = new Event();

	width: number;
	height: number;
	ox = 0;
	oy = 0;
	vx = 0;
	vy = 0;
	gravity = 0;
	updates = true;
	static: boolean;
	solid: boolean;
	addedToWorld = false;
	type: number;

	contacts: PhysicsBody[] = [];

	create(type: number, width: number, height: number, ox?: number, oy?: number, isStatic = false, isSolid = true) {
		this.width = width;
		this.height = height;
		this.type = type;
		if (ox) this.ox = ox;
		if (oy) this.oy = oy;
		this.static = isStatic;
		this.solid = isSolid;
		this.collisions = this.scene.getSystem(CollisionManager);
		if (!this.collisions) error("No CollisionManager system in scene");
	}

	remove() {
		super.remove();
		this.collisions.remove(this);
	}

	update(dt: number) {
		if (!this.addedToWorld) {
			this.collisions.add(this);
			this.addedToWorld = true;
		}
		if (this.updates) {
			this.vy += this.gravity * dt;
			this.x += this.vx * dt;
			this.y += this.vy * dt;
		}
	}

	get x() {
		// todo: use global transform
		return this.obj.transform.x + this.ox;
	}

	get y() {
		// todo: use global transform
		return this.obj.transform.y + this.oy;
	}

	private set x(val: number) {
		this.obj.transform.x = val - this.ox;
	}

	private set y(val: number) {
		this.obj.transform.y = val - this.oy;
	}

	get bounds(): Rect {
		return {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height
		};
	}

	getCenter() {
		return {
			x: this.x + this.width / 2,
			y: this.y + this.height / 2
		};
	}

	moveTo(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	setPosition(x: number, y: number): void {
		this.x = x;
		this.y = y;
		this.collisions.updateObject(this);
	}

	setSize(w: number, h: number): void {
		this.width = w;
		this.height = h;
		this.collisions.updateObject(this);
	}

	setVelocity(vx: number, vy: number): void {
		this.vx = vx;
		this.vy = vy;
	}

	collide(cols: BumpCollisionTable<PhysicsBody>[]) {
		let newContacts = cols.map(c => c.other);

		if (cols.length > 0) this.onCollideAll.emit(cols);
		for (const col of cols) {
			if (!this.contacts.includes(col.other)) {
				this.onCollisionEnter.emit(col);
			}
			this.onCollide.emit(col);
		}

		for (const contact of this.contacts) {
			if (!newContacts.includes(contact)) {
				this.onCollisionExit.emit(contact);
			}
		}

		this.contacts = newContacts;
	}

}