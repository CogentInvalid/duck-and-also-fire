import { Component } from "core/components/Component";
import { PhysicsBody } from "core/components/PhysicsBody";
import { Event } from "core/Event";
import { CollisionTable } from "core/systems/CollisionManager";
import { InputSystem } from "core/systems/InputSystem";

export type JumpModifier = { scale: number, onJump?: Event<void> };

export class PlatformerController extends Component {

	speed = 120;
	lowGravity = 1000;
	highGravity = 3000;
	jumpForce = -400;
	grounded = false;
	bumpGravity: number = undefined;
	jumpModifiers: JumpModifier[] = [];
	enabled = true;
	moveDir = 1;

	onJump: Event<void> = new Event();
	onLand: Event<void> = new Event();

	create() {
		const input = this.scene.getSystem(InputSystem);
		input.actions["jump"].onPressed.add(this.jump, this);

		const body = this.obj.getComponent(PhysicsBody);
		body.onCollide.add(c => this.onCollide(c));
	}

	remove(): void {
		const input = this.scene.getSystem(InputSystem);
		input.actions["jump"].onPressed.remove(this.jump, this);
		super.remove();
	}

	update(dt: number) {
		const input = this.scene.getSystem(InputSystem);
		const body = this.obj.getComponent(PhysicsBody);
		let dir = { x: 0, y: 0 };
		if (input && this.enabled) {
			if (input.down("left")) dir.x -= 1;
			if (input.down("right")) dir.x += 1;
		}
		if (dir.x != 0) this.moveDir = dir.x;

		body.vx -= (body.vx - dir.x * this.speed) * 20 * dt;

		const jumping = input.down("jump") && this.enabled;
		if (body.vy < 0) {
			body.gravity = (jumping ? this.lowGravity : this.highGravity);
			if (this.bumpGravity) body.gravity = this.bumpGravity;
		}
		else {
			body.gravity = this.lowGravity;
		}

		this.grounded = false;
	}

	onCollide(col: CollisionTable) {
		if (col.other.solid && col.normal.y == -1) {
			let body = this.obj.getComponent(PhysicsBody);
			this.grounded = true;
			this.bumpGravity = undefined;
			if (body.vy > 200) this.onLand.emit();
		}
	}

	jump() {
		if (this.grounded && this.enabled) {
			const body = this.obj.getComponent(PhysicsBody);
			let modifiers = this.jumpModifiers.map(m => m.scale);
			let jumpMod = (modifiers.length == 0 ? 1 : Math.max(...modifiers));
			body.vy = this.jumpForce * jumpMod;
			this.grounded = false;
			this.onJump.emit();
			for (let mod of this.jumpModifiers) mod.onJump?.emit();
		}
	}

	bump(vx: number, vy: number, gravity: number) {
		if (this.grounded) return;
		const body = this.obj.getComponent(PhysicsBody);
		body.vx += vx;
		body.vy += vy;
		this.bumpGravity = gravity;
	}

	addJumpModifier(mod: JumpModifier) {
		this.jumpModifiers.push(mod);
	}

	removeJumpModifier(mod: JumpModifier) {
		lume.remove(this.jumpModifiers, mod);
	}

}