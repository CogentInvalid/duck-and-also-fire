import { Event } from "./Event";
import { Game } from "./Game";
import { IConsole } from "./IConsole";

export class Console implements IConsole {

	game: Game;
	slab: Slab;
	private shown = false;
	text = "";
	lines: string[] = [];
	private onLayout = new Event<void>();
	private consoleEnvironment: any;

	constructor(game: Game, args: any) {
		this.game = game;
		this.slab = require("../libs/slab") as Slab;
		this.slab.Initialize(args);
		this.consoleEnvironment = {
			game: this.game,
			math: math,
			lume: lume,
		};
		this.print("Console started!");
	}

	update(dt: number): void {
		if (!this.shown) return;
		this.slab.Update(dt);
		this.layout(this.slab);
	}

	private layout(slab: Slab) {
		slab.BeginWindow("Console", {Title: "Console", X: 10, Y: 10, W: 400, H: 300, AutoSizeWindow: false, NoSavedSettings: true});
		let [w, h] = slab.GetWindowActiveSize();
		let textBoxSize = 18;

		slab.BeginListBox('DrawListBox_Basic', {Clear: false, W: w, H: h - textBoxSize - 4});
		for (let i = 0; i < this.lines.length; i++) {
			slab.BeginListBoxItem('DrawListBox_Basic_Item_' + i);
			slab.Textf(this.lines[i], {W: w - 4});
			slab.EndListBoxItem();
		}
		slab.EndListBox();
		if (slab.Input("console-input", {W: w, H: textBoxSize, ReturnOnText: false})) {
			this.processCommand(slab.GetInputText());
		}
		this.onLayout.emit();

		slab.EndWindow();
	}

	private processCommand(command: string) {
		this.print("> " + command);
		let printResult = true;
		let [func, err] = loadstring("return " + command, "consoleCommand", undefined, this.consoleEnvironment);
		if (!func) {
			[func, err] = loadstring(command, "consoleCommand", undefined, this.consoleEnvironment);
			printResult = false;
		}

		if (!func) this.print(err);
		else {
			let [success, result] = pcall(func);
			if (printResult) this.print(result);
		}
	}

	draw() {
		if (!this.shown) return;
		this.slab.Draw();
	}

	clear() {
		this.lines = [];
	}

	print(item: any) {
		let line = (typeof item == "string" ? item : this.inspect(item)) + "\n";
		this.lines.push(line);
		if (this.lines.length > 10) this.lines.shift();
	}

	private inspect(item: any) {
		let process = (item: any, path: string[]) => {
			if (path[path.length - 1] == inspect.METATABLE) return null;
			return item;
		};

		return inspect(item, {depth: 5, process: process});
	}

	show(on: boolean) {
		this.shown = on;
		// if (this.shown) this.onLayout.once(() => this.slab.SetInputFocus("console-input"));
	}

	toggle() {
		this.show(!this.shown);
	}

	inputFocused() {
		return this.slab.IsAnyInputFocused();
	}

}