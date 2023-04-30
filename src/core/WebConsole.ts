import { IConsole } from "./IConsole";

export class WebConsole implements IConsole {
	update(dt: number): void {}
	draw() {}
	print(item: any) { }
	clear() {}
	show(on: boolean) {}
	toggle() { }
	inputFocused() {
		return false;
	}
}