import { PhysicsBody } from "core/components/PhysicsBody";
import { UpdateComponent } from "core/components/UpdateComponent";
import { Image } from "core/objects/Image";
import { CollisionTable } from "core/systems/CollisionManager";
import { PhysType } from "game/CollisionMap";
import { TopDownController } from "game/components/TopDownController";
import { GameScene } from "game/scenes/GameScene";
import { Fire } from "./Fire";
import { Inventory } from "game/components/Inventory";
import { HealthComponent } from "game/components/HealthComponent";
import { PlayerMouseInput } from "game/components/PlayerMouseInput";
import { GridObject } from "./GridObject";
import { Grid } from "game/Grid";
import { Shop } from "./Shop";
import { PlayerStats } from "game/components/PlayerStats";
import { Event } from "core/Event";

export class Player extends Image {
	type = "Player";

	scene: GameScene;
	inventory: Inventory;
	health: HealthComponent;

	onPickedUpObject: Event<void> = new Event();

	constructor(scene: GameScene) {
		super(scene, "player");

		this.setOrigin(18 / this.image.width, 42 / this.image.height);

		let controller = this.addComponent(TopDownController);

		this.addComponent(UpdateComponent, (dt) => {
			if (controller.vx < 0) this.transform.scaleX = -1;
			else if (controller.vx > 0) this.transform.scaleX = 1;
		});

		let body = this.addComponent(PhysicsBody, PhysType.PLAYER, 16, 8, -8, -8, false, true);
		body.onCollide.add((col: CollisionTable) => this.onCollide(col));

		this.inventory = this.addComponent(Inventory);
		this.health = this.addComponent(HealthComponent);
		this.addComponent(PlayerMouseInput);
		this.addComponent(PlayerStats);
	}

	update(dt: number): void {
		super.update(dt);
	}

	onCollide(col: CollisionTable) {
		let obj = col.other.obj;
		if (obj instanceof Fire) {
			if (obj.cell) this.health.loseHP(0.1);
		}
	}

	activateObject(grid: Grid, x: number, y: number, obj: GridObject) {
		if (obj.grabbable) {
			this.inventory.carryObject(grid, x, y, obj);
			this.onPickedUpObject.emit();
		}
		else if (obj instanceof Shop) {
			this.scene.gameManager.showShop(obj);
		}
	}

	setCanMove(canMove: boolean) {
		this.getComponent(TopDownController).canMove = canMove;
		this.getComponent(PlayerMouseInput).enabled = canMove;
		this.getComponent(HealthComponent).enabled = canMove;
	}

	die() {
		this.setCanMove(false);
		this.scene.gameManager.gameOver();
	}

}