import { Font } from "love.graphics";
import { Component } from "../Component";

export type TextStyle = {
	font?: Font;
	align?: "left" | "center" | "right";
	wrapWidth?: number;
}

export class TextComponent extends Component {

	static defaultStyle: TextStyle = {
		font: null,
		align: "left",
		wrapWidth: 99999999,
	}

	str: string;
	font?: Font;
	style: TextStyle;
	color = { r: 1, g: 1, b: 1, a: 1 };

	debugBounds = false;

	create(str: string, style?: TextStyle) {
		this.str = str;

		this.font = style.font ?? this.scene.assets.font("default");
		this.style = {
			wrapWidth: style.wrapWidth ?? TextComponent.defaultStyle.wrapWidth,
			align: style.align ?? TextComponent.defaultStyle.align,
		};
	}

	setColor(r: number, g: number, b: number, a?: number) {
		this.color.r = r;
		this.color.g = g;
		this.color.b = b;
		if (a) this.color.a = a;
	}

	get alpha() {return this.color.a;}
	set alpha(val: number) {
		this.color.a = val;
	}

	draw(bounds?: Rect) {
		love.graphics.setColor(this.color.r, this.color.g, this.color.b, this.color.a);
		love.graphics.setFont(this.font);
		love.graphics.printf(this.str, 0, 0, this.style.wrapWidth, this.style.align);
	}

	get bounds(): Rect {
		let width = (this.style.wrapWidth > 0) ? this.style.wrapWidth : null;
		let [w, tbl] = this.font.getWrap(this.str, width);
		let height = tbl.length * this.font.getHeight();
		return { x: 0, y: 0, width: width, height: height };
	}

}