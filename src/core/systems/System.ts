import { Scene } from "core/Scene";
import { Scancode } from "love.keyboard";

export class System {

	scene: Scene;

	constructor(scene: Scene) {
		this.scene = scene;
	}

	update(dt: number): void { }
	postUpdate(dt: number): void { }
	keypressed(key: Scancode): void { }
	keyreleased(key: Scancode): void { }
	mousepressed(x: number, y: number, button: number): void { }
	mousereleased(x: number, y: number, button: number): void { }

}