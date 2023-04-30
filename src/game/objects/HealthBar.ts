import { Container } from "core/objects/Container";
import { GameScene } from "game/scenes/GameScene";
import { Player } from "./Player";
import { Image } from "core/objects/Image";

export class HealthBar extends Container {

	fill: Image;

	constructor(scene: GameScene) {
		super(scene);
		
		let text = this.addText("DUCK HP", {});
		text.setColor(219 / 255, 224 / 255, 231 / 255);

		let fill = this.fill = this.addImage("health-fill");
		let bar = this.addImage("health-bar");
		this.setSize(bar.bounds.width, bar.bounds.height);

		bar.x += 110;
		bar.y += 1;
		fill.x += 110;
		fill.y += 1;
	}

	setPlayer(player: Player) {
		player.health.onHPChanged.add(this.onUpdateHP, this);
	}

	onUpdateHP(hp: number) {
		this.fill.transform.scaleX = hp;
	}

}