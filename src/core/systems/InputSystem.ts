import { Event } from "core/Event";
import { Scene } from "core/Scene";
import { Scancode } from "love.keyboard";
import { System } from "./System";

type InputBind = { actions: string[] };

type InputAction = {
	binds: string[];
	pressed: boolean;
	down: boolean;
	released: boolean;
	onPressed: Event<void>;
};

export class InputSystem extends System {

	binds: { [key in Scancode]?: InputBind } = {};
	actions: { [key: string]: InputAction } = {};

	constructor(scene: Scene, configPath?: string) {
		super(scene);

		if (configPath) {
			let config = this.scene.assets.loadJson(configPath);
			for (const bind of config) this.setBind(bind.key, bind.action);
		}
	}

	postUpdate() {
		for (let actionName in this.actions) {
			const action = this.actions[actionName];
			action.pressed = false;
			action.released = false;
		}
	}

	keypressed(key: Scancode) {
		if (!this.binds[key]) return;
		let actionNames = this.binds[key].actions;
		for (let actionName of actionNames) {
			let action = this.actions[actionName];
			if (!action.down) {
				action.pressed = true;
				action.onPressed.emit();
			}
			action.down = true;
		}
	}

	keyreleased(key: Scancode) {
		if (!this.binds[key]) return;
		let actionNames = this.binds[key].actions;
		for (let actionName of actionNames) {
			let action = this.actions[actionName];
			if (action.down) action.released = true;
			action.down = false;
		}
	}

	setBind(key: Scancode, action: string) {
		if (!this.binds[key]) this.binds[key] = this.newBind();
		this.binds[key].actions.push(action);

		if (!this.actions[action]) this.actions[action] = this.newAction();
		if (love.keyboard.isScancodeDown(key)) this.actions[action].down = true;
		this.actions[action].binds.push(key);
	}

	newBind(): InputBind {
		return { actions: [] };
	}

	newAction(): InputAction {
		return {
			binds: [],
			pressed: false,
			down: false,
			released: false,
			onPressed: new Event(),
		};
	}

	down(action: string) {
		return this.actions[action].down;
	}

	pressed(action: string) {
		return this.actions[action].pressed;
	}

	released(action: string) {
		return this.actions[action].released;
	}

}