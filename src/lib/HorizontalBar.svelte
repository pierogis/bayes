<script lang="ts">
	import type { Action } from 'svelte/action';

	interface Props {
		grabbingOther: boolean;
		grabbing: boolean;
		topFlex: number;
		bottomFlex: number;
		showA: boolean;
		showPanel: boolean;
		showProbs: boolean;
		bg: string;
	}

	let {
		grabbingOther,
		grabbing = $bindable(false),
		topFlex = $bindable(),
		bottomFlex = $bindable(),
		showA = $bindable(),
		showPanel = $bindable(),
		showProbs = $bindable(),
		bg
	}: Props = $props();

	const horizontalBarAction: Action<HTMLButtonElement> = (node) => {
		const pointerEnter = (e: PointerEvent) => {
			if (!grabbingOther) {
				console.log('pointer enter');
				showA = false;
				showPanel = true;
			}
		};
		const pointerLeave = async (e: PointerEvent) => {
			if (!grabbing && !grabbingOther) {
				console.log('pointer leave');
				showPanel = false;
				showA = true;
			}
		};

		const pointerDown = async (e: PointerEvent) => {
			if (!grabbingOther) {
				console.log('pointer down');
				showPanel = true;
				showProbs = true;
				showA = false;

				grabbing = true;
			}
		};
		const pointerMove = (e: PointerEvent) => {
			if (grabbing && !grabbingOther) {
				const a = e.pageY - node.offsetHeight / 2;
				const b = window.innerHeight - (e.pageY + node.offsetHeight / 2);

				topFlex = a / (a + b);
				bottomFlex = b / (a + b);
			}
		};
		const pointerUp = async () => {
			if (grabbing && !grabbingOther) {
				console.log('pointer up');
				showProbs = false;

				grabbing = false;
			}
		};

		node.addEventListener('pointerenter', pointerEnter);
		node.addEventListener('pointerdown', pointerDown);
		window.addEventListener('pointerup', pointerUp);
		window.addEventListener('pointermove', pointerMove);
		node.addEventListener('pointerleave', pointerLeave);

		return {
			destroy: () => {
				node.removeEventListener('pointerenter', pointerEnter);
				node.removeEventListener('pointerdown', pointerDown);
				window.removeEventListener('pointerup', pointerUp);
				window.removeEventListener('pointermove', pointerMove);
				node.removeEventListener('pointerleave', pointerLeave);
			}
		};
	};
</script>

<button
	use:horizontalBarAction
	style:background-color={bg}
	aria-label="Adjust conditional probability ratio"
></button>

<style>
	button {
		border: none;
		padding: 10px;
		cursor: row-resize;

		transition: opacity 200ms;
	}
	button:hover {
		opacity: 0.5;
	}
</style>
