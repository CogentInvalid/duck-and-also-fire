import { Scene } from "core/Scene";
import { PhysicsBody } from "core/components/PhysicsBody";
import { PhysType } from "game/CollisionMap";
import { GridObject } from "./GridObject";
import { GameScene } from "game/scenes/GameScene";
import { ItemData, PlayerStats } from "game/components/PlayerStats";
import { Cell } from "game/Grid";
import { Acorn } from "./Acorn";
import { Inventory } from "game/components/Inventory";

export class Shop extends GridObject {
	type = "Shop";

	scene: GameScene;
	body: PhysicsBody;

	centerX = 16;
	centerY = 21;
	grabbable = false;
	burnable = false;

	upgrades: ItemData[];

	constructor(scene: Scene) {
		super(scene);
		this.image = this.addImage("spritesheet", "shop");
		this.image.setOrigin(0.5, 1);
		this.body = this.addComponent(PhysicsBody, PhysType.OBJECT, 24, 20, -12, -18, true, true);
		this.rollUpgrades();
	}

	rollUpgrades() {
		let upgrades = this.scene.player.getComponent(PlayerStats).getNextUpgrades();
		this.upgrades = lume.shuffle(upgrades).slice(0, 3);
	}

	removeUpgrade(upgrade: ItemData) {
		lume.remove(this.upgrades, upgrade);
	}

	getAdjacentAcorns(): Acorn[] {
		let heldAcorns = this.scene.player.getComponent(Inventory).objects.filter(obj => obj instanceof Acorn);
		let adjacentAcorns = this.getAdjacentAcornsToCell(this.cell, []);
		return heldAcorns.concat(adjacentAcorns);
	}

	private getAdjacentAcornsToCell(cell: Cell, acorns: Acorn[]): Acorn[] {
		let grid = this.scene.grid;
		let neighbors = grid.getNeighbors(cell, true);
		for (let neighbor of neighbors) {
			let obj = neighbor.object;
			if (obj instanceof Acorn && !acorns.includes(obj)) {
				acorns.push(obj);
				this.getAdjacentAcornsToCell(neighbor, acorns);
			}
		}
		return acorns;
	}

}