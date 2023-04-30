import { Scene } from "core/Scene";
import { GridObject } from "./GridObject";
import { GameScene } from "game/scenes/GameScene";
import { HealthComponent } from "game/components/HealthComponent";
import { EggRadar } from "./EggRadar";

export class Egg extends GridObject {
	type = "Egg";

	scene: GameScene;
	centerX = 7;
	centerY = 11;
	burnable = true;
	radar: EggRadar;

	constructor(scene: Scene) {
		super(scene);
		this.image = this.addImage("spritesheet", "egg");
		this.image.setOrigin(7 / this.image.width, 17 / this.image.height);

		let radar = this.radar = this.scene.add(EggRadar, this.scene);
		this.scene.addToLayer(radar, "ui");
		radar.egg = this;
	}

	onBurned(): void {
		this.scene.player.getComponent(HealthComponent).loseEmotions(1.5);
	}
}