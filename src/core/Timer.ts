export class Timer {
	timer = 0;
	duration: number;
	callback: (this: any) => any;
	callbackContext: any;
	callOnCancelled = false;

	running = false;
	complete = false;

	constructor(duration: number, callback: (this: any) => any, context?: any) {
		this.duration = duration;
		this.callback = callback;
		this.callbackContext = context;
		this.running = true;
	}

	start() {
		this.complete = false;
		this.running = true;
	}

	destroy() {
		if (this.callOnCancelled && this.running && !this.complete) this.callback.call(this.callbackContext);
	}

	update(dt: number) {
		if (this.running) {
			this.timer += dt;
			if (this.timer >= this.duration) {
				this.timer = this.duration;
				this.running = false;
				this.complete = true;
				this.callback.call(this.callbackContext);
			}
		}
	}
}