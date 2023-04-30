import { Scancode } from "love.keyboard";
import { AssetCache } from "./assets/AssetCache";
import { Game } from "./Game";

export abstract class State {
	game: Game;
	assets: AssetCache;

	constructor(game: Game) {
        this.game = game;
		this.assets = game.assets;
    }

	update(dt: number) { }
	draw() { }
	keypressed(scancode: Scancode, isrepeat?: boolean) { }
	keyreleased(scancode: Scancode) { }
	mousepressed(x: number, y: number, button: number) { }
	mousereleased(x: number, y: number, button: number) { }
	resize(w: number, h: number) { }
}