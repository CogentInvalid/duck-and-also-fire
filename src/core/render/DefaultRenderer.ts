import { CameraManager } from "core/systems/CameraManager";
import { Renderer } from "./Renderer";

export class DefaultRenderer extends Renderer {

    draw() {
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
		love.graphics.origin();
    }

}