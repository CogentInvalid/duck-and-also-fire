import { Align } from "core/Align";
import { Container } from "core/objects/Container";
import { GameScene } from "game/scenes/GameScene";
import { Button } from "./Button";
import { ItemData } from "game/components/PlayerStats";
import { TextObject } from "core/objects/TextObject";
import { Event } from "core/Event";

export class ShopItem extends Container {

	scene: GameScene;
	itemData: ItemData;
	buyButton: Button;
	priceText: TextObject;
	price: number;

	onPurchase: Event<ShopItem> = new Event();
	
	constructor(scene: GameScene, itemData: ItemData) {
		super(scene);

		this.itemData = itemData;

		this.setSize(250, 50);

		let bounds = this.addImage("whiteSquare");
		bounds.setSize(this.width, this.height);
		bounds.alpha = 0;

		let headerText = this.addText(itemData.headerText, {});
		headerText.setColor(20 / 255, 16 / 255, 32 / 255);
		Align.topLeft(headerText.transform, headerText.bounds, bounds.bounds, -12, -4);

		let descriptionText = this.addText(itemData.descriptionText, {wrapWidth: 150});
		descriptionText.setColor(20 / 255, 16 / 255, 32 / 255);
		Align.topLeft(descriptionText.transform, descriptionText.bounds, bounds.bounds, -12, -20);

		let buyButton = this.buyButton = scene.add(Button, scene, "button-active");
		this.addChild(buyButton);
		Align.rightCenter(buyButton.transform, buyButton.bounds, bounds.bounds, -10, 0);
		buyButton.onClick.add(this.purchase, this);

		let priceText = this.priceText = this.addText("0/999", {wrapWidth: 150, align: "center"});
		priceText.setColor(20 / 255, 16 / 255, 32 / 255);
		Align.center(priceText.transform, priceText.bounds, buyButton.bounds, 6, 0);

		if (itemData.bought) this.setInactive();
	}

	updateLayout(acorns: number, price: number): void {
		this.price = price;
		this.priceText.setString(acorns.toString() + "/" + price.toString());
		if (acorns < price) {
			this.buyButton.image.setTexture("button-inactive");
			this.buyButton.enabled = false;
		} else {
			this.buyButton.image.setTexture("button-active");
			this.buyButton.enabled = true;
		}
	}

	purchase(): void {
		this.itemData.activate();
		this.setInactive();
		this.onPurchase.emit(this);
	}

	setInactive() {
		this.buyButton.image.setTexture("button-inactive");
		this.buyButton.enabled = false;
	}

}