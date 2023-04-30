import { Container } from "core/objects/Container";
import { Image } from "core/objects/Image";
import { Cell, Grid } from "game/Grid";

export abstract class GridObject extends Container {
	centerX: number;
	centerY: number;
	image: Image;
	grid: Grid;
	cell: Cell;
	grabbable = true;
	burnable = false;

	destroy(): void {
		if (this.cell) this.grid.removeObject(this.cell.xIndex, this.cell.yIndex);
		super.destroy();
	}

	onBurned() {
		return;
	}
}