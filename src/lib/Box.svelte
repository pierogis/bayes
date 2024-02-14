<script lang="ts">
	export let defaultFlex: number;
</script>

<div class="box" style:flex={defaultFlex}>
	<slot name="a" />
	<slot name="b" />
</div>

<style>
	.box {
		display: flex;
		justify-content: center;
	}

	.box > .a {
		flex: 1;
	}

	.box > .b {
		flex: 0;
	}

	.prob-statement {
		display: flex;
		justify-content: center;
		align-items: center;

		background-color: var(--bg);
	}

	.box .probability {
		display: none;
	}

	.box:hover .probability {
		display: inline;
	}

	.box:hover .statement {
		display: none;
	}
</style>
