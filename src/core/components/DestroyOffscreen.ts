import { CameraManager } from "core/systems/CameraManager";
import { Component } from "./Component";

export class DestroyOffscreen extends Component {

	left: boolean;
	right: boolean;
	top: boolean;
	bottom: boolean;
	offset: number;

	create(left: boolean, right: boolean, top: boolean, bottom: boolean, offset = 0) {
		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
		this.offset = offset;
	}

	update() {
		let cam = this.scene.getSystem(CameraManager);
		let viewport = cam?.getWorldBounds() ?? this.scene.viewport;
		let destroy = false;
		if (this.left && this.obj.x + this.offset < viewport.x) destroy = true;
		if (this.right && this.obj.x - this.offset > viewport.x + viewport.width) destroy = true;
		if (this.top && this.obj.y + this.offset < viewport.y) destroy = true;
		if (this.bottom && this.obj.y - this.offset > viewport.y + viewport.height) destroy = true;
		if (destroy) this.obj.destroy();
	}

}