import { System } from "core/systems/System";
import { GameScene } from "./scenes/GameScene";
import { Fire } from "./objects/Fire";
import { Rock } from "./objects/Rock";
import { Egg } from "./objects/Egg";
import { Duckling } from "./objects/Duckling";
import { ShopMenu } from "./objects/ShopMenu";
import { Align } from "core/Align";
import { Shop } from "./objects/Shop";
import { MenuScene } from "./scenes/MenuScene";
import { TutorialPopup, TutorialPopupSkip } from "./objects/TutorialPopup";
import { GameObject } from "core/objects/GameObject";
import { Transform } from "core/Transform";
import { Event } from "core/Event";
import { Acorn } from "./objects/Acorn";

type LevelData = {
	fireSpreadTime: number;
	eggCount: number;
	acornCount: number;
}

export class GameManager extends System {
	scene: GameScene;
	state: GameState;

	fireSpreadTime = 2;
	fireSpreadTimer: number;

	levelIndex = 0;
	onLevelComplete: Event<void> = new Event();

	levels = [
		this.setupLevel1,
		this.setupLevel2,
		this.setupLevel3,
		this.setupLevel,
	]

	levelDatas: LevelData[] = [
		{ fireSpreadTime: 0, eggCount: 0, acornCount: 0 },
		{ fireSpreadTime: 0, eggCount: 0, acornCount: 0 },
		{ fireSpreadTime: 0, eggCount: 0, acornCount: 0 },
		{ fireSpreadTime: 2.5, eggCount: 2, acornCount: 3 },
		{ fireSpreadTime: 2.25, eggCount: 3, acornCount: 2 },
		{ fireSpreadTime: 2, eggCount: 4, acornCount: 2 },
		{ fireSpreadTime: 2, eggCount: 5, acornCount: 2 },
		{ fireSpreadTime: 1.9, eggCount: 5, acornCount: 2 },
		{ fireSpreadTime: 1.8, eggCount: 6, acornCount: 2 },
		{ fireSpreadTime: 1.7, eggCount: 6, acornCount: 2 },
		{ fireSpreadTime: 1.5, eggCount: 6, acornCount: 3 },
		{ fireSpreadTime: 1.5, eggCount: 7, acornCount: 3 },
	]

	constructor(scene: GameScene) {
		super(scene);

		this.switchState(new DefaultState(this.scene));
		// let input = this.scene.getSystem(InputSystem);
		// input.actions["debug"].onPressed.add(this.levelComplete, this);

		this.fireSpreadTimer = this.fireSpreadTime;
	}

	startGame(index = 0) {
		this.levelIndex = index;
		this.levels[this.levelIndex].call(this);
	}

	update(dt: number): void {
		if (this.state.fireSpreads) {
			this.fireSpreadTimer -= dt;
			if (this.fireSpreadTimer < 0) {
				this.fireSpreadTimer += this.fireSpreadTime;
				let fires = this.scene.grid.getObjectsOfType(Fire) as Fire[];
				fires = fires.filter(f => f.getValidNeighbors().length > 0);
				if (fires.length == 0) this.levelComplete();
				fires.forEach(f => f.spread());
			}
		}
	}

	levelComplete() {
		this.switchState(new TransitionState(this.scene));
		let obj = this.scene.addImage("whiteSquare");
		this.scene.addToLayer(obj, "ui");
		obj.setSize(2000, 2000);
		obj.setColor(0, 0, 0, 0);
		this.onLevelComplete.emit();
		this.levelIndex++;

		let gameManager = this;
		obj.addSequence(async function (script) {
			await script.callback(complete => {
				this.addTween({
					targets: this.image.color,
					props: { a: 1 },
					duration: 0.6,
					onComplete: () => complete(null),
				});
			});
			gameManager.nextLevel();
			await script.callback(complete => {
				this.addTween({
					targets: this.image.color,
					props: { a: 0 },
					duration: 0.6,
					onComplete: () => complete(null),
				});
			});
			gameManager.switchState(new DefaultState(gameManager.scene));
		}, obj);
	}

