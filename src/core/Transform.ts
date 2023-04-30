import { Transform as TransformMatrix } from "love.math";

export class Transform {

	private matrix: TransformMatrix;

	children: Transform[] = [];
	parent?: Transform;

	_x = 0;
	_y = 0;
	private _angle = 0;
	private _sx = 1;
	private _sy = 1;
	private _ox = 0;
	private _oy = 0;

	constructor(x?: number, y?: number) {
		this.matrix = love.math.newTransform();
		if (x) this.x = x;
		if (y) this.y = y;
		this.updateMatrix();
	}

	private updateMatrix() {
		this.matrix.setTransformation(this._x, this._y, this._angle, this._sx, this._sy, this._ox, this._oy);
	}

	get localMatrix() {
		return this.matrix;
	}

	get globalMatrix(): TransformMatrix {
		if (!this.parent) return this.matrix;
		else return this.parent.globalMatrix.clone().apply(this.matrix);
	}

	get globalPosition(): Vector2 {
		if (!this.parent) return {x: this._x, y: this._y};
		let parentPos = this.parent.globalPosition;
		if (this._angle != 0 || this._sx != 1 || this._sy != 1) {
			let matrix = this.globalMatrix;
			let [x, y] = matrix.transformPoint(0, 0);
			return { x: x, y: y};
		}
		else return {x: parentPos.x + this._x, y: parentPos.y + this._y};
	}

	globalPosition2(): Vector2 {
		if (!this.parent) return {x: this._x, y: this._y};
		let parentPos = this.parent.globalPosition;
		if (this._angle != 0 || this._sx != 1 || this._sy != 1) {
			let matrix = this.globalMatrix;
			let [x, y] = matrix.transformPoint(0, 0);
			return { x: x, y: y};
		}
		else return {x: parentPos.x + this._x, y: parentPos.y + this._y};
	}

	get x() {return this._x;}
	set x(val: number) {
		this._x = val;
		this.updateMatrix();
	}

	get y() {return this._y;}
	set y(val: number) {
		this._y = val;
		this.updateMatrix();
	}

	get angle() {return this._angle;}
	set angle(val: number) {
		this._angle = val;
		this.updateMatrix();
	}

	get scaleX() {return this._sx;}
	set scaleX(val: number) {
		this._sx = val;
		this.updateMatrix();
	}

	get scaleY() {return this._sy;}
	set scaleY(val: number) {
		this._sy = val;
		this.updateMatrix();
	}

	get scale() {return this.scaleX;}
	set scale(val: number) {
		this.scaleX = val;
		this.scaleY = val;
		this.updateMatrix();
	}

	get globalScaleX() {
		return this.parent ? this.parent.globalScaleX * this.scaleX : this.scaleX;
	}

	get globalScaleY() {
		return this.parent ? this.parent.globalScaleY * this.scaleY : this.scaleY;
	}

	get globalScale() {return this.globalScaleX;}

	// get offsetX() {return this._ox;}
	// set offsetX(val: number) {
	// 	this._ox = val;
	// 	this.updateMatrix();
	// }

	// get offsetY() {return this._oy;}
	// set offsetY(val: number) {
	// 	this._oy = val;
	// 	this.updateMatrix();
	// }

	setPosition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	setScale(x: number, y?: number) {
		this.scaleX = x;
		this.scaleY = y ? y : x;
	}

	addChild(child: Transform) {
		child.parent = this;
		this.children.push(child);
	}

	removeChild(child: Transform) {
		child.parent = undefined;
		lume.remove(this.children, child);
	}

	applyGraphicsTransform() {
		love.graphics.translate(this._x, this._y);
		if (this._angle != 0) love.graphics.rotate(this._angle);
		if (this._sx != 1 || this._sy != 1) love.graphics.scale(this._sx, this._sy);
		// not handling offset
	}

}