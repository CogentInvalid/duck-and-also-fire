export interface IConsole {
	update(dt: number): void;
	draw();
	clear();
	print(item: any);
	show(on: boolean);
	toggle();
	inputFocused(): boolean;
}