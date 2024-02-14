<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';

	export let topFlex: number;
	export let bottomFlex: number;

	const dispatch = createEventDispatcher();

	const horizontalBarAction = (node: HTMLDivElement) => {
		const pointerEnterLeft = () => {
			dispatch('pointerenter');

			node.addEventListener('pointerdown', pointerDownLeft);
			node.addEventListener('pointerleave', pointerLeaveLeft);
		};
		const pointerLeaveLeft = async () => {
			dispatch('pointerleave');

			node.addEventListener('pointerenter', pointerEnterLeft);
		};

		const calcProbs = () => {};

		const pointerDownLeft = async () => {
			dispatch('pointerdown');

			node.removeEventListener('pointerenter', pointerEnterLeft);
			node.removeEventListener('pointerleave', pointerLeaveLeft);
			window.addEventListener('pointermove', pointerMoveLeft);
			window.addEventListener('pointerup', pointerUpLeft);
		};
		const pointerMoveLeft = (e: PointerEvent) => {
			const a = e.pageY - node.offsetHeight / 2;
			const b = window.innerHeight - (e.pageY + node.offsetHeight / 2);

			topFlex = a / (a + b);
			bottomFlex = b / (a + b);

			dispatch('pointermove');
		};
		const pointerUpLeft = async () => {
			dispatch('pointerup');

			node.addEventListener('pointerleave', pointerLeaveLeft);
			window.removeEventListener('pointermove', pointerMoveLeft);
		};

		node.addEventListener('pointerenter', pointerEnterLeft);
	};
</script>

<div use:horizontalBarAction></div>

<style>
	div {
		padding: 10px;
		cursor: row-resize;
		background-color: var(--bg);
	}
</style>
