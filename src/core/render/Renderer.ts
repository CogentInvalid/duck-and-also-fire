import { GameObject } from "core/objects/GameObject";
import { Scene } from "core/Scene";
import { CameraManager } from "core/systems/CameraManager";

export abstract class Renderer {

    defaultCamera: CameraManager;
    scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    update?(dt: number): void;
    abstract draw(): void;

    getDrawOrder(objects: GameObject[]): GameObject[] {
        return objects;
    }

    drawObjectHierarchy(parentObject: GameObject, bounds: Rect) {
        let obj = parentObject;

        love.graphics.push();
        let inBounds = this.objectInBounds(obj, bounds);
        if (inBounds) {
            obj.transform.applyGraphicsTransform();
            obj.draw(bounds);
        }
        else if (obj.children.length > 0) {
            obj.transform.applyGraphicsTransform();
        }
        for (const child of obj.children) {
            this.drawObjectHierarchy(child, bounds);
        }
        love.graphics.pop();
	}

    objectInBounds(obj: GameObject, bounds: Rect): boolean {
        let globalPos = obj.transform.globalPosition2();
        let x = globalPos.x;
        let y = globalPos.y;
        let margin = 80;
        return x >= bounds.x - margin && x <= bounds.x + bounds.width + margin && y >= bounds.y - margin && y <= bounds.y + bounds.height + margin;
    }

    getViewport(): Rect {
        return { x: 0, y: 0, width: love.graphics.getWidth(), height: love.graphics.getHeight() };
    }

}