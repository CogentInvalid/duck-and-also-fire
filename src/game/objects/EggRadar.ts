import { Image } from "core/objects/Image";
import { GameScene } from "game/scenes/GameScene";
import { Egg } from "./Egg";
import { PlayerStats } from "game/components/PlayerStats";

export class EggRadar extends Image {

	scene: GameScene;
	egg: Egg;

	constructor(scene: GameScene) {
		super(scene, "spritesheet", "egg");

		this.setColor(0, 1, 0, 0.4);
		this.addTween({
			targets: this,
			props: { alpha: 0.6 },
			duration: 0.04,
			yoyo: true,
			repeat: -1,
		});
		this.image.setOrigin(7 / this.image.width, 17 / this.image.height);
	}

	update(dt: number): void {
		super.update(dt);
		let hasRadar = this.scene.player.getComponent(PlayerStats).hasRadar;
		if (this.egg && hasRadar) {
			let egg = this.egg;

			let viewport = this.scene.renderer.defaultCamera?.getWorldBounds() ?? this.scene.viewport;
			let show = false;
			if (egg.x < viewport.x) show = true;
			if (egg.x > viewport.x + viewport.width) show = true;
			if (egg.y < viewport.y) show = true;
			if (egg.y > viewport.y + viewport.height) show = true;

			if (show && egg.cell) {
				let [screenX, screenY] = this.scene.renderer.defaultCamera.getScreenPos(egg.x, egg.y);

				let cx = this.scene.viewport.x + this.scene.viewport.width / 2;
				let cy = this.scene.viewport.y + this.scene.viewport.height / 2;
				// if distance from center is greater than half the viewport, clamp it to the edge
				let dx = screenX - cx;
				let dy = screenY - cy;
				let dist = Math.sqrt(dx * dx + dy * dy);
				let threshold = this.scene.viewport.height / 2;
				if (dist > threshold) {
					screenX = cx + dx / dist * threshold;
					screenY = cy + dy / dist * threshold;
					this.setPosition(screenX, screenY);
				}
			}
			else {
				this.setPosition(-999, -999);
			}
			
		}
		else {
			this.setPosition(-999, -999);
		}
	}

}