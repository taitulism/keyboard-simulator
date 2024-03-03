import {describe, it, expect} from 'vitest';
import {apiSpec} from './api.spec';
import {pkgName} from '../src';

describe('pkgName', () => {
	it('is ok', () => {
		expect(pkgName).to.be.ok;
	});

	describe('API', apiSpec);
});
