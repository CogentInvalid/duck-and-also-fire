import { Easing } from "./Easing";

type Obj = { [key: string]: any };

export type TweenConfig = {
	targets: Obj | Obj[];
	props: { [key: string]: number | {from: number, to: number} };
	duration: number;
	delay?: number;
	ease?: (t: number) => number;
	yoyo?: boolean;
	yoyoDelay?: number;
	repeat?: number;
	repeatDelay?: number;
	onComplete?: () => any;
	onUpdate?: () => any;
};

type TweenConfigMandatory = {
	targets: Obj | Obj[];
	props: { [key: string]: number | {from: number, to: number} };
	duration: number;
	delay: number;
	ease: (t: number) => number;
	yoyo: boolean;
	yoyoDelay: number;
	repeat: number;
	repeatDelay: number;
	onComplete?: () => any;
	onUpdate?: () => any;
};

type TweenProperty = { key: string, from: number, to: number };

export class Tween {

	config: TweenConfigMandatory;
	repeats = 0;
	tweenTargets: { target: Obj, properties: TweenProperty[] }[] = [];

	state: TweenState;

	static configProperties = ["targets", "duration", "delay", "ease", "yoyo", "yoyoDelay", "repeat", "repeatDelay", "onComplete", "onUpdate"];

	get complete(): boolean {
		return this.state instanceof CompleteState;
	}

	constructor(config: TweenConfig) {
		let defaultConfig = {
			targets: null,
			props: {},
			duration: 1,
			delay: 0,
			ease: Easing.Linear,
			yoyo: false,
			yoyoDelay: 0,
			repeat: 0,
			repeatDelay: 0,
			onComplete: null,
			onUpdate: null,
		};

		this.config = Object.assign(defaultConfig, config);

		let targets: Obj[];
		if (this.config.targets[0]) targets = this.config.targets as Obj[];
		else targets = [this.config.targets];
		for (const target of targets) {
			this.tweenTargets.push({ target: target, properties: [] });
		}
		
		for (let key in config.props) {
			const prop = config.props[key];
			for (let target of this.tweenTargets) {
				let from: number = target.target[key];
				let to: number;
				if (typeof prop == "number") to = prop;
				else {
					from = prop.from;
					to = prop.to;
				}
				target.properties.push({ key: key, from: from, to: to });
			}
		}

		if (this.config.delay > 0) this.state = new DelayState(this);
		else this.state = new RunState(this);
	}

	start() {
		// unused for now, check to make sure it actually resets everything
		this.repeats = 0;
	}

	update(dt: number) {
		this.state.update(dt);
	}
	
	switchState(state: TweenState) {
		this.state = state;
	}

	setTweenState(progress: number) {
		progress = lume.clamp(progress, 0, 1);

		for (const tweenTarget of this.tweenTargets) {
			for (const property of tweenTarget.properties) {
				tweenTarget.target[property.key] = lume.lerp(property.from, property.to, this.config.ease(progress));
			}
		}

		if (this.config.onUpdate) this.config.onUpdate();
	}

}

abstract class TweenState {
	tween: Tween;
	config: TweenConfigMandatory;
	timer = 0;
	constructor(tween: Tween, offset = 0) {
		this.tween = tween;
		this.config = tween.config;
		this.timer = offset;
	}
	abstract update(dt: number);
	switchState(NextState: new (tween: Tween, offset?: number) => TweenState, offset: number) {
		this.tween.switchState(new NextState(this.tween, offset));
	}
	onLoopComplete(offset: number) {
		let NextState: new (tween: Tween, offset?: number) => TweenState;
		if (this.config.repeat && this.tween.repeats != this.config.repeat) {
			if (this.config.repeatDelay > 0) NextState = RepeatDelayState;
			else NextState = RunState;
		}
		else NextState = CompleteState;
		this.tween.repeats++;
		this.switchState(NextState, offset);
	}
}

class DelayState extends TweenState {
	update(dt: number) {
		this.timer += dt;
		if (this.timer >= this.config.delay) this.switchState(RunState, this.timer - this.config.delay);
	}
}

class RunState extends TweenState {
	update(dt: number) {
		this.timer += dt;
		this.tween.setTweenState(this.timer / this.config.duration);
		if (this.timer >= this.config.duration) {
			let offset = this.timer - this.config.duration;
			if (this.config.yoyo) {
				if (this.config.yoyoDelay > 0) this.switchState(YoyoDelayState, offset);
				else this.switchState(YoyoState, offset);
			}
			else this.onLoopComplete(offset);
		}
	}
}

class YoyoDelayState extends TweenState {
	update(dt: number) {
		this.timer += dt;
		this.tween.setTweenState(1);
		if (this.timer >= this.config.yoyoDelay) this.switchState(YoyoState, this.timer - this.config.yoyoDelay);
	}
}

class YoyoState extends TweenState {
	update(dt: number) {
		this.timer += dt;
		this.tween.setTweenState(1 - this.timer / this.config.duration);
		if (this.timer >= this.config.duration) {
			this.onLoopComplete(this.timer - this.config.duration);
		}
	}
}

class RepeatDelayState extends TweenState {
	update(dt: number) {
		this.timer += dt;
		this.tween.setTweenState(0);
		if (this.timer >= this.config.repeatDelay) this.switchState(RunState, this.timer - this.config.repeatDelay);
	}
}

class CompleteState extends TweenState {
	constructor(tween: Tween, offset = 0) {
		super(tween, offset);
		if (this.tween.config.onComplete) this.tween.config.onComplete();
	}
	update(dt: number) { }
}