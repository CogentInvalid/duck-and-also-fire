import { Scene } from "core/Scene";
import { GameObject } from "./GameObject";
import { TextComponent, TextStyle } from "core/components/renderers/TextComponent";

export class TextObject extends GameObject {

	text: TextComponent;

	constructor(scene: Scene, str: string, style?: TextStyle) {
		super(scene);
		
		this.text = this.addComponent(TextComponent, str, style);

		// let bounds = scene.addImage("whiteSquare");
		// this.addChild(bounds);
		// bounds.setColor(0, 0, 0, 0.1);
		// bounds.setSize(this.text.bounds.width, this.text.bounds.height);
	}

	setColor(r: number, g: number, b: number, a?: number) {
		this.text.setColor(r, g, b, a);
	}

	setString(str: string) {
		this.text.str = str;
	}

	get bounds() {
		return this.text.bounds;
	}

}