import { Component } from "core/components/Component";
import { GameScene } from "game/scenes/GameScene";
import { HealthComponent } from "./HealthComponent";

export class PlayerStats extends Component {

	scene: GameScene;
	speedLevel = 0;
	carryLevel = 0;
	stacksLevel = 0;
	hasRadar = false;

	numUpgrades = 0;

	static speed = [150, 165, 180, 195, 210, 225];
	static carry = [0.65, 0.7, 0.8, 0.9, 1];
	static stacks = [1, 2, 3, 4];
	static prices = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];

	get speed(): number {
		return PlayerStats.speed[this.speedLevel];
	}
	get carry(): number {
		return PlayerStats.carry[this.carryLevel];
	}
	get stacks(): number {
		return PlayerStats.stacks[this.stacksLevel];
	}

	get upgradeItemPrice(): number {
		if (this.numUpgrades >= PlayerStats.prices.length) return PlayerStats.prices[PlayerStats.prices.length - 1];
		return PlayerStats.prices[this.numUpgrades];
	}

	create(): void {
		
	}

	getNextUpgrades(): ItemData[] {
		let upgrades = [];

		if (this.speedLevel < PlayerStats.speed.length - 1) {
			upgrades.push(new SpeedItem(this.scene, this, this.speedLevel + 1));
		}
		if (this.carryLevel < PlayerStats.carry.length - 1) {
			upgrades.push(new CarryItem(this.scene, this, this.carryLevel + 1));
		}
		if (this.stacksLevel < PlayerStats.stacks.length - 1) {
			upgrades.push(new StacksItem(this.scene, this, this.stacksLevel + 1));
		}

		let health = this.obj.getComponent(HealthComponent);
		if (health.emotions < health.maxEmotions) {
			upgrades.push(new EmotionItem(this.scene, this, health.emotions + 1));
		}

		if (!this.hasRadar) {
			upgrades.push(new EggRadar(this.scene, this, 1));
		}

		return upgrades;
	}

	onUpgrade(): void {
		this.numUpgrades++;
	}

	upgradeSpeed(): void {
		this.speedLevel++;
		this.onUpgrade();
	}

	upgradeCarry(): void {
		this.carryLevel++;
		this.onUpgrade();
	}

	upgradeStacks(): void {
		this.stacksLevel++;
		this.onUpgrade();
	}

	restoreEmotions(): void {
		let health = this.obj.getComponent(HealthComponent);
		health.restoreEmotions(2.5);
	}

	getRadar(): void {
		this.hasRadar = true;
		this.onUpgrade();
	}

}

export abstract class ItemData {
	scene: GameScene;
	stats: PlayerStats;
	level: number;
	headerText: string;
	descriptionText: string;
	bought = false;
	constructor(scene: GameScene, stats: PlayerStats, level: number) {
		this.scene = scene;
		this.stats = stats;
		this.level = level;
	}
	activate() {
		this.bought = true;
	}
	getPrice(): number {
		return this.stats.upgradeItemPrice;
	}
}

class SpeedItem extends ItemData {
	headerText = "Speed+";
	descriptionText = "Boost waddle velocity";
	activate(): void {
		super.activate();
		this.stats.upgradeSpeed();
	}
}

class CarryItem extends ItemData {
	headerText = "Carry+";
	descriptionText = "Deliver objects more quickly";
	activate(): void {
		super.activate();
		this.stats.upgradeCarry();
	}
}

class StacksItem extends ItemData {
	headerText = "Head+";
	descriptionText = "Stack more objects";
	activate(): void {
		super.activate();
		this.stats.upgradeStacks();
	}
	getPrice(): number {
		return super.getPrice() + 2;
	}
}

class EmotionItem extends ItemData {
	headerText = "Emotions+";
	descriptionText = "Restores some emotions";
	activate(): void {
		super.activate();
		this.stats.restoreEmotions();
	}
	getPrice() {
		return 2;
	}
}

class EggRadar extends ItemData {
	headerText = "Egg Radar";
	descriptionText = "Where's An Egg?";
	activate(): void {
		super.activate();
		this.stats.getRadar();
	}
	getPrice() {
		return super.getPrice() + 2;
	}
}