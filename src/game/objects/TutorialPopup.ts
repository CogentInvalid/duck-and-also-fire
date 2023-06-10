import { Align } from "core/Align";
import { Easing } from "core/Easing";
import { TextProcessor } from "core/TextProcessor";
import { Transform } from "core/Transform";
import { Component } from "core/components/Component";
import { TextScroller } from "core/components/TextScroller";
import { Container } from "core/objects/Container";
import { Image } from "core/objects/Image";
import { TextObject } from "core/objects/TextObject";
import { GameScene } from "game/scenes/GameScene";

export class TutorialPopup extends Container {

	followTarget: Transform;
	targetOffsetY: number;

	bg: Image;
	text: TextObject;

	constructor(scene: GameScene, message: string) {
		super(scene);

		this.addComponent(FollowComponent);

		let bg = this.bg = this.addImage("popup");
		bg.setOrigin(0.5, 1);
		this.setSize(bg.width, bg.height);
		this.setOrigin(0.5, 1);

		let font = scene.assets.font("default");

		let wrapWidth = this.width - 10;
		let units = TextProcessor.process(message, font, wrapWidth);
		message = TextProcessor.getString(units);

		let text = this.text = this.addText(message, { font: font, wrapWidth: wrapWidth, align: "center" });
		text.setColor(20 / 255, 16 / 255, 32 / 255);
		Align.center(text.transform, text.bounds, this.bounds, 0, -2);
		text.setString("");

		let textScroller = this.addComponent(TextScroller);
		textScroller.start(units);
		textScroller.onTextUpdated.add((str) => {
			text.setString(str);
		});

		this.addTween({
			targets: bg,
			props: { y: { from: 24, to: 0 } },
			duration: 0.4,
			ease: Easing.QuadOut,
		});

		this.addTween({
			targets: text,
			props: { y: { from: text.y + 24, to: text.y } },
			duration: 0.4,
			ease: Easing.QuadOut,
		});

		this.addTween({
			targets: this,
			props: { alpha: { from: 0, to: 1 } },
			duration: 0.4,
		});
		this.update(0);
	}

	_alpha = 1;
	set alpha(value: number) {
		this._alpha = value;
		this.bg.alpha = value;
		this.text.text.alpha = value;
	}
	get alpha() {
		return this._alpha;
	}

	setTarget(target: Transform, offsetY: number) {
		this.followTarget = target;
		this.targetOffsetY = offsetY;
	}

}

export class FollowComponent extends Component {
	obj: TutorialPopup;

	update() {
		this.follow();
	}

	preDraw() {
		this.follow();
	}

	follow() {
		if (this.obj.followTarget) {
			this.obj.x = this.obj.followTarget.x;
			this.obj.y = this.obj.followTarget.y + this.obj.targetOffsetY;
		}
	}
}

export class TutorialPopupSkip extends Container {
	followTarget: Transform;
	targetOffsetX: number;
	targetOffsetY: number;

	bg: Image;
	text: TextObject;

	constructor(scene: GameScene, message: string) {
		super(scene);

		let bg = this.bg = this.addImage("popup-skip");
		bg.setOrigin(91 / 124, 0);
		this.setSize(bg.width, bg.height);
		this.setOrigin(91 / 124, 0);

		let font = scene.assets.font("default");

		let wrapWidth = this.width - 10;
		let units = TextProcessor.process(message, font, wrapWidth);
		message = TextProcessor.getString(units);

		let text = this.text = this.addText(message, { font: font, wrapWidth: wrapWidth, align: "center" });
		text.setColor(20 / 255, 16 / 255, 32 / 255);
		Align.center(text.transform, text.bounds, this.bounds, 0, 2);
		text.setString("");

		let textScroller = this.addComponent(TextScroller);
		textScroller.start(units);
		textScroller.onTextUpdated.add((str) => {
			text.setString(str);
		});

		this.addTween({
			targets: bg,
			props: { y: { from: -24, to: 0 } },
			duration: 0.4,
			ease: Easing.QuadOut,
		});

		this.addTween({
			targets: text,
			props: { y: { from: text.y - 24, to: text.y } },
			duration: 0.4,
			ease: Easing.QuadOut,
		});

		this.addTween({
			targets: this,
			props: { alpha: { from: 0, to: 1 } },
			duration: 0.4,
		});
		this.update(0);
	}

	_alpha = 1;
	set alpha(value: number) {
		this._alpha = value;
		this.bg.alpha = value;
		this.text.text.alpha = value;
	}
	get alpha() {
		return this._alpha;
	}

	setTarget(target: Transform, offsetX: number, offsetY: number) {
		this.followTarget = target;
		this.targetOffsetX = offsetX;
		this.targetOffsetY = offsetY;
	}

	update(dt: number): void {
		if (this.followTarget) {
			this.x = this.followTarget.x + this.targetOffsetX;
			this.y = this.followTarget.y + this.targetOffsetY;
		}
		super.update(dt);
	}
	// 	super(scene, message);
	// 	this.bg.image.setTexture("popup-skip");
	// 	this.bg.setOrigin(91 / 124, 0);
	// 	this.setOrigin(91 / 124, 0);
	// 	Align.center(this.text.transform, this.text.bounds, this.bounds, 0, 2);
	// }
}