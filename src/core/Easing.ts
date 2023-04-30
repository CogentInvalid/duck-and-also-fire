export class Easing {
	static Linear(v: number) {
		return v;
	}

	static QuadIn(v: number) {
		return v * v;
	}

	static QuadOut(v: number) {
		return v * (2 - v);
	}

	static QuadInOut(v: number) {
		if ((v *= 2) < 1) {
			return 0.5 * v * v;
		}
		else {
			return -0.5 * (--v * (v - 2) - 1);
		}
	}

	static BackOut(v: number, overshoot = 1.70158) {
		return --v * v * ((overshoot + 1) * v + overshoot) + 1;
	}

	static BackIn(v: number, overshoot = 1.70158) {
		return v * v * ((overshoot + 1) * v - overshoot);
	}
}