import { PhysicsBody } from "core/components/PhysicsBody";
import { PhysType } from "game/CollisionMap";
import { GameObject } from "../../core/objects/GameObject";
import { Scene } from "../../core/Scene";

export class Wall extends GameObject {

	constructor(scene: Scene, x: number, y: number, w: number, h: number) {
		super(scene);

		this.transform.setPosition(x, y);
		this.addComponent(PhysicsBody, PhysType.WALL, w, h, 0, 0, true);
	}

}