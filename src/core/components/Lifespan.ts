import { Component } from "./Component";

export class Lifespan extends Component {

	lifespan: number;

	create(lifespan: number): void {
		this.lifespan = lifespan;
	}

	update(dt: number) {
		this.lifespan -= dt;
		if (this.lifespan <= 0) this.obj.destroy();
	}
	
}