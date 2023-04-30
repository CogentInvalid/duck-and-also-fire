import { Component } from "../components/Component";
import { Transform } from "../Transform";
import { Event } from "../Event";
import { Scene } from "../Scene";
import { TimerComponent } from "core/components/TimerComponent";
import { TweenConfig } from "core/Tween";
import { TweenComponent } from "core/components/TweenComponent";
import { ScriptedSequence } from "core/components/ScriptedSequence";
import { CameraManager } from "core/systems/CameraManager";
import { Shader } from "love.graphics";

type ComponentType = new (...args: ConstructorParameters<typeof Component>) => Component;
type ComponentInstance<T extends ComponentType> = Component & InstanceType<T>;

export class GameObject {
	type = "GameObject";
	name = "";
	scene: Scene;
	camera?: CameraManager;
	transform: Transform;
	components: Component[];
	parent: GameObject;
	children: GameObject[];
	shader?: Shader;
	propagatesShader = false;
	inheritsShader = true;

	get currentShader() {
		if (!this.inheritsShader) return this.shader;
		// this isn't great but deal with it later, i guess if inheritsShader is on,
		// we need to propagate the parent's propagate value as well, recursively
		let propagatesShader = this.parent?.parent?.propagatesShader || this.parent?.propagatesShader;
		if (propagatesShader) return this.parent.currentShader ?? this.shader;
		return this.shader;
	}

	private pendingDestroy = false;
	onDestroy = new Event<GameObject>();
	onPendingDestroy = new Event<GameObject>();

	constructor(scene: Scene) {
		this.scene = scene;
		this.components = [];
		this.children = [];
		this.transform = new Transform();
	}

	destroy() {
		this.pendingDestroy = true;
		this.onPendingDestroy.emit(this);
	}

	finishPendingDestroy() {
		if (this.pendingDestroy) {
			this.parent?.removeChild(this);
			for (let component of [...this.components]) {
				component?.remove();
			}
			for (let child of [...this.children]) {
				child.destroy();
			}
			this.onDestroy.emit(this);
		}
	}

	update(dt: number) {
		for (let component of [...this.components]) {
			if (component.update) component.update(dt);
		}
	}

	draw(bounds?: Rect) {
		for (let component of this.components) {
			if (component.preDraw) component.preDraw();
		}

		if (this.currentShader) love.graphics.setShader(this.currentShader);
		else love.graphics.setShader();
		
		for (let component of this.components) {
			if (component.draw) component.draw(bounds);
		}
	}

	private addComponentExisting<T extends Component>(component: T, ...params: Parameters<T["create"]>): T {
		this.components.push(component);
		component.create(...params);
		return component;
	}

	addComponent<T extends new (...args: ConstructorParameters<typeof Component>) => ComponentInstance<T>>(Type: T, ...params: Parameters<ComponentInstance<T>["create"]>): InstanceType<T> {
		return this.addComponentExisting(new Type(this), ...params);
	}

	getComponent<T extends new (...args: any) => (InstanceType<T> & Component)>(Type: T): InstanceType<T> {
		return this.components.find(c => c instanceof Type) as InstanceType<T>;
	}

	getComponents<T extends new (...args: any) => (InstanceType<T> & Component)>(Type: T): InstanceType<T>[] {
		return this.components.filter(c => c instanceof Type) as InstanceType<T>[];
	}

	removeComponent(component: Component) {
		lume.remove(this.components, component);
	}

	addChild<T extends GameObject>(child: T): T {
		if (child.parent) child.parent.removeChild(child);
		this.children.push(child);
		child.parent = this;
		this.transform.addChild(child.transform);
		return child;
	}

	removeChild(child: GameObject) {
		lume.remove(this.children, child);
		child.parent = null;
		this.transform.removeChild(child.transform);
	}

	setPosition(x: number, y: number) {
		this.transform.setPosition(x, y);
	}

	get x(): number { return this.transform.x };
	get y(): number { return this.transform.y };
	set x(val: number) { this.transform.x = val; };
	set y(val: number) { this.transform.y = val; };
	get angle(): number { return this.transform.angle };
	set angle(val: number) { this.transform.angle = val; };

	addTimer(duration: number, callback: (this: any) => any, context?: any) {
		this.addComponent(TimerComponent, duration, callback, context);
	}

	addTween(config: TweenConfig) {
		return this.addComponent(TweenComponent, config);
	}

	addSequence<Context, Args>(func: (this: Context, script: ScriptedSequence, ...args: Args[]) => Promise<any>, context: Context, ...args: Args[]) {
		let seq = this.addComponent(class extends ScriptedSequence {
			async script(...args: Args[]): Promise<any> {
				await func.call(context, this, ...args);
			}
		}, ...args);
		seq.execute();
		return seq;
	}

	setShader(shader: Shader, propagatesShader = this.propagatesShader) {
		this.shader = shader;
		this.propagatesShader = propagatesShader;
	}

	toString(): string {
		return this.type + ":" + this.name;
	}

}