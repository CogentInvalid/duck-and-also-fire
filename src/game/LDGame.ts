import { Game } from "core/Game"
import { Scancode } from "love.keyboard";
import { MenuScene } from "./scenes/MenuScene";
import { GameScene } from "./scenes/GameScene";

export class LDGame extends Game {

	GameScene = GameScene;
	MenuScene = MenuScene;

	constructor(args: any, config: any) {
		super(args, config);
		let sceneModule = this.config.startScene as string;
		let sceneName = sceneModule.split(".").pop();
		let scene = require(sceneModule)[sceneName];
		this.setState(scene);
	}

	keypressed(scancode: Scancode, isrepeat: boolean) {
		if (this.console.inputFocused()) return;
		if (scancode == "escape") love.event.quit();
		// else if (scancode == "tab") this.console.toggle();
		// else if (scancode == "1") this.setState(MenuScene);
		// else if (scancode == "2") this.setState(GameScene);
		else if (this.state) this.state.keypressed(scancode, isrepeat);
	}

}