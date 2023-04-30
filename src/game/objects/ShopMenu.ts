import { Align } from "core/Align";
import { Container } from "core/objects/Container";
import { GameScene } from "game/scenes/GameScene";
import { Button } from "./Button";
import { ShopItem } from "./ShopItem";
import { Shop } from "./Shop";
import { PlayerStats } from "game/components/PlayerStats";
import { Image } from "core/objects/Image";

export class ShopMenu extends Container {

	scene: GameScene;
	shop: Shop;
	bg: Image;
	items: ShopItem[] = [];
	
	constructor(scene: GameScene, shop: Shop) {
		super(scene);

		this.shop = shop;

		let bg = this.bg = this.addImage("shop-bg");
		this.setSize(bg.width, bg.height);

		let closeButton = scene.add(Button, scene, "close-button");
		this.addChild(closeButton);
		Align.topRight(closeButton.transform, closeButton.bounds, this.bounds, 4, 4);
		closeButton.onClick.add(() => this.destroy());

		this.spawnButtons();
	}

	spawnButtons() {
		for (let item of this.items) {
			item.destroy();
		}

		let shop = this.shop;
		const items = shop.upgrades;
		let acorns = shop.getAdjacentAcorns().length;
		for (let i = 0; i < 3; i++) {
			let itemData = items[i];
			if (itemData) {
				let item = this.scene.add(ShopItem, this.scene, itemData);
				this.items.push(item);
				this.addChild(item);
				Align.topLeft(item.transform, item.bounds, this.bg.bounds, -80, -65 - 60 * i);
				print(inspect(this.bg.bounds));
				item.updateLayout(acorns, itemData.getPrice());
				item.onPurchase.add(this.onPurchase, this);
			}
		}
	}

	onPurchase(item: ShopItem) {
		lume.remove(this.shop.upgrades, item.itemData);

		let acorns = this.shop.getAdjacentAcorns();
		for (let i = 0; i < item.price; i++) {
			acorns[i].destroy();
		}

		this.spawnButtons();
	}

}