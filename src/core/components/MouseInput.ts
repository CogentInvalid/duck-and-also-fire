import { Event } from "core/Event";
import { Component } from "./Component";
import { ImageComponent } from "./renderers/ImageComponent";

export class MouseInput extends Component {

	target: ImageComponent;
	mouseOver = false;

	onMouseEnter = new Event<void>();
	onMouseExit = new Event<void>();

	create(target: ImageComponent) {
		this.target = target;
	}

	mouseInBounds() {
		let [x, y] = love.mouse.getPosition();
		return this.target.pointInBounds(x / 2, y / 2);
	}

	onMouseInBounds() {
		if (!this.mouseOver) {
			this.mouseOver = true;
			this.onMouseEnter.emit();
		}
	}

	onMouseOutOfBounds() {
		if (this.mouseOver) {
			this.mouseOver = false;
			this.onMouseExit.emit();
		}
	}

}