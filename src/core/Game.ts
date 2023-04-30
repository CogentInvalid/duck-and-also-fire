import { Scancode } from "love.keyboard";
import { AssetCache } from "./assets/AssetCache";
import { Console } from "./Console";
import { IConsole } from "./IConsole";
import { State } from "./State";
import { WebConsole } from "./WebConsole";

export class Game {

	state: State;
	assets: AssetCache;
	console: IConsole;
	config: any;

	private accum = 0;
	private timestep = 1 / 60;
	private framePrepared = false;

	// errors in promises are undetectable, so catch them here
	private pcallErrorMessage: string;

	constructor(args: any, config: any) {
		this.assets = new AssetCache();
		love.math.setRandomSeed(os.time());
		math.randomseed(os.time());
		this.config = config;
		this.console = (config.webBuild) ? new WebConsole() : new Console(this, args);
		this.accum = this.timestep;
	}

	setState<T extends new (...args: any) => (InstanceType<T> & State)>(Type: T) {
		this.state = new Type(this);
	}

	update(dt: number) {
		if (dt > 0.1) dt = 0.1;
		this.accum += dt;
		while (this.accum >= this.timestep) {
			if (this.state) this.state.update(this.timestep);
			this.accum -= this.timestep;
			this.framePrepared = true;
		}
		this.console.update(dt);
		if (this.pcallErrorMessage) error(this.pcallErrorMessage);
	}

	draw() {
		if (this.framePrepared) {
			love.graphics.clear();
			if (this.state) this.state.draw();
			this.framePrepared = false;
		}
		this.console.draw();
	}

	keypressed(scancode: Scancode, isrepeat: boolean) {
		if (this.console.inputFocused()) return;
		else if (this.state) this.state.keypressed(scancode, isrepeat);
	}

	keyreleased(scancode: Scancode) {
		if (this.state) this.state.keyreleased(scancode);
	}

	mousepressed(x: number, y: number, button: number) {
		if (this.state) this.state.mousepressed(x, y, button);
	}

	mousereleased(x: number, y: number, button: number) {
		if (this.state) this.state.mousereleased(x, y, button);
	}

	resize(w: number, h: number) {
		if (this.state) this.state.resize(w, h);
	}

	toggleFullscreen() {
		let [fullscreen] = love.window.getFullscreen();
		love.window.setFullscreen(!fullscreen);
	}

	pcallError(message: string) {
		this.pcallErrorMessage = message;
	}

}