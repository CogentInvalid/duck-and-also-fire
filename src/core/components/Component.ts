import { GameObject } from "../objects/GameObject";
import { Scene } from "../Scene";

export class Component {

	obj: GameObject;
	scene: Scene;

	constructor(object: GameObject) {
		this.obj = object;
		this.scene = object.scene;
	}

	// called when adding the component to the object.
	create(...args: any[]) {}
	update?(dt: number): any;
	preDraw?(): any;
	draw?(bounds?: Rect): any;
	remove() {
		this.obj.removeComponent(this);
	};

}