	clearPreviousLevel() {
		this.scene.findObjectsOfType(Fire).forEach(o => o.destroy());
		this.scene.findObjectsOfType(Rock).forEach(o => o.destroy());
		this.scene.findObjectsOfType(Egg).forEach((o, i) => {
			let cell = o.cell;
			o.destroy();
			if (cell) {
				let duckling = this.scene.add(Duckling, this.scene, i % 2 == 0);
				this.scene.grid.addObject(duckling, cell.xIndex, cell.yIndex);
			}
		});
		this.scene.findObjectsOfType(Shop).forEach(o => o.destroy());
	}

	setupLevel1() {
		let fire = this.scene.add(Fire, this.scene);
		this.scene.grid.addObject(fire, 25, 14);
		this.fireSpreadTime = 999;
		this.fireSpreadTimer = 999;

		let cells = [
			[15, 16],
			[17, 17],
			[17, 12],
			[21, 10],
			[14, 10],
			[16, 18],
		];
		let rocks: Rock[] = [];
		for (let [x, y] of cells) {
			let rock = this.scene.add(Rock, this.scene);
			rocks.push(rock);
			this.scene.grid.addObject(rock, x, y);
		}

		let tutController = this.scene.add(GameObject, this.scene);
		tutController.addSequence(async function (script) {
			let player = this.scene.player;
			await script.wait(1);
			this.createTutorialPopup("You are Duck", player.transform, -48);
			await script.wait(3);
			this.createTutorialPopup("There is also Fire", fire.transform, -36);
			await script.wait(3);
			this.createTutorialPopup("WASD to move", player.transform, -48);
			await script.wait(3);
			this.createTutorialPopup("Click things to pick them up", rocks[0].transform, -36);
			await script.callback(complete => player.onPickedUpObject.once(complete));
			this.fireSpreadTime = 3;
			this.fireSpreadTimer = 0.5;
			let d = this.createTutorialPopup("Build a fort to be safe from the fire", player.transform, -48);
			await script.wait(5);
			d();
			await script.wait(6);
			d = this.createSkipPopup("Press the skip button to wait out the fire", this.scene.hud.skipButton.transform, 0, 24);
			let p1 = new Promise(resolve => this.scene.hud.skipButton.onClick.once(resolve, this));
			let p2 = new Promise(resolve => this.onLevelComplete.once(resolve, this));
			await Promise.race([p1, p2]);
			d();
			tutController.destroy();
		}, this);
	}

	setupLevel2() {
		let fire = this.scene.add(Fire, this.scene);
		this.scene.grid.addObject(fire, 25, 14);
		this.fireSpreadTime = 999;
		this.fireSpreadTimer = 999;

		let egg = this.scene.add(Egg, this.scene);
		this.scene.grid.addObject(egg, 18, 14);

		this.scene.grid.spawnRocks(50);

		let tutController = this.scene.add(GameObject, this.scene);
		tutController.addSequence(async function (script) {
			await script.wait(1);
			this.createTutorialPopup("Protect eggs from fire", egg.transform, -24);
			await script.wait(3);
			this.fireSpreadTime = 3;
			this.fireSpreadTimer = 0.5;
			let d = this.createSkipPopup("Destroyed eggs hurt Duck Emotions", this.scene.hud.emotionsBar.transform, 100, 24);
			await script.wait(5);
			d();
			tutController.destroy();
		}, this);
	}

	setupLevel3() {
		this.fireSpreadTime = 3;
		let fireCell = this.addFire();

		let shop = this.scene.add(Shop, this.scene);
		this.scene.grid.addObject(shop, 25, 14);

		let acorn = this.scene.add(Acorn, this.scene);
		this.scene.grid.addObject(acorn, 23, 14);

		this.scene.grid.spawnRocks(50);
		this.scene.grid.spawnEggs(2, fireCell);

		let tutController = this.scene.add(GameObject, this.scene);
		tutController.addSequence(async function (script) {
			let player = this.scene.player;
			await script.wait(1);
			let d = this.createTutorialPopup("Deliver acorns to the shop for items", player.transform, -48);
			await script.wait(5);
			d();
			tutController.destroy();
		}, this);
	}

	tutPop: TutorialPopup | TutorialPopupSkip;
	createTutorialPopup(message: string, target: Transform, offset = 0) {
		if (this.tutPop) this.tutPop.destroy();
		let popup = this.tutPop = this.scene.add(TutorialPopup, this.scene, message);
		this.scene.addToLayer(popup, "upper");
		popup.setTarget(target, offset);
		return () => popup.destroy();
	}

