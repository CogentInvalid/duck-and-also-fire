import { Event } from "core/Event";
import { Game } from "core/Game";
import { Layers } from "core/Layers";
import { Scene } from "core/Scene";
import { MouseInput } from "core/components/MouseInput";
import { GameObject } from "core/objects/GameObject";
import { PerfMonitor } from "core/objects/PerfMonitor";
import { PixelRenderer } from "core/render/PixelRenderer";
import { CameraManager } from "core/systems/CameraManager";
import { CollisionManager } from "core/systems/CollisionManager";
import { InputSystem } from "core/systems/InputSystem";
import { MouseInputSystem } from "core/systems/MouseInputSystem";
import { CollisionMap } from "game/CollisionMap";
import { GameManager } from "game/GameManager";
import { Grid } from "game/Grid";
import { HUD } from "game/objects/HUD";
import { Player } from "game/objects/Player";
import { Scancode } from "love.keyboard";

type GameLayer = "none" | "bg" | "default" | "upper" | "ui";

export class GameScene extends Scene {

	renderer: PixelRenderer;
	layers: Layers<GameLayer>;
	grid: Grid;
	player: Player;
	gameManager: GameManager;
	inputObj: GameObject;
	hud: HUD;
	
	constructor(game: Game) {
		super(game);

		this.renderer = new PixelRenderer(this, 2);

		let collisionMap = new CollisionMap(!game.config.webBuild);
		this.addSystem(new CollisionManager(this, collisionMap));

		this.addSystem(new MouseInputSystem(this));
		let input = this.addSystem(new InputSystem(this));
		for (let bind of game.config.inputBinds) input.setBind(bind.key, bind.action);

		let camera = this.addSystem(new CameraManager(this));
		this.renderer.defaultCamera = camera;
		let uiCamera = this.addSystem(new CameraManager(this));
		uiCamera.focusOnViewportCenter();

		let width = 20 * 2;
		let height = 15 * 2;
		camera.setBounds(0, 0, 20 * 24 * 2, 15 * 24 * 2);

		this.layers = new Layers(this);
		this.layers.add("bg", camera);
		this.layers.add("default", camera);
		this.layers.add("upper", camera);
		this.layers.add("ui", uiCamera);

		love.graphics.setBackgroundColor(26 / 255, 69 / 255, 59 / 255);

		let inputObj = this.inputObj = this.addImage("whiteSquare");
		inputObj.setSize(2000, 2000);
		inputObj.alpha = 0;
		this.addToLayer(inputObj, "ui");
		inputObj.addComponent(MouseInput, inputObj.image);

		this.grid = new Grid(this, width, height);

		this.grid.spawnBounds();
		this.grid.spawnGrass();

		let player = this.player = this.add(Player, this);
		this.addToLayer(player, "default");
		player.setPosition(20 * 24, 15 * 24);
		camera.setTarget(player.transform, true);

		let hud = this.hud = this.add(HUD, this);
		this.addToLayer(hud, "ui");
		hud.setPlayer(player);

		let gameManager = this.gameManager = this.addSystem(new GameManager(this));
		gameManager.startGame();

		// let perfMonitor = this.add(PerfMonitor, this);
		// this.addToLayer(perfMonitor, "ui");
	}

	update(dt: number): void {
		super.update(dt);

		let objects = this.layers.get("default").children;
		this.layers.get("default").children = lume.sort(objects, (a, b) => a.y < b.y);
	}

	addToLayer(obj: GameObject, layer: GameLayer) {
		if (!this.objects.includes(obj)) this.addExisting(obj);
		this.layers.get(layer).addChild(obj);
	}

	keypressed(scancode: Scancode, isrepeat?: boolean): void {
		// if (scancode == "r") {
		// 	this.game.setState(GameScene);
		// }
		super.keypressed(scancode);
	}

	mousepressed(x: number, y: number, button: number): void {
		this.onMouseButtonDown.emit([x, y, button]);
	}

}