import { MouseInput } from "core/components/MouseInput";
import { Event } from "core/Event";
import { System } from "./System";

export class MouseInputSystem extends System {

	onMousePressed = new Event<[number, number, number]>();

	update(): void {
		let inputObjects = this.scene.objects.filter(o => o.getComponent(MouseInput));
		inputObjects = this.scene.renderer.getDrawOrder(inputObjects).reverse();
		let mouseInputFound = false;
		for (let obj of inputObjects) {
			let input = obj.getComponent(MouseInput);
			let inBounds = input.mouseInBounds();
			if (inBounds && !mouseInputFound) {
				input.onMouseInBounds();
				mouseInputFound = true;
			}
			else input.onMouseOutOfBounds();
		}
	}

	mousepressed(x: number, y: number, button: number): void {
		this.onMousePressed.emit([x, y, button]);
	}

	mousereleased(x: number, y: number, button: number): void {
		return;
	}

}