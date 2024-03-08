import {MockInstance, expect} from 'vitest';

type DispatchCall = [KeyboardEvent]

const assertDispatchCall = (dispatchCall: unknown): dispatchCall is DispatchCall | never => {
	expect((dispatchCall as [unknown])[0]).toBeInstanceOf(KeyboardEvent);

	return true;
};

export const extractLastEvent = (spy: MockInstance): KeyboardEvent => {
	const {lastCall} = spy.mock;

	assertDispatchCall(lastCall);

	return lastCall![0];
};

export const extractLastEvents = (spy: MockInstance, count: number): Array<KeyboardEvent> | never => {
	const {calls} = spy.mock;

	expect(calls.length).toBeGreaterThanOrEqual(count);

	const lastCalls = calls.slice(calls.length - count);

	return lastCalls.map((call) => {
		assertDispatchCall(call);

		// A call is an array of a single event = [ev]
		return call[0];
	});
};
