type Action = (onComplete: () => any) => any;

export default class ActionQueue {
	actions: Action[] = [];
	onComplete: () => void;
	index = 0;

	get length(): number {
		return this.actions.length;
	}

	running = false;

	add(action: Action): void {
		this.actions.push(action);
	}

	start(): void {
		this.running = true;
		this.index = 0;
		this.next();
	}

	next(): void {
		if (this.index >= this.actions.length) {
			this.finish();
			return;
		}

		const currentAction = this.actions[this.index];
		this.index++;
		currentAction(() => this.next());
	}

	cancel(): void {
		this.running = false;
		this.actions = [];
	}

	finish(): void {
		this.running = false;
		this.actions = [];
		if (this.onComplete != null) this.onComplete();
	}
}