	createSkipPopup(message: string, target: Transform, offsetX = 0, offsetY = 0) {
		if (this.tutPop) this.tutPop.destroy();
		let popup = this.tutPop = this.scene.add(TutorialPopupSkip, this.scene, message);
		this.scene.addToLayer(popup, "ui");
		popup.setTarget(target, offsetX, offsetY);
		return () => popup.destroy();
	}

	addFire() {
		let borderCells = this.scene.grid.getBorderCells();
		borderCells = borderCells.filter(c => c.object == null);
		if (borderCells.length == 0) borderCells = this.scene.grid.getBorderCells();

		let fireCell = lume.randomchoice(borderCells);
		if (fireCell.object) fireCell.object.destroy();
		let fire = this.scene.add(Fire, this.scene);
		this.scene.grid.addObject(fire, fireCell.xIndex, fireCell.yIndex);
		return fireCell;
	}

	nextLevel() {
		this.clearPreviousLevel();
		if (this.levelIndex >= this.levels.length) {
			this.levels[this.levels.length - 1].call(this);
		}
		else this.levels[this.levelIndex].call(this);
		let eggs = this.scene.findObjectsOfType(Egg);
		this.scene.hud.setEggs(eggs);
	}

	setupLevel() {
		let levelData = (this.levelIndex < this.levelDatas.length) ? this.levelDatas[this.levelIndex] : this.levelDatas[this.levelDatas.length - 1];

		let fireCell = this.addFire();

		this.scene.grid.spawnShop(fireCell);
		this.scene.grid.spawnRocks(50);
		this.scene.grid.spawnEggs(levelData.eggCount, fireCell);
		this.scene.grid.spawnAcorns(levelData.acornCount);

		this.fireSpreadTime = levelData.fireSpreadTime;
		this.fireSpreadTimer = levelData.fireSpreadTime;
	}

	showShop(shop: Shop) {
		this.switchState(new ShopState(this.scene));
		let menu = this.scene.add(ShopMenu, this.scene, shop);
		this.scene.addToLayer(menu, "ui");
		Align.center(menu.transform, menu.bounds, this.scene.viewport, 0, 0);
		menu.onDestroy.add(() => this.switchState(new DefaultState(this.scene)));
	}

	skip(): void {
		this.fireSpreadTime = 0.15;
		this.fireSpreadTimer = 0;
		let sfx = this.scene.assets.sound("fire");
		sfx.stop();
		sfx.play();
	}

	gameOver() {
		this.switchState(new GameOverState(this.scene));
		let obj = this.scene.addImage("whiteSquare");
		this.scene.addToLayer(obj, "ui");
		obj.setSize(2000, 2000);
		obj.setColor(0, 0, 0, 0);

		obj.addSequence(async function (script) {
			await script.callback(complete => {
				this.addTween({
					targets: this.image.color,
					props: { a: 1 },
					duration: 0.8,
					onComplete: () => complete(null),
				});
			});
			this.scene.game.setState(MenuScene);
		}, obj);
	}

	switchState(state: GameState) {
		if (this.state) this.state.exit();
		this.state = state;
		this.state.enter();
	}
}

class GameState {
	scene: GameScene;
	type: string;
	fireSpreads: boolean;

	constructor(scene: GameScene) {
		this.scene = scene;
	}
	enter() {
		return;
	}
	exit() {
		return;
	}
}

class DefaultState extends GameState {
	type = "default";
	fireSpreads = true;
}

class ShopState extends GameState {
	type = "shop";
	fireSpreads = false;

	enter(): void {
		this.scene.player.setCanMove(false);
	}

	exit(): void {
		this.scene.player.setCanMove(true);
	}
}

class TransitionState extends GameState {
	type = "transition";
	fireSpreads = false;

	enter(): void {
		this.scene.player.setCanMove(false);
	}

	exit(): void {
		this.scene.player.setCanMove(true);
	}
}

class GameOverState extends GameState {
	type = "gameOver";
	fireSpreads = false;

	enter(): void {
		this.scene.player.setCanMove(false);
	}
}