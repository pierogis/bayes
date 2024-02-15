<script lang="ts">
	export let flex: number;
	export let prob: number;
	export let statement: string;

	export let bg: string;

	export let showPanel: boolean;
	export let showPanelProbs: boolean;

	let showA = true;
</script>

<div class="panel right" style:flex style:--bg={bg}>
	{#if !showPanel}
		<slot {showA} />
	{:else}
		<div class="panel-probability">
			<span class="probability" style:display={showPanelProbs ? 'inline' : 'none'}>
				{(100 * prob).toFixed(2)}%
			</span>
			<span class="statement" style:display={showPanelProbs ? 'none' : 'inline'}>{statement}</span>
		</div>
	{/if}
</div>

<style>
	.panel {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.panel-probability {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--bg);
	}

	.probability {
		display: none;
	}
	.statement {
		display: inline;
	}

	.statement,
	.probability {
		user-select: none;
		padding: 0 10px;
	}
</style>
