import { Component } from "core/components/Component";
import { MouseInputGrid, MouseInputMode } from "game/MouseInputGrid";
import { GameScene } from "game/scenes/GameScene";

export class PlayerMouseInput extends Component {

	scene: GameScene;
	mouseInputMode: MouseInputMode;
	enabled = true;

	create(): void {
		this.mouseInputMode = new MouseInputGrid(this.scene);
		this.scene.onMouseButtonDown.add(this.onMouseButtonDown, this);
	}

	update(dt: number) {
		this.mouseInputMode.update(dt);
	}

	remove(): void {
		this.scene.onMouseButtonDown.remove(this.onMouseButtonDown, this)
	}

	onMouseButtonDown([x, y, button]: [number, number, number]) {
		if (!this.enabled) return;
		this.mouseInputMode.onClick(x, y, button);
	}

}