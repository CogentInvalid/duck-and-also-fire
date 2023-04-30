// import { TileObject } from "./objects/TileObject";
import { GameObject } from "core/objects/GameObject";
import { Scene } from "../core/Scene";
import { TiledUtils } from "core/TiledUtils";

type TD = { firstgid: number, tileset: Tileset };

export class TiledLoader {

	static constructors: { [className: string]: (this: any, scene: Scene, obj: MapObject, tile: Tile) => GameObject } = {
		
	}

	static load(scene: Scene, path: string, scale = 1): TiledMap {
		let map = scene.assets.loadJson(path) as TiledMap;

		// // if a ".." is in the path, remove it and the previous directory
		// let re = "/([^/]*)/%.%."; // match /anything/..
		// [tilesetPath] = string.gsub(tilesetPath, re, "");
		// let tileset = scene.assets.loadJson(tilesetPath) as Tileset;

		let tilesets: TD[] = [];
		for (let tilesetData of map.tilesets) {
			let arr = tilesetData.source.split("/");
			let filename = arr.pop(); // "environment.tsj"
			let tilesetPath = "assets/tilesets/" + filename;
			let tileset = scene.assets.loadJson(tilesetPath) as Tileset;
			tilesets.unshift({ firstgid: tilesetData.firstgid, tileset: tileset });
		}

		for (let layer of map.layers) {
			if (layer.data != null) {
				let data = layer.data;
				let solidTiles1: boolean[] = [];
				for (let i = 0; i < data.length; i++) {
					let [tileset, tile] = this.getTile(data[i], tilesets);
					if (tile) solidTiles1.push(TiledUtils.getObjectProperty(null, tile, "solid"));
					else solidTiles1.push(false);
				}

				// disable collisions for tiles that have 4 solid neighbors
				let solidTiles2: boolean[] = [];
				for (let i = 0; i < solidTiles1.length; i++) {
					if (solidTiles1[i]) {
						let neighbors = [
							solidTiles1[i - 1],
							solidTiles1[i + 1],
							solidTiles1[i - layer.width],
							solidTiles1[i + layer.width],
						];
						if (neighbors.every(n => n || n == null)) solidTiles2.push(false);
						else solidTiles2.push(true);
					}
					else solidTiles2.push(true);
				}

				for (let i = 0; i < data.length; i++) {
					let [tileset, tile] = this.getTile(data[i], tilesets);
					if (tile) {
						let isSolid = solidTiles2[i];
						let x = (i % layer.width) * map.tilewidth * scale;
						let y = Math.floor(i / layer.width) * map.tileheight * scale;
						let atlasProp = tileset.properties?.find(p => p.name == "atlas");
						if (!atlasProp) error("Attempted to get atlas property from tileset '" + tileset.name + "' but it doesn't have one.\nDid you put an object tile on a tileset layer?");
						let atlasName = atlasProp.value; // "environment"
						let frameName = tile.image.split("/").pop(); // "ground-upper.png"
						// let object = new TileObject(scene, x, y, atlasName, frameName, isSolid);
						// scene.addToLayer(object, "bg");	
					}
				}
			}
			else if (layer.objects != null) {
				for (let obj of layer.objects) {
					let tile: Tile;
					if (obj.gid) {
						[, tile] = this.getTile(obj.gid, tilesets);
					}
					let className = (obj.type && obj.type.length > 0) ? obj.type : tile.type;
					let constructor = this.constructors[className];
					if (!constructor) error("No constructor defined for object type " + className);
					let object = constructor(scene, obj, tile);
					// scene.addToLayer(object, TiledUtils.getObjectProperty(obj, tile, "layer") ?? "default");
				}
			}
		}
		
		return map;
	}

	static getTile(id: number, tilesets: TD[]): [Tileset, Tile] {
		if (id < 1) return [null, null];
		let tileset: Tileset;
		let gid: number;
		for (let ts of tilesets) {
			tileset = ts.tileset;
			gid = id - ts.firstgid;
			if (ts.firstgid <= id) break;
		}
		return [tileset, tileset.tiles.find(t => t.id == gid)];
	}

}