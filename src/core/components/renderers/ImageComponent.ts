import { FilterMode, Image, Quad } from "love.graphics";
import { Component } from "../Component";

export class ImageComponent extends Component {

	image: Image;
	quadMode: QuadMode;
	originX = 0;
	originY = 0;
	flipX = 1;
	flipY = 1;
	color = {r: 1, g: 1, b: 1, a: 1};

	debugBounds = false;

	create(image: string | Image) {
		this.setTexture(image);
	}

	setFilter(min: FilterMode, mag?: FilterMode) {
		this.image.setFilter(min, mag ? mag : min);
	}

	setColor(r: number, g: number, b: number, a?: number) {
		this.color.r = r;
		this.color.g = g;
		this.color.b = b;
		if (a) this.color.a = a;
	}

	get alpha() {return this.color.a;}
	set alpha(val: number) {
		this.color.a = val;
	}

	setTexture(image: string | Image): void {
		if (typeof image == "string") this.image = this.scene.assets.img(image);
		else this.image = image;
		this.quadMode = new NoQuadMode(this.image);
	}

	setTileQuad(tileSize: number, index: number) {
		let quad = ImageComponent.createTileQuad(index, tileSize, tileSize, this.image.getWidth(), this.image.getHeight());
		this.setQuad(quad);
	}

	setQuad(quad: Quad) {
		this.quadMode = new HasQuadMode(this.image, quad);
	}

	draw(bounds?: Rect) {
		love.graphics.setColor(this.color.r, this.color.g, this.color.b, this.color.a);

		this.quadMode.draw(this);

		// if (this.debugBounds) {
		// 	let b = this.getRenderBounds();
		// 	love.graphics.setColor(1, 0, 0, 0.2);
		// 	let w = b.right - b.left;
		// 	let h = b.bottom - b.top;
		// 	love.graphics.rectangle("fill", b.left, b.top, w, h);

		// 	// let s = this.obj.transform.scale;
		// 	love.graphics.setColor(1, 1, 1);
		// 	let r = (n: string) => Math.round(b[n]);
		// 	love.graphics.print(r("top") + ", " + r("left") + "\n" + r("bottom") + ", " + r("right"), b.left, b.top, 0, 1, 1);
		// }
	}

	get width() {
		return this.quadMode.width;
	}

	get height() {
		return this.quadMode.height;
	}

	setOrigin(x: number, y?: number) {
		if (y == null) y = x;
		this.originX = x;
		this.originY = y;
	}

	// getRenderBounds() {
	// 	let scale = Math.max(this.obj.transform.globalScaleX, this.obj.transform.globalScaleY);
	// 	let size = Math.max(this.width, this.height);
	// 	let originX = Math.max(this.originX, 1 - this.originX);
	// 	let originY = Math.max(this.originY, 1 - this.originY);
	// 	let origin = Math.max(originX, originY);
	// 	let pos = this.obj.transform.globalPosition;
	// 	let maxSize = scale * size * origin;
	// 	return {left: pos.x - maxSize, top: pos.y - maxSize, right: pos.x + maxSize, bottom: pos.y + maxSize};
	// }

	// inRenderBounds(bounds: Rect) {
	// 	let scale = Math.max(this.obj.transform.globalScaleX, this.obj.transform.globalScaleY);
	// 	let size = Math.max(this.width, this.height);
	// 	let originX = Math.max(this.originX, 1 - this.originX);
	// 	let originY = Math.max(this.originY, 1 - this.originY);
	// 	let origin = Math.max(originX, originY);
	// 	let pos = this.obj.transform.globalPosition;
	// 	let maxSize = scale * size * origin;
	// 	return (pos.x - maxSize < bounds.x + bounds.width && pos.x + maxSize > bounds.x && pos.y - maxSize < bounds.y + bounds.height && pos.y + maxSize > bounds.y);
	// }

	// simpleInRenderBounds(bounds: Rect) {
	// 	let pos = this.obj.transform.globalPosition;
	// 	let size = Math.max(this.width, this.height);
	// 	let scale = Math.max(this.obj.transform.globalScaleX, this.obj.transform.globalScaleY);
	// 	let maxSize = scale * size;
	// 	return (pos.x - maxSize < bounds.x + bounds.width && pos.x + maxSize > bounds.x && pos.y - maxSize < bounds.y + bounds.height && pos.y + maxSize > bounds.y);
	// }

	// fakeInRenderBounds(bounds: Rect) {
	// 	return true;
	// }

	get bounds(): Rect {
		return {
			x: this.obj.transform.x - (this.width * this.originX) * this.obj.transform.globalScaleX,
			y: this.obj.transform.y - (this.height * this.originY) * this.obj.transform.globalScaleY,
			width: this.width * this.obj.transform.globalScaleX,
			height: this.height * this.obj.transform.globalScaleY,
		}
	}

	pointInBounds(x: number, y: number) {
		let [nx, ny] = this.obj.transform.globalMatrix.inverseTransformPoint(x, y);
		nx += this.originX * this.width;
		ny += this.originY * this.height;
		return (nx >= 0 && nx <= this.width && ny >= 0 && ny <= this.height);
	}

	public static createTileQuad(id: number, tileWidth: number, tileHeight: number, imgWidth: number, imgHeight: number) {
		let x = 0; let y = 0;
		id = tonumber(id);
		let tilesX = Math.floor(imgWidth / tileWidth);
		while (id >= tilesX) {
			id = id - tilesX;
			y = y + 1;
		}
		x = x + id;
		return love.graphics.newQuad(x * tileWidth, y * tileHeight, tileWidth, tileHeight, imgWidth, imgHeight);
	}

}

abstract class QuadMode {
	img: Image;
	constructor(img: Image) {this.img = img;}
	abstract get width(): number;
	abstract get height(): number;
	abstract draw(img: ImageComponent): void;
}

class NoQuadMode extends QuadMode {
	get width() {
		return this.img.getWidth();
	}
	get height() {
		return this.img.getHeight();
	}
	draw(img: ImageComponent) {
		love.graphics.draw(this.img, 0, 0, 0, img.flipX, img.flipY, img.originX * this.width, img.originY * this.height);
	}
}

class HasQuadMode extends QuadMode {
	quad: Quad;
	constructor(img: Image, quad: Quad) {
		super(img);
		this.quad = quad;
	}
	get width() {
		return this.quad.getViewport()[2];
	}
	get height() {
		return this.quad.getViewport()[3];
	}
	draw(img: ImageComponent) {
		love.graphics.draw(this.img, this.quad, 0, 0, 0, img.flipX, img.flipY, img.originX * this.width, img.originY * this.height);
	}
}