import { ImageLoaderArgs, ImageLoader } from "../assets/ImageLoader";
import { Source } from "love.audio";
import { Font, Image } from "love.graphics";
import { AtlasLoader } from "./AtlasLoader";
import { LoadUtils } from "./LoadUtils";
import { ShaderLoader } from "./ShaderLoader";
import { AudioLoader } from "./AudioLoader";
import { FontLoader } from "./FontLoader";

export class AssetCache {

	images: ImageLoader = new ImageLoader();
	atlases: AtlasLoader = new AtlasLoader();
	audio: AudioLoader = new AudioLoader();
	fonts: FontLoader = new FontLoader();
	shaders: ShaderLoader = new ShaderLoader();

	img(name: string, args?: ImageLoaderArgs): Image {
		return this.images.getImage(name, args);
	}

	atlas(name: string) {
		return this.atlases.getAtlas(name);
	}

	sound(name: string): Source | null {
		return this.audio.getSource(name);
	}

	font(name: string): Font | null {
		return this.fonts.getFont(name);
	}

	shader(name: string) {
		return this.shaders.getShader(name);
	}

	loadText(path: string) {
		return LoadUtils.loadText(path);
	}

	loadJson(path: string) {
		return LoadUtils.loadJson(path);
	}

	clear() {
		this.images.clear();
	}
	
}