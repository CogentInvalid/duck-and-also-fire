import { Scene } from "core/Scene";
import { PhysicsBody } from "core/components/PhysicsBody";
import { PhysType } from "game/CollisionMap";
import { GridObject } from "./GridObject";

export class Rock extends GridObject {
	type = "Rock";

	body: PhysicsBody;

	centerX = 26/2;
	centerY = 28/2;

	constructor(scene: Scene) {
		super(scene);
		this.image = this.addImage("spritesheet", "rock");
		this.image.setOrigin(0.5, 1);
		this.body = this.addComponent(PhysicsBody, PhysType.OBJECT, 24, 20, -12, -18, true, true);
	}

}