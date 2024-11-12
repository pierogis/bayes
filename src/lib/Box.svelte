<script lang="ts">
	import type { Action } from 'svelte/action';

	import type { Visualization } from './builder';

	type Props = {
		box: Visualization['elements']['box'];
		position: { x: 'left' | 'right'; y: 'top' | 'bottom' };

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

	let { box, position, flex, showA, a, b, showProbs }: Props = $props();
</script>

<div {...$box(position)} use:box class="box" style:flex>
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
