import { Source } from "love.audio";
import { SoundData } from "love.sound";

interface Path {
	prefix: string, suffix: string
}

type AudioLoaderArgs = {
	path?: Path;
}

export class AudioLoader {

	defaultPath: Path = {
		prefix: "assets/audio/",
		suffix: ".ogg",
	};

	defaultArgs: AudioLoaderArgs = {
		path: this.defaultPath,
	};

	sources: { [key: string]: Source } = {};
	soundData: { [key: string]: SoundData } = {};

	constructor() {
		this.loadAudio("pickup");
		this.loadAudio("putdown");
		this.loadAudio("fire");
		// let bgmIntro = love.sound.newSoundData("assets/audio/intro.ogg");
		// this.soundData["bgmIntro"] = bgmIntro;
	}

	loadAudio(name: string, args?: AudioLoaderArgs) {
		if (args == undefined) args = this.defaultArgs;
		let path = args.path ? args.path : this.defaultPath;

		if (!this.sources[name]) this.load(name, path);

		return this.sources[name];
	}

	private load(name: string, path: Path) {
		this.sources[name] = love.audio.newSource(path.prefix + name + path.suffix, "static");
	}

	getSource(name) {
		return this.sources[name];
	}

}