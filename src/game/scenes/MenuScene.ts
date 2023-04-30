import { GameObject } from "core/objects/GameObject";
import { Game } from "core/Game";
import { Scancode } from "love.keyboard";
import { Scene } from "../../core/Scene";
import { MouseInputSystem } from "core/systems/MouseInputSystem";
import { Image } from "core/objects/Image";
import { Button } from "game/objects/Button";
import { Align } from "core/Align";
import { PixelRenderer } from "core/render/PixelRenderer";
import { LDGame } from "game/LDGame";

export class MenuScene extends Scene {

	game: LDGame;
	bg: Image;
	logo: GameObject;
	debug: string = "";

	constructor(game: Game) {
		super(game);

		this.renderer = new PixelRenderer(this, 2);
		this.addSystem(new MouseInputSystem(this));

		this.bg = this.addImage("splash");

		let startButton = this.add(Button, this, "splash-button");
		Align.center(startButton.transform, startButton.bounds, this.viewport, 0, 60);
		startButton.onClick.add(this.start, this);
	}

	start() {
		this.game.setState(this.game.GameScene);
	}

	update(dt: number) {
		super.update(dt);
	}

	keypressed(scancode: Scancode) {
		super.keypressed(scancode);
	}

	draw() {
		super.draw();
	}

	resize(w: number, h: number): void {
		this.bg.transform.scaleX = w / this.bg.image.width;
		this.bg.transform.scaleY = h / this.bg.image.height;
	}

}