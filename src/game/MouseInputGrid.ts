import { Image } from "core/objects/Image";
import { GameScene } from "./scenes/GameScene";
import { Cell } from "./Grid";
import { MouseInput } from "core/components/MouseInput";

export class MouseInputMode {

	scene: GameScene;

	constructor(scene: GameScene) {
		this.scene = scene;
	}

	update(dt: number) {
		return;
	}

	onClick(x: number, y: number, button: number) {
		return;
	}

}

export class MouseInputGrid extends MouseInputMode {

	highlight: Image;

	constructor(scene: GameScene) {
		super(scene);

		this.highlight = scene.addImage("spritesheet", "highlight");
		this.highlight.setOrigin(0.5, -1);
		scene.addToLayer(this.highlight, "default");
	}

	update(dt: number) {
		let cell = this.getSelectedCell();
		if (!cell) return;
		let center = this.scene.grid.getCellCenter(cell.xIndex, cell.yIndex);
		let dy = this.highlight.image.originY - 0.5;
		this.highlight.setPosition(center.x, center.y + dy * this.highlight.image.height);
	}

	getSelectedCell(): Cell | null {
		let [mx, my] = love.mouse.getPosition();
		let [x, y] = this.scene.renderer.defaultCamera.getWorldPos(mx / 2, my / 2);
		let dx = x - this.scene.player.transform.x;
		let dy = y - this.scene.player.transform.y;
		let dist = Math.sqrt(dx * dx + dy * dy);
		let maxDist = 48;
		if (dist > maxDist) {
			let angle = Math.atan2(dy, dx);
			x = this.scene.player.transform.x + Math.cos(angle) * maxDist;
			y = this.scene.player.transform.y + Math.sin(angle) * maxDist;
		}
		return this.scene.grid.getNearestCell(x, y);
	}

	onClick(x: number, y: number, button: number) {
		if (!this.scene.inputObj.getComponent(MouseInput).mouseOver) return;
		let cell = this.getSelectedCell();
		if (!cell) return;
		if (cell.object) {
			this.scene.player.activateObject(this.scene.grid, cell.xIndex, cell.yIndex, cell.object);
		} else {
			this.scene.player.inventory.dropObject(this.scene.grid, cell.xIndex, cell.yIndex);
		}
	}

}