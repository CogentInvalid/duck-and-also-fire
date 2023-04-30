import { GameScene } from "./scenes/GameScene";
import { Align } from "core/Align";
import { GridObject } from "./objects/GridObject";
import { Fire } from "./objects/Fire";
import { Rock } from "./objects/Rock";
import { Egg } from "./objects/Egg";
import { Acorn } from "./objects/Acorn";
import { Wall } from "./objects/Wall";
import { Shop } from "./objects/Shop";
import { GameObject } from "core/objects/GameObject";

export type Cell = {
	xIndex: number;
	yIndex: number;
	object?: GridObject;
}

export class Grid {

	scene: GameScene;
	width: number;
	height: number;
	static tileSize = 24;

	cells: Cell[] = [];
	grid: Cell[][] = [];
	fires: Fire[] = [];

	constructor(scene: GameScene, width: number, height: number) {
		this.scene = scene;
		this.width = width;
		this.height = height;

		for (let x = 0; x < width; x++) {
			this.grid[x] = [];
			for (let y = 0; y < height; y++) {
				let cell = { xIndex: x, yIndex: y };
				this.grid[x][y] = cell;
				this.cells.push(cell);
			}
		}
	}

	spawnBounds() {
		this.scene.add(Wall, this.scene, -50, -50, 50, 1000);
		this.scene.add(Wall, this.scene, -50, -50, 1000, 50);
		this.scene.add(Wall, this.scene, this.width * Grid.tileSize, 0, 50, 5000);
		this.scene.add(Wall, this.scene, 0, this.height * Grid.tileSize, 5000, 50);
	}

	spawnGrass() {
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				if (lume.random() < 0.05) {
					let grass = this.scene.addImage("spritesheet", "grass1");
					this.scene.addToLayer(grass, "bg");
					grass.transform.x = x * Grid.tileSize;
					grass.transform.y = y * Grid.tileSize;
				}
			}
		}
	}

	spawnShop(fireCell: Cell) {
		let tries = 0;
		let finished = false;
		while (tries < 50 && !finished) {
			let x = math.floor(lume.random(this.width - 2) + 1);
			let y = math.floor(lume.random(this.height - 2) + 1);
			let cell = this.grid[x][y];
			if (!cell.object && !this.nearPlayer(cell) && !this.nearCell(fireCell.object, cell, 150)) {
				let shop = this.scene.add(Shop, this.scene);
				this.addObject(shop, x, y);
				finished = true;
			}
			tries++;
		}
	}

	nearCell(obj: GameObject, cell: Cell, threshold: number) {
		let { x, y } = this.getCellCenter(cell.xIndex, cell.yIndex);
		let dx = x - obj.x;
		let dy = y - obj.y;
		let dist = Math.sqrt(dx * dx + dy * dy);
		return dist < threshold;
	}

	nearPlayer(cell: Cell) {
		return this.nearCell(this.scene.player, cell, 50);
	}

	spawnRocks(count: number) {
		for (let i = 0; i < count; i++) {
			let x = math.floor(lume.random(this.width));
			let y = math.floor(lume.random(this.height));
			let cell = this.grid[x][y];
			if (!cell.object && !this.nearPlayer(cell)) {
				let rock = new Rock(this.scene);
				this.addObject(rock, x, y);
			}
		}
	}

	spawnEggs(count: number, fireCell: Cell) {
		for (let i = 0; i < count; i++) {
			let x = math.floor(lume.random(this.width - 2) + 1);
			let y = math.floor(lume.random(this.height - 2) + 1);
			let cell = this.grid[x][y];
			if (!cell.object && !this.nearPlayer(cell) && !this.nearCell(fireCell.object, cell, 250)) {
				let egg = new Egg(this.scene);
				this.addObject(egg, x, y);
			}
		}
	}

	spawnAcorns(count: number) {
		for (let i = 0; i < count; i++) {
			let x = math.floor(lume.random(this.width));
			let y = math.floor(lume.random(this.height));
			let cell = this.grid[x][y];
			if (!cell.object && !this.nearPlayer(cell)) {
				let acorn = new Acorn(this.scene);
				this.addObject(acorn, x, y);
			}
		}
	}

	getCellRect(x: number, y: number): Rect {
		return {
			x: x * Grid.tileSize,
			y: y * Grid.tileSize,
			width: Grid.tileSize,
			height: Grid.tileSize,
		};
	}

	getCellCenter(x: number, y: number): { x: number, y: number } {
		return {
			x: x * Grid.tileSize + Grid.tileSize / 2,
			y: y * Grid.tileSize + Grid.tileSize / 2,
		};
	}

	cellInBounds(x: number, y: number): boolean {
		return x >= 0 && x < this.width && y >= 0 && y < this.height;
	}

	getNearestCell(x: number, y: number): Cell | null {
		let xIndex = Math.floor(x / Grid.tileSize);
		let yIndex = Math.floor(y / Grid.tileSize);
		if (!this.cellInBounds(xIndex, yIndex)) {
			return null;
		}
		return this.grid[xIndex][yIndex];
	}

	getNeighbors(cell: Cell, diagonals = false): Cell[] {
		let neighbors: Cell[] = [];
		let x = cell.xIndex;
		let y = cell.yIndex;
		if (this.cellInBounds(x - 1, y)) {
			neighbors.push(this.grid[x - 1][y]);
		}
		if (this.cellInBounds(x + 1, y)) {
			neighbors.push(this.grid[x + 1][y]);
		}
		if (this.cellInBounds(x, y - 1)) {
			neighbors.push(this.grid[x][y - 1]);
		}
		if (this.cellInBounds(x, y + 1)) {
			neighbors.push(this.grid[x][y + 1]);
		}
		if (diagonals) {
			if (this.cellInBounds(x - 1, y - 1)) {
				neighbors.push(this.grid[x - 1][y - 1]);
			}
			if (this.cellInBounds(x + 1, y - 1)) {
				neighbors.push(this.grid[x + 1][y - 1]);
			}
			if (this.cellInBounds(x - 1, y + 1)) {
				neighbors.push(this.grid[x - 1][y + 1]);
			}
			if (this.cellInBounds(x + 1, y + 1)) {
				neighbors.push(this.grid[x + 1][y + 1]);
			}
		}
		return neighbors;
	}

	getBorderCells(): Cell[] {
		return this.cells.filter(c => {
			if (c.xIndex == 0) return true;
			if (c.yIndex == 0) return true;
			if (c.xIndex == this.width - 1) return true;
			if (c.yIndex == this.height - 1) return true;
		});
	}

	addObject(object: GridObject, x: number, y: number) {
		let cell = this.grid[x][y];
		cell.object = object;
		object.grid = this;
		object.cell = cell;
		this.scene.addToLayer(object, "default");
		Align.centerInCell(object, this.getCellRect(x, y), object.centerX, object.centerY);
	}

	removeObject(x: number, y: number) {
		let cell = this.grid[x][y];
		if (cell.object) {
			cell.object.cell = undefined;
			cell.object = undefined;
		}
	}

	getObjectsOfType(type: typeof GridObject): GridObject[] {
		let objects: GridObject[] = [];
		for (let cell of this.cells) {
			if (cell.object instanceof type) {
				objects.push(cell.object);
			}
		}
		return objects;
	}

}