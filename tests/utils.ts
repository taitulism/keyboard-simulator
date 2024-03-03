import {MockInstance, expect} from 'vitest';
import {DispatchCall} from '../src/types';

const assertDispatchCall = (dispatchCall: unknown): dispatchCall is DispatchCall | never => {
	expect(dispatchCall).to.be.an('array');
	expect(dispatchCall).not.to.be.empty;
	expect((dispatchCall as [unknown])[0]).toBeInstanceOf(KeyboardEvent);

	return true;
};

export const extractLastEvent = (spy: MockInstance): KeyboardEvent => {
	const {lastCall} = spy.mock;

	assertDispatchCall(lastCall);

	return lastCall![0];
};

export const extractTwoLastEvents = (spy: MockInstance): [KeyboardEvent, KeyboardEvent] => {
	const lastEvent = extractLastEvent(spy);
	const {calls} = spy.mock;

	expect(calls.length).toBeGreaterThanOrEqual(2);

	const secondLastCall = calls[calls.length - 2];

	if (assertDispatchCall(secondLastCall)) {
		const [secondLastEvent] = secondLastCall;

		return [secondLastEvent, lastEvent];
	}

	throw new Error('Error: extractTwoLastEvents');
};
