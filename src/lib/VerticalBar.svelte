<script lang="ts">
	export let leftFlex: number;
	export let rightFlex: number;
	export let showPanelProbs: boolean;
	export let showLeftPanel: boolean;
	export let showRightPanel: boolean;

	export let bg: string;

	const midBarAction = (node: HTMLDivElement) => {
		let hoverWait: ReturnType<typeof setTimeout>;
		const pointerEnter = () => {
			node.addEventListener('pointerdown', pointerDown);
			node.addEventListener('pointerleave', pointerLeave);
			node.removeEventListener('pointerenter', pointerEnter);

			hoverWait = setTimeout(() => {
				showLeftPanel = true;
				showRightPanel = true;
			}, 100);
		};
		const pointerLeave = () => {
			clearTimeout(hoverWait);

			showLeftPanel = false;
			showRightPanel = false;

			node.addEventListener('pointerenter', pointerEnter);
			node.removeEventListener('pointerleave', pointerLeave);
		};

		const pointerDown = () => {
			showLeftPanel = true;
			showRightPanel = true;
			showPanelProbs = true;

			node.removeEventListener('pointerenter', pointerEnter);
			node.removeEventListener('pointerleave', pointerLeave);
			window.addEventListener('pointermove', pointerMove);
			window.addEventListener('pointerup', pointerUp);
		};
		const pointerMove = (e: PointerEvent) => {
			const a = e.pageX - node.offsetWidth / 2;
			const b = window.innerWidth - (e.pageX + node.offsetWidth / 2);

			leftFlex = a / (a + b);
			rightFlex = b / (a + b);
		};
		const pointerUp = () => {
			showPanelProbs = false;

			node.addEventListener('pointerleave', pointerLeave);
			window.removeEventListener('pointermove', pointerMove);
		};

		node.addEventListener('pointerenter', pointerEnter);
	};
</script>

<div use:midBarAction style:background-color={bg}></div>

<style>
	div {
		padding: 10px;
		cursor: col-resize;
	}
</style>
