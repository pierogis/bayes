<script lang="ts">
	import { Viz } from '$lib';

	const defaultFlex = {
		left: 0.6,
		right: 0.4,
		topLeft: 0.7,
		bottomLeft: 0.3,
		topRight: 0.2,
		bottomRight: 0.8
	};
</script>

<svelte:head>
	<title>bayes' visualizer</title>
</svelte:head>

<Viz {defaultFlex}></Viz>
