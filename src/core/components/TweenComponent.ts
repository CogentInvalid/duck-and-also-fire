import { Tween, TweenConfig } from "core/Tween";
import { Component } from "./Component";

export class TweenComponent extends Component {

	tween: Tween;

	create(config: TweenConfig) {
		this.tween = new Tween(config);
	}

	update(dt: number) {
		this.tween.update(dt);
		if (this.tween.complete) this.remove();
	}

}