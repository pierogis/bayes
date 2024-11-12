<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	import type { Visualization } from './builder';

	type Props = {
		panel: Visualization['elements']['panel'];
		position: { x: 'left' | 'right' };
		flex: number;
		prob: number;
		statement: string;
		bg: string;
		showPanel: boolean;
		showPanelProbs: boolean;
		children?: Snippet<[{ showA: boolean }]>;
	};

	let { panel, position, flex, prob, statement, bg, showPanel, showPanelProbs, children }: Props =
		$props();

	let showA = true;
</script>

<div {...$panel(position)} use:panel class="panel" style:flex style:--bg={bg}>
	{#if !showPanel}
		<div transition:fly={{ y: 0, duration: 500, delay: 500 }} class="panel-boxes">
			{@render children?.({ showA })}
		</div>
	{:else}
		<div transition:fly={{ y: 0, duration: 500, delay: 500 }} class="panel-probability">
			{#if showPanelProbs}
				<span class="probability">
					{(100 * prob).toFixed(2)}%
				</span>
			{:else}
				<span class="statement">{statement}</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.panel {
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: auto;
	}

	.panel-probability {
		grid-column: 1 / span 1;
		grid-row: 1 / span 1;

		display: flex;
		flex-direction: row-reverse;
		justify-content: center;
		align-items: center;
		background-color: var(--bg);
	}
	.panel-boxes {
		grid-column: 1 / span 1;
		grid-row: 1 / span 1;

		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.statement,
	.probability {
		user-select: none;
		padding: 0 10px;
	}
</style>
