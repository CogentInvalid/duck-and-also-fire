import { Scene } from "core/Scene";
import { Transform } from "core/Transform";
import { System } from "./System";

export class CameraManager extends System {

	x = 0; // center position
	y = 0;
	scale = 1;
	rot = 0;
	bounds?: Rect;

	target: Transform;

	constructor(scene: Scene) {
		super(scene);
	}

	setTarget(target: Transform, teleportToTarget = false) {
		this.target = target;
		if (teleportToTarget) {
			this.x = this.target.x;
			this.y = (this.target.y - 20);
		}
	}

	update(dt: number) {
		this.followTarget(dt);
		this.constrainToBounds();
	}

	followTarget(dt: number): void {
		if (this.target) {
			this.x -= (this.x - this.target.x) * 8 * dt;
			this.y -= (this.y - (this.target.y - 20)) * 8 * dt;
		}
	}

	focusOnViewportCenter() {
		const viewport = this.scene.viewport;
		this.x = viewport.x + viewport.width / 2;
		this.y = viewport.y + viewport.height / 2;
	}

	constrainToBounds(): void {
		if (this.bounds) {
			const viewport = this.scene.viewport;
			this.x += Math.max(this.bounds.x - (this.x - viewport.width / 2), 0);
			this.x -= Math.max((this.x + viewport.width / 2) - (this.bounds.x + this.bounds.width), 0);
			this.y += Math.max(this.bounds.y - (this.y - viewport.height / 2), 0);
			this.y -= Math.max((this.y + viewport.height / 2) - (this.bounds.y + this.bounds.height), 0);
		}
	}

	attach() {
		const viewport = this.scene.viewport;
		let cx = viewport.width / (2 * this.scale);
		let cy = viewport.height / (2 * this.scale);
		love.graphics.push();
		love.graphics.scale(this.scale);
		let x = lume.round(cx - this.x, 1);
		let y = lume.round(cy - this.y, 1);
		love.graphics.translate(x, y);
		love.graphics.rotate(this.rot);
	}

	detach() {
		love.graphics.pop();
	}

	setBounds(x: number | Rect, y?: number, width?: number, height?: number): void {
		if (typeof x == "number") {
			this.bounds = { x: x, y: y, width: width, height: height };
		}
		else {
			this.bounds = x;
		}
	}

	getWorldBounds(): Rect {
		// doesn't factor in camera scale or rotation
		let {width: w, height: h} = this.scene.viewport;
		return {x: this.x - w / 2, y: this.y - h / 2, width: w, height: h};
	}

	getWorldPos(sx: number, sy: number): [number, number] {
		let {width: w, height: h} = this.scene.viewport;
		let transform = love.math.newTransform(this.x - w / 2, this.y - h / 2, this.rot, this.scale, this.scale);
		return transform.transformPoint(sx, sy);
	}

	getScreenPos(wx: number, wy: number): [number, number] {
		let {width: w, height: h} = this.scene.viewport;
		let transform = love.math.newTransform(this.x - w / 2, this.y - h / 2, this.rot, this.scale, this.scale);
		return transform.inverseTransformPoint(wx, wy);
	}

}