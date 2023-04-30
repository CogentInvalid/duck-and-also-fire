export class TiledUtils {
	static getObjectProperty(obj: MapObject, tile: Tile, name: string) {
		let value = obj?.properties?.find(p => p.name == name)?.value;
		if (value == null) value = tile?.properties?.find(p => p.name == name)?.value;
		return value;
	}
}