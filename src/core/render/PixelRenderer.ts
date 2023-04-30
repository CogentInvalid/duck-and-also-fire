import { Renderer } from "core/render/Renderer";
import { Scene } from "core/Scene";
import { CameraManager } from "core/systems/CameraManager";
import { Canvas } from "love.graphics";

export class PixelRenderer extends Renderer {

	canvas: Canvas;
	scale: number;
	
	constructor(scene: Scene, scale: number) {
		super(scene);
		this.scale = scale;
		let [w, h] = love.graphics.getDimensions();
		this.canvas = love.graphics.newCanvas(w / scale, h / scale);
		this.canvas.setFilter("nearest", "nearest");
	}

	draw() {
		love.graphics.setCanvas(this.canvas);
		let [r,g,b] = love.graphics.getBackgroundColor();
		love.graphics.clear(r, g, b);

		let viewport = this.getViewport();
		
		let currentCamera: CameraManager;
		for (const obj of this.scene.objects) {
            if (!obj.transform.parent) {
                let camera = obj.camera ?? this.defaultCamera;
                if (camera != null && currentCamera != camera) {
                    if (currentCamera) currentCamera.detach();
                    currentCamera = camera;
                    currentCamera.attach();
                }

                let bounds = currentCamera?.getWorldBounds() ?? viewport;
                this.drawObjectHierarchy(obj, bounds);
            }
		}
		if (currentCamera) currentCamera.detach();

		love.graphics.setCanvas();
		love.graphics.origin();
		love.graphics.setColor(1, 1, 1, 1);
		love.graphics.setBlendMode("alpha", "premultiplied");
		love.graphics.draw(this.canvas, 0, 0, 0, this.scale, this.scale);
		love.graphics.setBlendMode("alpha", "alphamultiply");
	}
	
	getViewport(): Rect {
        return { x: 0, y: 0, width: this.canvas.getWidth(), height: this.canvas.getHeight() };
    }

}