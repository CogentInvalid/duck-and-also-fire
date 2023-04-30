import { ImageComponent } from "core/components/renderers/ImageComponent";
import { GameObject } from "core/objects/GameObject";
import { Scene } from "core/Scene";

export class Image extends GameObject {
	type = "Image";
	image: ImageComponent;

	constructor(scene: Scene, key: string, frame?: string) {
		super(scene);
		this.image = this.addComponent(ImageComponent, frame ? "whiteSquare" : key);
		if (frame) this.setAtlasFrame(key, frame);
		if (this.type == "Image" && this.name == "") this.name = key;
	}

	setOrigin(x: number, y?: number) {
		this.image.setOrigin(x, y);
	}

	setColor(r: number, g: number, b: number, a?: number) {
		this.image.setColor(r, g, b, a);
	}

	get alpha(): number { return this.image.alpha; }
	set alpha(a: number) { this.image.alpha = a; }

	get width(): number { return this.image.width; }
	get height(): number { return this.image.height; }

	setSize(w: number, h?: number) {
		h ??= w;
		this.transform.scaleX = w / this.image.width;
		this.transform.scaleY = h / this.image.height;
	}

	get bounds(): Rect {
		return this.image.bounds;
	}

	setAtlasFrame(atlasName: string, frame: string) {
		let atlas = this.scene.assets.atlas(atlasName);
		this.image.setTexture(atlas.img);
		this.image.setQuad(atlas.getFrameQuad(frame));
	}
}