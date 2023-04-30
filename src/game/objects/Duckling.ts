import { Scene } from "core/Scene";
import { GridObject } from "./GridObject";
import { Component } from "core/components/Component";
import { GameScene } from "game/scenes/GameScene";
import { Easing } from "core/Easing";
import { Acorn } from "./Acorn";

export class Duckling extends GridObject {
	type = "Duckling";

	centerX = 12;
	centerY = 12;
	grabbable = false;
	burnable = true;
	spawnsAcorn: boolean;

	constructor(scene: Scene, spawnsEgg: boolean) {
		super(scene);
		this.spawnsAcorn = spawnsEgg;
		this.image = this.addImage("spritesheet", "duckling");
		this.image.setOrigin(12 / this.image.width, 23 / this.image.height);
		this.addComponent(FlyAwayComponent);
		let dir = lume.random(-1, 1);
		this.image.image.flipX = dir < 0 ? -1 : 1;
	}
}

class FlyAwayComponent extends Component {
	scene: GameScene;
	obj: Duckling;
	update(dt: number) {
		let player = this.scene.player;
		let dx = player.x - this.obj.x;
		let dy = player.y - this.obj.y;
		let dist = Math.sqrt(dx * dx + dy * dy);
		if (dist < 80) {
			let cell = this.obj.cell;
			this.scene.grid.removeObject(cell.xIndex, cell.yIndex);

			if (this.obj.spawnsAcorn) {
				let acorn = this.scene.add(Acorn, this.scene);
				this.scene.grid.addObject(acorn, cell.xIndex, cell.yIndex);
			}

			let dir = lume.random(-1, 1);
			this.obj.image.image.flipX = dir < 0 ? -1 : 1;
			this.obj.addTween({
				targets: this.obj,
				props: {x: this.obj.x + 2000 * dir},
				duration: 3,
				ease: Easing.QuadIn,
			});
			this.obj.addTween({
				targets: this.obj.image,
				props: {y: -3000},
				duration: 3.5,
				ease: Easing.QuadIn,
				onComplete: () => this.obj.destroy(),
			});
			this.obj.removeComponent(this);
		}
	}
}