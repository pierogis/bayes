<script lang="ts">
	import type { Action } from 'svelte/action';

	type Props = {
		flex: number;
		showA: boolean;
		a: {
			prob: number;
			statement: string;
			bg: string;
		};
		b: {
			prob: number;
			statement: string;
			bg: string;
		};
		showProbs: boolean;
	};

	let { flex, showA, a, b, showProbs }: Props = $props();

	const boxAction: Action<HTMLDivElement> = (node) => {
		const pointerEnter = () => {
			showProbs = true;
		};
		const pointerLeave = async () => {
			showProbs = false;
		};

		node.addEventListener('pointerenter', pointerEnter);
		node.addEventListener('pointerleave', pointerLeave);

		return {
			destroy: () => {
				node.removeEventListener('pointerenter', pointerEnter);
				node.removeEventListener('pointerleave', pointerLeave);
			}
		};
	};
</script>

<div use:boxAction class="box" style:flex>
	<div
		class="prob-statement"
		class:a={showA}
		class:b={!showA}
		style:--bg-a={a.bg}
		style:--bg-b={b.bg}
	>
		{#if showProbs}
			<span class="probability">{(100 * (showA ? a.prob : b.prob)).toFixed(2)}%</span>
		{:else}
			<span class="statement">{showA ? a.statement : b.statement}</span>
		{/if}
	</div>
</div>

<style>
	.box {
		display: flex;
		justify-content: center;
	}

	.prob-statement {
		flex: 1;

		display: flex;
		justify-content: center;
		align-items: center;

		transition: background-color 200ms 500ms;
	}

	.a {
		background-color: var(--bg-a);
	}

	.b {
		background-color: var(--bg-b);
	}
</style>
