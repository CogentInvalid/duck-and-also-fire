lume = require("../libs/lume");
jsonParser = require("../libs/json");
inspect = require("../libs/inspect");
bump = require("../libs/bump");
import { LoadUtils } from "core/assets/LoadUtils";
import { Game } from "core/Game";

let game: Game;

love.load = (args) => {
	const config = LoadUtils.loadJson("assets/game-config.json");
	let gameModule = config.gameClass as string;
	let gameName = gameModule.split(".").pop();
	let Game = require(gameModule)[gameName];
	game = new Game(args, config);
};

love.update = (dt) => game.update(dt);
love.draw = () => game.draw();
love.keypressed = (_, scancode, isrepeat) => game.keypressed(scancode, isrepeat);
love.keyreleased = (_, scancode) => game.keyreleased(scancode);
love.mousepressed = (x: number, y: number, button: number) => game.mousepressed(x, y, button);
love.mousereleased = (x: number, y: number, button: number) => game.mousereleased(x, y, button);
love.resize = (w: number, h: number) => game.resize(w, h);