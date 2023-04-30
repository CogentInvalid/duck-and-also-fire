declare interface TiledProperty {
	name: string;
	type: string;
	value: any;
}

declare interface MapObject {
	name: string;
	type: string;
	polyline?: { x: number; y: number }[];
	polygon?: { x: number; y: number }[];
	point?: boolean;
	x: number;
	y: number;
	width?: number;
	height?: number;
	rotation: number;
	gid?: number;
	properties: TiledProperty[];
}

declare interface MapLayer {
	name: string;
	id: number;
	type: string;

	x: number;
	y: number;
	width: number;
	height: number;

	objects?: MapObject[];
	data: number[];
	image?: string;

	visible: boolean;
	opacity: number;
}

declare interface Tile {
	id: number;
	type: string;
	image: string;
	imageheight: number;
	imagewidth: number;
	objectgroup: {objects: MapObject[]};
	properties: TiledProperty[];
}

declare interface Tileset {
	name: string;
	tiles: Tile[];
	properties: TiledProperty[];
}

declare interface TilesetData {
	firstgid: number;
	source: string;
}

declare interface TiledMap {
	layers: MapLayer[];
	tilesets: TilesetData[];
	tilewidth: number;
	tileheight: number;
	width: number;
	height: number;
	properties?: TiledProperty[];
}