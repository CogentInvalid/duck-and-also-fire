type Callback<T> = (this: any, arg: T) => any;
type Listener<T> = {
	callback: Callback<T>;
	context: any;
	once: boolean;
}

export class Event<T> {

	private listeners: Listener<T>[] = [];

	add(callback: Callback<T>, context?: any) {
		this.listeners.push({callback: callback, context: context, once: false});
	}

	remove(callback: Callback<T>, context?: any) {
		const listener = this.listeners.find(l => l.callback == callback && (!context || l.context == context));
		lume.remove(this.listeners, listener);
	}

	once(callback: Callback<T>, context?: any) {
		this.listeners.push({callback: callback, context: context, once: true});
	}

	emit(arg: T) {
		let listeners = [...this.listeners];
		for (let listener of listeners) {
			listener.callback.call(listener.context, arg);
			if (listener.once) lume.remove(this.listeners, listener);
		}
	}

}