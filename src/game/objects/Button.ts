import { Event } from "core/Event";
import { Scene } from "core/Scene";
import { MouseInput } from "core/components/MouseInput";
import { Image } from "core/objects/Image";

export class Button extends Image {

	scene: Scene;
	onClick: Event<void> = new Event();
	enabled = true;

	constructor(scene: Scene, key: string, frame?: string) {
		super(scene, key, frame);

		let input = this.addComponent(MouseInput, this.image);
		input.onMouseEnter.add(() => this.setColor(0.7, 0.7, 0.7));
		input.onMouseExit.add(() => this.setColor(1, 1, 1));

		scene.onMouseButtonDown.add(this.onClicked, this);
	}

	destroy(): void {
		super.destroy();
		this.scene.onMouseButtonDown.remove(this.onClicked, this);
	}

	onClicked([x, y, button]: [number, number, number]) {
		if (!this.enabled) return;
		if (button !== 1) return;
		let input = this.getComponent(MouseInput);
		if (!input.mouseInBounds()) return;
		this.onClick.emit();
	}

}