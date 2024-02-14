<script lang="ts">
	export let probability: string;
	export let statement: string;
</script>

<div>
	<span class="probability">{probability}</span>
	<span class="statement">{statement}</span>
</div>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;

		background-color: var(--bg);
	}

	span {
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none;
		padding: 0 10px;
	}
</style>
