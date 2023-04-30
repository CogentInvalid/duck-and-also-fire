import { Scene } from "core/Scene";
import { PhysicsBody } from "core/components/PhysicsBody";
import { PhysType } from "game/CollisionMap";
import { GridObject } from "./GridObject";
import { Cell } from "game/Grid";

export class Fire extends GridObject {
	type = "Fire";

	body: PhysicsBody;

	centerX = 16;
	centerY = 19;
	timer: number;

	constructor(scene: Scene) {
		super(scene);
		this.image = this.addImage("spritesheet", "fire");
		this.image.setOrigin(16 / this.image.width, 29 / this.image.height);

		this.body = this.addComponent(PhysicsBody, PhysType.OBJECT, 22, 20, -11, -18, true, false);
		this.body.updates = false;
		this.timer = lume.random(0.2, 0.3);
	}

	update(dt: number): void {
		this.timer += dt;
		this.image.image.flipX = this.timer % 0.2 > 0.1 ? -1 : 1;
		super.update(dt);
	}

	getValidNeighbors(): Cell[] {
		let neighbors = this.grid.getNeighbors(this.cell);
		return neighbors.filter(c => {
			if (c.object == null) return true;
			if (c.object.burnable) return true;
			return false;
		});
	}

	spread() {
		if (this.cell && lume.random() < 0.75) {
			let validNeighbors = this.getValidNeighbors();
			let neighbor = lume.randomchoice(validNeighbors);
			if (neighbor) {
				if (neighbor.object) {
					neighbor.object.onBurned();
					neighbor.object.destroy();
				}

				let fire = new Fire(this.scene);
				this.grid.addObject(fire, neighbor.xIndex, neighbor.yIndex);
			}
		}
	}
}