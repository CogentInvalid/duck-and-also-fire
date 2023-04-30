import { Timer } from "core/Timer";
import { Component } from "./Component";

export class TimerComponent extends Component {

	timer: Timer;

	create(duration: number, callback: (this: any) => any, context?: any) {
		this.timer = new Timer(duration, callback, context);
	}

	update(dt: number) {
		this.timer.update(dt);
		if (this.timer.complete) this.remove();
	}

}