import { GridObject } from "game/objects/GridObject";
import { Transform } from "./Transform";
import { GameObject } from "./objects/GameObject";
import { Image } from "./objects/Image";

type AlignRect = {
	x: number,
	y: number,
	width?: number,
	height?: number
}

export class Align {

	private static align(transform: Transform, o1: AlignRect, o2: AlignRect, ox: number, oy: number, px: number, py: number) {
		let w1 = o1.width ?? 0;
		let w2 = o2.width ?? 0;
		let h1 = o1.height ?? 0;
		let h2 = o2.height ?? 0;
		let pivot = { x: o1.x + w1 * px, y: o1.y + h1 * py };
		let anchor = { x: o2.x + w2 * px, y: o2.y + h2 * py };
		transform.x -= (pivot.x - anchor.x);
		transform.x += ox * (px == 0 ? -1 : 1);
		transform.y -= (pivot.y - anchor.y);
		transform.y += oy * (py == 0 ? -1 : 1);
	}

	private static alignPosition(px: number, py: number) {
		return (transform: Transform, o1: AlignRect, o2: AlignRect, ox: number, oy: number) => this.align(transform, o1, o2, ox, oy, px, py);
	}

	static center = Align.alignPosition(0.5, 0.5);
	static topLeft = Align.alignPosition(0, 0);
	static topRight = Align.alignPosition(1, 0);
	static bottomLeft = Align.alignPosition(0, 1);
	static bottomRight = Align.alignPosition(1, 1);
	static topCenter = Align.alignPosition(0.5, 0);
	static bottomCenter = Align.alignPosition(0.5, 1);
	static leftCenter = Align.alignPosition(0, 0.5);
	static rightCenter = Align.alignPosition(1, 0.5);

	static centerInCell(obj: GridObject, cell: Rect, centerX: number, centerY: number) {
		let cx = cell.x + cell.width / 2;
		let cy = cell.y + cell.height / 2;
		let img = obj.image?.image;
		if (!img) {
			obj.setPosition(cx, cy + 24 - obj.centerY);
			return;
		}
		centerX = centerX / img.width;
		centerY = centerY / img.height;
		let dx = img.originX - centerX;
		let dy = img.originY - centerY;
		obj.setPosition(cx + dx * img.width, cy + dy * img.height);
	}

}