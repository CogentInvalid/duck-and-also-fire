import { Scene } from "core/Scene";
import { GameObject } from "./GameObject";
import { TextComponent } from "core/components/renderers/TextComponent";

export class PerfMonitor extends GameObject {

	constructor(scene: Scene) {
		super(scene);

		let text = this.addComponent(TextComponent, "0ms", {});
		
		let deltas: number[] = [];
		this.addSequence(async function (script) {
			await script.wait(1);
			while (true) {
				await script.wait(1);
				deltas.push(love.timer.getAverageDelta() * 1000);
				let averageDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
				// print(averageDelta);
				text.str = averageDelta.toFixed(2) + "ms";
				if (deltas.length > 10) deltas.shift();
			}
		}, this);

		this.x = 10;
		this.y = 40;
	}

}