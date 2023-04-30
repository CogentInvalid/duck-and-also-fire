import { Font } from "love.graphics";

interface Path {
	prefix: string, suffix: string
}

type FontLoaderArgs = {
	path?: Path;
}

export class FontLoader {

	defaultPath: Path = {
		prefix: "assets/fonts/",
		suffix: ".ttf",
	};

	defaultArgs: FontLoaderArgs = {
		path: this.defaultPath,
	};

	fonts: { [key: string]: Font } = {};

	constructor() {
		this.fonts["default"] = love.graphics.getFont();
	}

	loadFont(name: string, args?: FontLoaderArgs) {
		if (args == undefined) args = this.defaultArgs;
		let path = args.path ? args.path : this.defaultPath;
		if (!this.fonts[name]) this.load(name, path);
		return this.fonts[name];
	}

	private load(name: string, path: Path) {
		this.fonts[name] = love.graphics.newFont(path.prefix + name + path.suffix);
	}

	getFont(name: string) {
		return this.fonts[name];
	}

}