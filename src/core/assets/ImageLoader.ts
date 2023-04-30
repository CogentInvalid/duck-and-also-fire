import { FilterMode, Image } from "love.graphics";

interface Path {
	prefix: string, suffix: string
}

export type ImageLoaderArgs = {
	path?: Path
	filter?: FilterMode
}

export class ImageLoader {

	defaultPath: Path = {
		prefix: "assets/img/",
		suffix: ".png",
	};

	defaultArgs: ImageLoaderArgs = {
		path: this.defaultPath,
		filter: "nearest",
	};
	
	private images: {[name: string]: Image} = {};

	public getImage(name: string, args?: ImageLoaderArgs) {
		if (args == undefined) args = this.defaultArgs;
		let path = args.path ? args.path : this.defaultPath;

		if (!this.images[name]) this.loadImage(name, path, args);

		return this.images[name];
	}

	private loadImage(name: string, path: Path, args: ImageLoaderArgs) {
		this.images[name] = love.graphics.newImage(path.prefix + name + path.suffix);
		if (args.filter) this.images[name].setFilter(args.filter, args.filter);
	}

	public clear() {
		this.images = {};
	}

}