import { Console } from "core/Console";
import { Scene } from "core/Scene";
import { System } from "core/systems/System";

export class FPSLogger extends System {
	console: Console;

	constructor(scene: Scene, console: Console) {
		super(scene);
		this.console = console;
	}

	update(): void {
		let ms = love.timer.getAverageDelta() * 1000;
		this.console.print("ms: " + lume.round(ms, 0.1));
		// this.console.print("kb: " + collectgarbage("count"));

		// let usage = 100 * love.timer.getAverageDelta() / (1 / 60);
		// this.console.print("% of 60FPS: " + lume.round(usage, 0.1));
	}
}