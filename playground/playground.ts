import {KeyboardSimulator} from '../src';

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


setTimeout(async () => {
	const input = document.getElementById('input')!;

	document.addEventListener('keydown', (ev: KeyboardEvent) => {
		console.log('document listener - ev.target', ev.target);
	});

	input.addEventListener('keydown', (ev: KeyboardEvent) => {
		console.log('input listener - ev.target', ev.target);
		// ev.stopPropagation();
	});

	const kb = new KeyboardSimulator();

	kb.keyPress('A');
	await sleep(500);
	kb.setContextElm(input);
	kb.keyPress('B');
}, 1000);
