import {
	addMeltEventListener,
	makeElement,
	createElHelpers,
	omit,
	toWritableStores,
	executeCallbacks,
	withGet,
	effect
} from '@melt-ui/svelte/internal/helpers';
import type { MeltActionReturn } from '@melt-ui/svelte/internal/types';
import { get, writable } from 'svelte/store';
import type { VisualizationEvents } from './events.js';
import type { CreateVisualizationProps } from './types.js';

const defaults = {
	defaultRatios: {
		left: 0.6,
		right: 0.4,
		topLeft: 0.7,
		bottomLeft: 0.3,
		topRight: 0.2,
		bottomRight: 0.8
	}
} satisfies CreateVisualizationProps;

type VisualizationParts = 'root' | 'panel' | 'box' | 'horizontal-trigger' | 'vertical-trigger';
const { name } = createElHelpers<VisualizationParts>('visualization');

export function createVisualization(props?: CreateVisualizationProps) {
	const withDefaults = { ...defaults, ...props } satisfies CreateVisualizationProps;

	const options = toWritableStores(omit(withDefaults, 'ratios', 'defaultRatios'));

	const ratios = withDefaults.ratios ?? writable(withDefaults.defaultRatios);

	const showA = writable(true);

	const showLeftPanel = writable(false);
	const showRightPanel = writable(false);

	const showPanelProbs = writable(false);

	const showTopLeftProbs = writable(false);
	const showBottomLeftProbs = writable(false);
	const showTopRightProbs = writable(false);
	const showBottomRightProbs = writable(false);

	const grabbing = withGet(writable<'left' | 'middle' | 'right' | undefined>());

	const root = makeElement(name(), {
		stores: [ratios],
		returned: ([$ratios]) =>
			({
				'data-state': $ratios ? 'ratios' : 'closed'
			}) as const,
		action: (node: HTMLElement): MeltActionReturn<VisualizationEvents['root']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'pointermove', (e) => {
					const currentlyGrabbing = grabbing.get();
					if (currentlyGrabbing !== undefined) {
						ratios.update(($ratios) => {
							if (currentlyGrabbing === 'middle') {
								const a = e.pageX - node.offsetWidth / 2;
								const b = window.innerWidth - (e.pageX + node.offsetWidth / 2);

								return {
									...$ratios,
									left: a / (a + b),
									right: b / (a + b)
								};
							} else {
								const a = e.pageY - node.offsetHeight / 2;
								const b = window.innerHeight - (e.pageY + node.offsetHeight / 2);

								if (currentlyGrabbing === 'left') {
									return {
										...$ratios,
										topLeft: a / (a + b),
										bottomLeft: b / (a + b)
									};
								} else {
									return {
										...$ratios,
										topRight: a / (a + b),
										bottomRight: b / (a + b)
									};
								}
							}
						});
					}
				}),
				addMeltEventListener(node, 'pointerup', () => {
					if (grabbing.get() !== undefined) {
						showTopLeftProbs.set(false);
						showBottomLeftProbs.set(false);
						showTopRightProbs.set(false);
						showBottomRightProbs.set(false);

						showPanelProbs.set(false);

						grabbing.set(undefined);
					}
				})
			);

			return {
				destroy: unsub
			};
		}
	});

	const panel = makeElement(name('panel'), {
		returned: () => (props: { x: 'left' | 'right' }) =>
			({
				'data-x': props.x
			}) as const
	});

	const box = makeElement(name('box'), {
		returned: () => (props: { y: 'top' | 'bottom'; x: 'left' | 'right' }) =>
			({
				'data-x': props.x,
				'data-y': props.y
			}) as const,
		action: (node: HTMLElement): MeltActionReturn<VisualizationEvents['box']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'pointerenter', () => {
					if (grabbing.get() !== undefined) {
						if (node.dataset.x === 'left') {
							if (node.dataset.y === 'top') {
								showTopLeftProbs.set(true);
							} else {
								showBottomLeftProbs.set(true);
							}
						} else {
							if (node.dataset.y === 'top') {
								showTopRightProbs.set(true);
							} else {
								showBottomRightProbs.set(true);
							}
						}
					}
				}),
				addMeltEventListener(node, 'pointerleave', () => {
					if (grabbing.get() !== undefined) {
						if (node.dataset.x === 'left') {
							if (node.dataset.y === 'top') {
								showTopLeftProbs.set(false);
							} else {
								showBottomLeftProbs.set(false);
							}
						} else {
							if (node.dataset.y === 'top') {
								showTopRightProbs.set(false);
							} else {
								showBottomRightProbs.set(false);
							}
						}
					}
				})
			);

			return {
				destroy: unsub
			};
		}
	});

	const verticalTrigger = makeElement(name('vertical-trigger'), {
		action: (node: HTMLElement): MeltActionReturn<VisualizationEvents['vertical-trigger']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'pointerenter', () => {
					if (grabbing.get() === undefined) {
						showLeftPanel.set(true);
						showRightPanel.set(true);
					}
				}),
				addMeltEventListener(node, 'pointerleave', () => {
					if (grabbing.get() === undefined) {
						showLeftPanel.set(false);
						showRightPanel.set(false);
					}
				}),
				addMeltEventListener(node, 'pointerdown', () => {
					if (grabbing.get() === undefined) {
						showLeftPanel.set(true);
						showRightPanel.set(true);
						showPanelProbs.set(true);

						grabbing.set('middle');

						showA.set(false);
					}
				})
			);

			return {
				destroy: unsub
			};
		}
	});

	const horizontalTrigger = makeElement(name('horizontal-trigger'), {
		stores: [grabbing],
		returned:
			([$grabbing]) =>
			(props: { x: 'left' | 'right' }) =>
				({
					'data-x': props.x,
					'data-grabbed': $grabbing === props.x ? 'true' : 'false'
				}) as const,
		action: (node: HTMLElement): MeltActionReturn<VisualizationEvents['horizontal-trigger']> => {
			const unsub = executeCallbacks(
				addMeltEventListener(node, 'pointerenter', () => {
					if (node.dataset.grabbed === 'false') {
						showA.set(false);
						if (node.dataset.side === 'left') {
							showRightPanel.set(true);
						} else {
							showLeftPanel.set(true);
						}
					}
				}),
				addMeltEventListener(node, 'pointerleave', (e) => {
					if (node.dataset.grabbed === 'false' && grabbing.get() === undefined) {
						if (node.dataset.side === 'left') {
							showRightPanel.set(false);
						} else {
							showLeftPanel.set(false);
						}
						showA.set(true);
					}
				}),
				addMeltEventListener(node, 'pointerdown', (e) => {
					if (!grabbing.get()) {
						if (node.dataset.side === 'left') {
							showRightPanel.set(true);
							showTopLeftProbs.set(true);
							showBottomLeftProbs.set(true);
							grabbing.set('left');
						} else {
							showLeftPanel.set(true);
							showTopRightProbs.set(true);
							showBottomRightProbs.set(true);
							grabbing.set('right');
						}

						showA.set(false);
					}
				})
			);

			return {
				destroy() {
					unsub();
				}
			};
		}
	});
	const { left, right, topLeft, topRight, bottomLeft, bottomRight } = get(ratios);

	const probabilities = writable<{
		A: number;
		notA: number;
		A_B: number;
		B_A: number;
		notB_A: number;
		A_notB: number;
		notA_B: number;
		notA_notB: number;
		B_notA: number;
		notB_notA: number;
	}>({
		A: left / (left + right),
		notA: right / (left + right),
		A_B: (topLeft * left) / (topLeft * left + topRight * right),
		B_A: topLeft / (topLeft + bottomLeft),
		notB_A: bottomLeft / (topLeft + bottomLeft),
		A_notB: (bottomLeft * left) / (bottomLeft * left + bottomRight * right),
		notA_B: (topRight * right) / (topLeft * left + topRight * right),
		notA_notB: (bottomRight * right) / (bottomLeft * left + bottomRight * right),
		B_notA: topRight / (topRight + bottomRight),
		notB_notA: bottomRight / (topRight + bottomRight)
	});

	effect([ratios], ($ratios) => {
		const { left, right, topLeft, topRight, bottomLeft, bottomRight } = $ratios;
		probabilities.set({
			A: left / (left + right),
			notA: right / (left + right),
			A_B: (topLeft * left) / (topLeft * left + topRight * right),
			B_A: topLeft / (topLeft + bottomLeft),
			notB_A: bottomLeft / (topLeft + bottomLeft),
			A_notB: (bottomLeft * left) / (bottomLeft * left + bottomRight * right),
			notA_B: (topRight * right) / (topLeft * left + topRight * right),
			notA_notB: (bottomRight * right) / (bottomLeft * left + bottomRight * right),
			B_notA: topRight / (topRight + bottomRight),
			notB_notA: bottomRight / (topRight + bottomRight)
		});
	});

	return {
		elements: {
			root,
			panel,
			box,
			verticalTrigger,
			horizontalTrigger
		},
		states: {
			ratios,
			probabilities,
			showA,
			showTopLeftProbs,
			showBottomLeftProbs,
			showTopRightProbs,
			showBottomRightProbs,
			showPanelProbs,
			showLeftPanel,
			showRightPanel
		},
		options
	};
}
