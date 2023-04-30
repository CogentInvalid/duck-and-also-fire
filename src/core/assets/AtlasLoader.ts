import { Image, Quad } from "love.graphics";
import { LoadUtils } from "./LoadUtils";

export class AtlasLoader {

	atlases: { [key: string]: SpriteAtlas } = {};

	getAtlas(name: string) {
		if (!this.atlases[name]) this.loadAtlas(name, "assets/atlases/");
		return this.atlases[name];
	}

	loadAtlas(name: string, path: string) {
		let data = LoadUtils.loadJson(path + name + ".json") as AtlasData;
		let img = love.graphics.newImage(path + name + ".png");
		img.setFilter("nearest", "nearest");
		const atlas = new SpriteAtlas(data, img);
		this.atlases[name] = atlas;
	}

}

export class SpriteAtlas {

	data: AtlasData;
	img: Image;
	quads: { [key: string]: Quad } = {};

	constructor(data: AtlasData, img: Image) {
		this.data = data;
		this.img = img;
	}

	getFrameQuad(frame: string) {
		if (this.quads[frame]) return this.quads[frame];
		// error(inspect(this.data));
		let data = this.data.frames[frame].frame;
		let [w, h] = this.img.getDimensions();
		this.quads[frame] = love.graphics.newQuad(data.x, data.y, data.w, data.h, w, h);
		return this.quads[frame];
	}

}

type AtlasData = {
	frames: { [key: string]: AtlasFrame };
	meta: any;
}

type AtlasFrame = {
	frame: { x: number, y: number, w: number, h: number },
	spriteSourceSize: { x: number, y: number, w: number, h: number },
	sourceSize: {w: number, h: number},
}