import { GameObject } from "core/objects/GameObject";
import { Component } from "./Component";
import { TextUnit } from "core/TextProcessor";
import { Event } from "core/Event";

export class TextScroller extends Component {

	text: TextUnit[];
	running = false;
	string: string = "";
	speed = 50; // characters per second
	charIndex = 0;
	charTimer = 0;

	onTextUpdated: Event<string> = new Event();
	onTextFinished: Event<void> = new Event();

	constructor(obj: GameObject) {
		super(obj);
	}

	start(text: TextUnit[]) {
		this.text = text;
		this.running = true;
	}

	update(dt: number) {
		if (this.running) {
			this.charTimer -= dt;
			while (this.charTimer <= 0 && this.running) {
				let unit = this.text[this.charIndex];
				this.addUnit(unit);

				this.charIndex++;
				if (this.charIndex >= this.text.length) {
					this.running = false;
					this.onTextFinished.emit();
					this.remove();
				}
			}
		}
	}

	addUnit(unit: TextUnit) {
		if (unit.operation) {
			this.performOperation(unit);
		}
		else {
			this.string += unit.character;
			this.onTextUpdated.emit(this.string);
		}
		if (unit.wait) this.charTimer += 1 / this.speed;
	}

	performOperation(unit: TextUnit) {
		if (unit.opName == "w") {
			if (unit.opArg == null) this.charTimer += 1 / this.speed;
			else this.charTimer += parseFloat(unit.opArg);
		}
		if (unit.opName == "s") {
			if (unit.opArg == null) this.speed = 60;
			else this.speed = parseFloat(unit.opArg);
		}
	}

}