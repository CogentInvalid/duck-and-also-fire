import { CameraManager } from "core/systems/CameraManager";
import { Component } from "./Component";
import { PhysicsBody } from "./PhysicsBody";

export class DisableOffscreen extends Component {

	left: boolean;
	right: boolean;
	top: boolean;
	bottom: boolean;
	offset: number;
	enabled = true;
	cam: CameraManager;
	body: PhysicsBody;

	create(left: boolean, right: boolean, top: boolean, bottom: boolean, offset = 0) {
		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
		this.offset = offset;
		this.cam = this.scene.getSystem(CameraManager);
		this.body = this.obj.getComponent(PhysicsBody);
	}

	update() {
		let viewport = this.cam?.getWorldBounds() ?? this.scene.viewport;
		let disable = false;
		if (this.left && this.obj.x + this.offset < viewport.x) disable = true;
		if (this.right && this.obj.x - this.offset > viewport.x + viewport.width) disable = true;
		if (this.top && this.obj.y + this.offset < viewport.y) disable = true;
		if (this.bottom && this.obj.y - this.offset > viewport.y + viewport.height) disable = true;
		
		if (disable && this.enabled) {
			this.enabled = false;
			if (this.body) this.body.updates = false;
		}
		if (!disable && !this.enabled) {
			this.enabled = true;
			if (this.body) this.body.updates = true;
		}
	}

}