import * as Phaser from 'phaser'
import Signal = Phaser.Signal;
import {injectable} from "inversify";

@injectable()
export abstract class BaseSubject {
	private _cache: {[key:string]: any} = {};
	protected signals: {[key: number]: Signal} = {};

	//TODO: localStorage
	set(key: string, obj: any):void {
		this._cache[key] = obj;
	}
	get(key: string) {
		return this._cache[key];
	}

	subscribe(events: number | number[], callback: Function): void {
		[].concat(events).forEach(event => {
			this._createSignalIfNew(event);
			this.signals[event].add(callback);
		});
	}

	dispatch(event: number, payload: any = null): void {
		this._createSignalIfNew(event);
		this.signals[event].dispatch(payload);
	}

	delayedDispatch(event: number, payload: any, timeout: number = 1): void {
		setTimeout(() => this.dispatch(event, payload), timeout);
	}

	private _createSignalIfNew(event: number): void {
		if (!this.signals[event])
			this.signals[event] = new Signal();
	}
}