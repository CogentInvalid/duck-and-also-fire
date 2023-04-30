import { Scene } from "core/Scene";
import { GridObject } from "./GridObject";

export class Acorn extends GridObject {
	type = "Acorn";

	centerX = 10;
	centerY = 12;
	burnable = true;

	constructor(scene: Scene) {
		super(scene);
		this.image = this.addImage("spritesheet", "acorn");
		this.image.setOrigin(9 / this.image.width, 20 / this.image.height);
	}
}