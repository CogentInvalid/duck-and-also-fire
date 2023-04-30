import { Container } from "core/objects/Container";
import { GameScene } from "game/scenes/GameScene";
import { HealthBar } from "./HealthBar";
import { Align } from "core/Align";
import { Player } from "./Player";
import { Button } from "./Button";
import { EmotionsBar } from "./EmotionsBar";
import { TextObject } from "core/objects/TextObject";
import { Egg } from "./Egg";

export class HUD extends Container {

	scene: GameScene;
	healthBar: HealthBar;
	emotionsBar: EmotionsBar;
	skipButton: Button;
	eggCounter: TextObject;

	constructor(scene: GameScene) {
		super(scene);

		let healthBar = this.healthBar = new HealthBar(scene);
		this.addChild(healthBar);
		Align.topLeft(healthBar.transform, healthBar.bounds, scene.viewport, -10, -10);

		let emotionsBar = this.emotionsBar = new EmotionsBar(scene);
		this.addChild(emotionsBar);
		Align.topLeft(emotionsBar.transform, emotionsBar.bounds, scene.viewport, -10, -30);

		let skipButton = this.skipButton = this.scene.add(Button, scene, "skip-button");
		this.addChild(skipButton);
		Align.topRight(skipButton.transform, skipButton.bounds, scene.viewport, -10, -10);
		skipButton.onClick.add(this.skip, this);

		let eggCounter = this.eggCounter = this.addText("0 eggs", {});
		eggCounter.setColor(219 / 255, 224 / 255, 231 / 255);
		Align.bottomLeft(eggCounter.transform, eggCounter.bounds, scene.viewport, -10, -10);
	}

	setEggs(eggs: Egg[]) {
		let count = eggs.length;
		this.eggCounter.setString(`${count} eggs`);
		for (let egg of eggs) {
			egg.onDestroy.add(() => {
				count--;
				this.eggCounter.setString(`${count} eggs`);
			});
		}
	}

	setPlayer(player: Player) {
		this.healthBar.setPlayer(player);
		this.emotionsBar.setPlayer(player);
	}

	skip(): void {
		this.scene.gameManager.skip();
	}

}