export class LoadUtils {
	static loadText(path: string): string {
		let file = love.filesystem.newFile(path);
		file.open("r");
		let [str, bytes] = file.read(file.getSize());
		file.close();
		return str;
	}

	static loadJson(path: string): any {
		let str = this.loadText(path);
		return jsonParser.decode(str);
	}
}