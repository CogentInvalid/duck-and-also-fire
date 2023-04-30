import { Component } from "./Component";

export class UpdateComponent extends Component {
	updateFunc: (dt: number, comp: UpdateComponent) => void;

	create(updateFunc: (dt: number, comp: UpdateComponent) => void): void {
		this.updateFunc = (dt, comp) => updateFunc(dt, comp);
	}

	update(dt: number) {
		this.updateFunc(dt, this);
	}
}