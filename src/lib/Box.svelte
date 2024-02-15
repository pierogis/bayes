<script lang="ts">
	export let flex: number;
	export let showA: boolean;

	export let a: {
		prob: number;
		statement: string;
		bg: string;
	};
	export let b: {
		prob: number;
		statement: string;
		bg: string;
	};

	export let showProbs: boolean;
</script>

<div class="box" style:flex>
	{#if showA}
		<div class="prob-statement a" style:background-color={a.bg}>
			<span class="probability">{(100 * a.prob).toFixed(2)}%</span>
			<span class="statement">{a.statement}</span>
		</div>
	{:else}
		<div class="prob-statement b" style:background-color={b.bg}>
			<span class="probability" style:display={showProbs ? 'inline' : 'none'}>
				{(100 * b.prob).toFixed(2)}%
			</span>
			<span class="statement" style:display={showProbs ? 'none' : 'inline'}>{b.statement}</span>
		</div>
	{/if}
</div>

<style>
	.box {
		display: flex;
		justify-content: center;
	}

	.probability {
		display: none;
	}
	.statement {
		display: inline;
	}

	.box:hover > .prob-statement > .probability {
		display: inline;
	}
	.box:hover > .prob-statement > .statement {
		display: none;
	}

	.prob-statement {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.a,
	.b {
		flex: 1;
	}
</style>
