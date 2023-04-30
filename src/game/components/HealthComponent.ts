import { Event } from "core/Event";
import { Component } from "core/components/Component";
import { Player } from "game/objects/Player";

export class HealthComponent extends Component {

	obj: Player;
	hp = 10;
	maxHP = 10;
	emotions = 8;
	maxEmotions = 8;
	regen = 0.1;
	enabled = true;

	onHPChanged: Event<number> = new Event();
	onEmotionsChanged: Event<number> = new Event();

	loseHP(amt: number): void {
		if (!this.enabled) return;
		this.hp -= amt;
		if (this.hp < 0) {
			this.hp = 0;
			this.obj.die();
		}
		this.onHPChanged.emit(this.hp / this.maxHP);
	}

	loseEmotions(amt: number): void {
		if (!this.enabled) return;
		this.emotions -= amt;
		if (this.emotions < 0) {
			this.emotions = 0;
			this.obj.die();
		}
		this.onEmotionsChanged.emit(this.emotions / this.maxEmotions);
	}

	restoreEmotions(amt: number): void {
		this.emotions += amt;
		if (this.emotions > this.maxEmotions) this.emotions = this.maxEmotions;
		this.onEmotionsChanged.emit(this.emotions / this.maxEmotions);
	}

	update(dt: number) {
		this.hp += this.regen * dt;
		if (this.hp > this.maxHP) this.hp = this.maxHP;
		this.onHPChanged.emit(this.hp / this.maxHP);
	}

}