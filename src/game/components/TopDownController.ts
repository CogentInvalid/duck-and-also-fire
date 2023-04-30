import { Component } from "core/components/Component";
import { InputSystem } from "core/systems/InputSystem";
import { PlayerStats } from "./PlayerStats";
import { Inventory } from "./Inventory";

export class TopDownController extends Component {

	// speed = 150;
	vx = 0;
	vy = 0;
	canMove = true;

	update(dt: number) {
		let transform = this.obj.transform;
		
		let dir = { x: 0, y: 0 };
		if (this.canMove) {
			const input = this.scene.getSystem(InputSystem);
			if (input) {
				if (input.down("up")) dir.y -= 1;
				if (input.down("down")) dir.y += 1;
				if (input.down("left")) dir.x -= 1;
				if (input.down("right")) dir.x += 1;
			}
		}

		// normalize dir
		let len = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
		if (len > 0) {
			dir.x /= len;
			dir.y /= len;
		}

		let speed = this.obj.getComponent(PlayerStats).speed;
		let carry = this.obj.getComponent(PlayerStats).carry;
		let multiplier = (this.obj.getComponent(Inventory).objects.length > 0) ? carry : 1;
		this.vx -= (this.vx - dir.x * speed * multiplier) * 9 * dt;
		this.vy -= (this.vy - dir.y * speed * multiplier) * 9 * dt;

		transform.x += this.vx * dt;
		transform.y += this.vy * dt;
	}

}