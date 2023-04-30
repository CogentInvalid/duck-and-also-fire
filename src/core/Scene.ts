import { State } from "./State";
import { GameObject } from "./objects/GameObject";
import { Renderer } from "./render/Renderer";
import { DefaultRenderer } from "./render/DefaultRenderer";
import { Image } from "./objects/Image";
import { Game } from "./Game";
import { System } from "./systems/System";
import { Scancode } from "love.keyboard";
import { Event } from "./Event";

export class Scene extends State {

	objects: GameObject[] = [];
	systems: System[] = [];
	renderer: Renderer;
	get viewport(): Rect { return this.renderer.getViewport(); }
	paused = false;

	onMouseButtonDown: Event<[number, number, number]> = new Event();
	
	// stores objects created by Scene.add during a single call to Scene.add.
	// ensures that if additional objects are created within an object's constructor, they'll be added to the scene in order of creation
	// as opposed to child objects getting added first.
	addQueue: GameObject[] = [];
	addIndex = 0;

	constructor(game: Game) {
		super(game);
		if (this.renderer == null) this.renderer = new DefaultRenderer(this);
	}

	update(dt: number) {
		if (!this.paused) {
			for (let system of this.systems) system.update(dt);
			for (let i = this.objects.length - 1; i >= 0; i--) {
				this.objects[i].update(dt);
			}
			for (let system of this.systems) system.postUpdate(dt);
			for (let i = this.objects.length - 1; i >= 0; i--) {
				this.objects[i].finishPendingDestroy();
			}
			if (this.renderer.update) this.renderer.update(dt);
		}
	}

	draw() {
		this.renderer.draw();
	}

	add<T extends new (...args: any) => (InstanceType<T> & GameObject)>(Type: T, ...params: ConstructorParameters<T>): InstanceType<T> {
		let addIndex = this.addIndex;
		this.addIndex++;

		const obj = new Type(...params);
		this.addQueue[addIndex] = obj;

		if (addIndex == 0) {
			for (const obj of this.addQueue) this.addExisting(obj);
			this.addQueue = [];
			this.addIndex = 0;
		}

		return obj;
	}

	addExisting<T extends GameObject>(obj: T): T {
		obj.scene = this;
		this.objects.push(obj);
		obj.onDestroy.add(this.onDestroyObject, this);
		return obj;
	}

	createObject(): GameObject {
		return this.add(GameObject, this);
	}

	private onDestroyObject(obj: GameObject) {
		lume.remove(this.objects, obj);
	}

	findObjectOfType<T extends new (...args: any) => (InstanceType<T> & GameObject)>(Type: T): InstanceType<T> {
		return this.objects.find(c => c instanceof Type) as InstanceType<T>;
	}

	findObjectsOfType<T extends new (...args: any) => (InstanceType<T> & GameObject)>(Type: T): InstanceType<T>[] {
		return this.objects.filter(c => c instanceof Type) as InstanceType<T>[];
	}

	addImage(key?: string, frame?: string): Image {
		if (key == null) key = "whiteSquare";
		return this.add(Image, this, key, frame);
	}

	addSystem<T extends System>(sys: T) {
		this.systems.push(sys);
		return sys;
	}

	getSystem<T extends new (...args: any) => (InstanceType<T> & System)>(Type: T): InstanceType<T> {
		return this.systems.find(c => c instanceof Type) as InstanceType<T>;
	}

	keypressed(scancode: Scancode): void {
		for (let system of this.systems) system.keypressed(scancode);
		super.keypressed(scancode);
	}

	keyreleased(scancode: Scancode): void {
		for (let system of this.systems) system.keyreleased(scancode);
		super.keyreleased(scancode);
	}

	mousepressed(x: number, y: number, button: number): void {
		for (let system of this.systems) system.mousepressed(x, y, button);
		super.mousepressed(x, y, button);
		this.onMouseButtonDown.emit([x, y, button]);
	}

	mousereleased(x: number, y: number, button: number): void {
		for (let system of this.systems) system.mousereleased(x, y, button);
		super.mousereleased(x, y, button);
	}

	getHierarchy(obj?: GameObject, depth: number = 0): ObjectHierarchy {
		if (!obj) {
			let topLevelObjects = this.objects.filter(o => o.parent == null);
			let line = topLevelObjects.map(o => this.getHierarchy(o).line).join("");
			return {line: line, duplicates: 0};
		}

		let line = ("-> ".repeat(depth) + obj.toString()) + "\n";

		let childHierarchies: ObjectHierarchy[] = [];
		let lastChildHierarchy: ObjectHierarchy;
		for (const child of obj.children) {
			let childHierarchy = this.getHierarchy(child, depth + 1);
			if (childHierarchy.line == lastChildHierarchy?.line) {
				lastChildHierarchy.duplicates++;
			}
			else {
				childHierarchies.push(childHierarchy);
				lastChildHierarchy = childHierarchy;
			}
		}

		for (const childHierarchy of childHierarchies) {
			if (childHierarchy.duplicates > 0) {
				let lines = childHierarchy.line.split("\n");
				let firstLine = lines[0];
				let remainingLines = lines.slice(1).join("\n");
				firstLine += ` (${childHierarchy.duplicates + 1})`;
				childHierarchy.line = firstLine + "\n" + remainingLines;
			}

			line += childHierarchy.line;
		}
		return {line: line, duplicates: 0};
	}

	printHierarchy(obj?: GameObject, depth: number = 0) {
		print(this.getHierarchy(obj, depth).line);
	}

}

type ObjectHierarchy = {
	line: string;
	duplicates: number;
}