import { Scene } from "core/Scene";
import { GameObject } from "./GameObject";
import { Image } from "./Image";
import { TextObject } from "./TextObject";
import { TextStyle } from "core/components/renderers/TextComponent";

export class Container extends GameObject {
	type = "Container";

	width = 0;
	height = 0;
	originX = 0;
	originY = 0;

	constructor(scene: Scene) {
		super(scene);
	}

	addObject(): GameObject {
		let obj = this.scene.add(GameObject, this.scene);
		return this.addChild(obj);
	}

	addImage(key: string, frame?: string): Image {
		let img = this.scene.addImage(key, frame);
		return this.addChild(img);
	}

	addText(str: string, style: TextStyle): TextObject {
		let text = this.scene.add(TextObject, this.scene, str, style);
		return this.addChild(text);
	}

	addContainer(): Container {
		let container = this.scene.add(Container, this.scene);
		return this.addChild(container);
	}

	setSize(w: number, h?: number) {
		h ??= w;
		this.width = w;
		this.height = h;
	}

	setOrigin(x: number, y?: number) {
		y ??= x;
		this.originX = x;
		this.originY = y;
	}

	get bounds(): Rect {
		return {
			x: this.transform.x - this.originX * this.width,
			y: this.transform.y - this.originY * this.height,
			width: this.width,
			height: this.height,
		};
	}

}