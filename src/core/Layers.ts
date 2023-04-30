import { GameObject } from "./objects/GameObject";
import { Scene } from "./Scene";
import { CameraManager } from "./systems/CameraManager";

export class Layers<T> {

	scene: Scene;
	layers: Map<T, GameObject> = new Map<T, GameObject>();

	constructor(scene: Scene) {
		this.scene = scene;
	}

	add(name: T, camera: CameraManager) {
		let layer = this.scene.add(GameObject, this.scene);
		if (layer.parent) layer.parent.removeChild(layer);
		layer.type = "Layer";
		layer.name = name.toString();
		this.layers.set(name, layer);
		layer.camera = camera;
	}

	get(name: T): GameObject {
		return this.layers.get(name);
	}
}