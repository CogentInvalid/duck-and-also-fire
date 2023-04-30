import { Component } from "core/components/Component";
import { Grid } from "game/Grid";
import { GridObject } from "game/objects/GridObject";
import { PlayerStats } from "./PlayerStats";
import { GameObject } from "core/objects/GameObject";

export class Inventory extends Component {

	get heldObject(): boolean {
		return this.objects.length > 0;
	}
	objects: GridObject[] = [];

	create(): void {
		
	}

	carryObject(grid: Grid, x: number, y: number, obj: GridObject) {
		let stats = this.obj.getComponent(PlayerStats);
		if (this.objects.length >= stats.stacks || !obj.grabbable) return;
		this.obj.addChild(obj);
		this.objects.push(obj);
		grid.removeObject(x, y);
		this.layoutObjects();
		obj.onPendingDestroy.add(this.onCarryObjectDestroyed, this);
		let sfx = this.scene.assets.sound("pickup");
		sfx.stop();
		sfx.play();
	}

	layoutObjects() {
		for (let i = 0; i < this.objects.length; i++) {
			this.objects[i].setPosition(10, -36 - i * 16);
		}
	}

	dropObject(grid: Grid, x: number, y: number) {
		if (!this.heldObject) return;
		let obj = this.objects.pop();
		grid.addObject(obj, x, y);
		obj.onPendingDestroy.remove(this.onCarryObjectDestroyed, this);
		let sfx = this.scene.assets.sound("putdown");
		sfx.stop();
		sfx.play();
	}

	onCarryObjectDestroyed(obj: GameObject) {
		lume.remove(this.objects, obj);
		this.layoutObjects();
	}

}