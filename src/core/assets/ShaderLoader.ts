import { Shader } from "love.graphics";

export class ShaderLoader {

	shaders: { [key: string]: Shader } = {};

	getShader(name: string) {
		if (!this.shaders[name]) this.loadShader(name, "assets/shaders/", true);
		return this.shaders[name];
	}

	loadShader(name: string, path: string, frag: boolean) {
		let filePath = path + name + ".glsl";
		let shader = love.graphics.newShader(frag ? filePath : null, frag ? null : filePath);
		this.shaders[name] = shader;
	}

}