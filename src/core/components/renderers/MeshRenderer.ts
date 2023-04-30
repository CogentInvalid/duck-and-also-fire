import { Mesh } from "love.graphics";
import { Component } from "../Component";

export class MeshRenderer extends Component {

	mesh: Mesh;

	create(mesh: Mesh) {
		this.mesh = mesh;
	}

	draw(bounds?: Rect) {
		// TODO render bounds
		
		love.graphics.setColor(1, 1, 1);
		// love.graphics.setColor(this.color.r, this.color.g, this.color.b, this.color.a);
		love.graphics.draw(this.mesh, 0, 0);
	}

}