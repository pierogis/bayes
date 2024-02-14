<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let leftFlex: number;
	export let rightFlex: number;

	const dispatch = createEventDispatcher();

	const midBarAction = (node: HTMLDivElement) => {
		const pointerEnterMid = () => {
			dispatch('pointerenter');

			node.addEventListener('pointerdown', pointerDownMid);
			node.addEventListener('pointerleave', pointerLeaveMid);
			node.removeEventListener('pointerenter', pointerEnterMid);
		};
		const pointerLeaveMid = () => {
			dispatch('pointerleave');

			node.addEventListener('pointerenter', pointerEnterMid);
			node.removeEventListener('pointerleave', pointerLeaveMid);
		};

		const pointerDownMid = () => {
			dispatch('pointerdown');

			node.removeEventListener('pointerenter', pointerEnterMid);
			node.removeEventListener('pointerleave', pointerLeaveMid);
			window.addEventListener('pointermove', pointerMoveMid);
			window.addEventListener('pointerup', pointerUpMid);
		};
		const pointerMoveMid = (e: PointerEvent) => {
			const a = e.pageX - node.offsetWidth / 2;
			const b = window.innerWidth - (e.pageX + node.offsetWidth / 2);

			leftFlex = a / (a + b);
			rightFlex = b / (a + b);

			dispatch('pointermove');
		};
		const pointerUpMid = () => {
			dispatch('pointerup');

			node.addEventListener('pointerleave', pointerLeaveMid);
			window.removeEventListener('pointermove', pointerMoveMid);
		};

		node.addEventListener('pointerenter', pointerEnterMid);
	};
</script>

<div use:midBarAction></div>

<style>
	div {
		padding: 10px;
		cursor: col-resize;
		background-color: var(--bg);
	}
</style>
