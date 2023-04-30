import { GameObject } from "core/objects/GameObject";
import { Component } from "./Component";

type Action<T> = (this: any, arg: T) => any;
type Func<A extends any[], T> = (...args: A) => T;
type UpdateFunc<T> = Func<[number, number], T>;

class UpdateAction {
	public onComplete: Action<void>;
	public update: UpdateFunc<boolean>;
	public timer = 0;
	constructor(update: UpdateFunc<boolean>, onComplete?: (this: any) => any) {
		this.update = update;
		this.onComplete = onComplete;
	}
}

export abstract class ScriptedSequence extends Component {

	executed = false;
	running = false;
	readonly updateActions: UpdateAction[] = [];
	onFinished: Action<void>;
	removeOnComplete = true;
	args: any[];

	create(...args: any[]) {
		this.args = args;
	}

	public async execute() {
		this.executed = true;
		this.running = true;
		await this.script(...this.args).catch(err => {
			this.scene.game.pcallError(debug.traceback(err));
		});
		this.running = false;
		if (this.onFinished) this.onFinished();
		if (this.removeOnComplete) this.remove();
	}

	static run<T extends GameObject>(obj: T, func: (this: T, script: ScriptedSequence) => Promise<any>) {
		let seq = obj.addComponent(class extends ScriptedSequence {
			async script(): Promise<any> {
				await func.call(obj, this);
			}
		}, obj);
		seq.execute();
	}

	abstract script(...args: any): Promise<any>;

	update(dt) {
		if (this.running) this.run(dt);
	}

	public run(dt: number) {
		if (this.updateActions.length > 0) {
			let actions = [...this.updateActions];
			for (let action of actions) {
				let result = action.update(dt, action.timer);
				action.timer += dt;
				if (result) {
					if (action.onComplete) action.onComplete();
					lume.remove(this.updateActions, action);
				}
			}
		}
	}

	// -------
	// General
	// -------

	// Suspends execution of the AsyncScriptedSequence until the inner callback function is called.
	callback<T>(action: Action<Action<T>>) {
		return new Promise<T>(resolve => action(resolve));
	}

	// Adds an update function to the AsyncScriptedSequence which will run every frame
	// until it returns true. If waitUntilFinished is true, execution of the AsyncScriptedSequence
	// will be suspended until the update function returns true.
	async updateAction(update: Func<[number, number], boolean>, waitUntilFinished = true): Promise<UpdateAction> {
		return await this.callback<UpdateAction>(complete => {
			let updateAction = new UpdateAction(update);
			this.updateActions.push(updateAction);
			if (!waitUntilFinished) complete(updateAction);
			else updateAction.onComplete = () => complete(updateAction);
		});
	}

	concurrentUpdateAction(update: UpdateFunc<boolean>): UpdateAction {
		let updateAction = new UpdateAction(update);
		this.updateActions.push(updateAction);
		return updateAction;
	}

	// --------------
	// Basic commands
	// --------------

	async wait(seconds: number): Promise<void> {
		if (seconds <= 0) return;
		await this.updateAction(dt => {
			seconds -= dt;
			return (seconds <= 0);
		});
	}

	// ALlows you to define a series of async functions that will be called
	// one by one as you repeatedly execute this ScriptedSequence.
	// The player's progress will be saved in VariableManager.
	async savedSequence(saveKey: string, things: Func<[void], Promise<void>>[]): Promise<void> {
		let index = lume.clamp(this.getVariable<number>(saveKey) + 1, 0, things.length);
		let action = things[index - 1];
		await action();
		// SetVariable(saveKey, index);
	}

	// ---------
	// Variables
	// ---------

	getVariable<T>(name: string) {
		return null;
	}

	setVariable(name: string, value: any) {
		return;
	}

	// void SetVariable(string name, object value) => GameScripts.VariableManager.SetVariable(name, value);
	// void SetVariable(string map, string name, object value) => GameScripts.VariableManager.SetVariable(map, name, value);
	// static T GetVariable<T>(string name) => GameScripts.VariableManager.GetVariable<T>(name);
	// static T GetVariable<T>(string map, string name) => GameScripts.VariableManager.GetVariable<T>(map, name);
	// static bool GetBool(string name) => GameScripts.VariableManager.GetVariable<bool>(name);
	// void InitVariable(string name, object value) => GameScripts.VariableManager.InitVariable(name, value);
	// void InitVariable(string map, string name, object value) => GameScripts.VariableManager.InitVariable(map, name, value);

}