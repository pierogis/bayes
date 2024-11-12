<script lang="ts">
	import type { Action } from 'svelte/action';

	interface Props {
		grabbingOther: boolean;
		grabbing: boolean;
		leftFlex: number;
		rightFlex: number;
		showPanelProbs: boolean;
		showLeftPanel: boolean;
		showRightPanel: boolean;
		bg: string;
	}

	let {
		grabbingOther,
		grabbing = $bindable(false),
		leftFlex = $bindable(),
		rightFlex = $bindable(),
		showPanelProbs = $bindable(),
		showLeftPanel = $bindable(),
		showRightPanel = $bindable(),
		bg
	}: Props = $props();

	const midBarAction: Action<HTMLButtonElement> = (node) => {
		const pointerEnter = () => {
			if (!grabbingOther) {
				showLeftPanel = true;
				showRightPanel = true;
			}
		};
		const pointerLeave = () => {
			if (!grabbing) {
				showLeftPanel = false;
				showRightPanel = false;
			}
		};
		const pointerDown = () => {
			if (!grabbingOther) {
				showLeftPanel = true;
				showRightPanel = true;
				showPanelProbs = true;

				grabbing = true;
			}
		};
		const pointerMove = (e: PointerEvent) => {
			if (grabbing && !grabbingOther) {
				const a = e.pageX - node.offsetWidth / 2;
				const b = window.innerWidth - (e.pageX + node.offsetWidth / 2);

				leftFlex = a / (a + b);
				rightFlex = b / (a + b);
			}
		};
		const pointerUp = () => {
			if (grabbing && !grabbingOther) {
				showPanelProbs = false;

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

<button use:midBarAction style:background-color={bg} aria-label="Adjust A and !A ratio"></button>

<style>
	button {
		border: none;
		padding: 10px;
		cursor: col-resize;

		transition: opacity 200ms;
	}
	button:hover {
		opacity: 0.5;
	}
</style>
