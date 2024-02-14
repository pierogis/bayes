<script>
	import ProbStatement from '$lib/ProbStatement.svelte';
	import Dragbar from '$lib/MidBar.svelte';
	import Panel from '$lib/Panel.svelte';
	import Box from '$lib/Box.svelte';
</script>

<div>
	<Panel>
		<Box defaultFlex={0.7}>
			<ProbStatement slot="a" --bg="#8fc0a9" probability={'1'} statement="P(A|B)" />
			<ProbStatement slot="b" --bg="rgb(160, 160, 160)" probability={'1'} statement="P(B|A)" />
		</Box>
		<Dragbar --bg="rgb(180, 180, 180)"></Dragbar>
		<Box defaultFlex={0.3}>
			<ProbStatement slot="a" --bg="#edb090" probability={'1'} statement="P(A|!B)" />
			<ProbStatement slot="b" --bg="rgb(90, 90, 90)" probability={'1'} statement="P(!B|A)" />
		</Box>
	</Panel>

	<Dragbar vertical --bg="#faf3dd"></Dragbar>

	<Panel>
		<Box defaultFlex={0.4}>
			<ProbStatement slot="a" --bg="#edb090" probability={'1'} statement="P(!A|B)" />
			<ProbStatement slot="b" --bg="rgb(180, 180, 180)" probability={'1'} statement="P(B|!A)" />
		</Box>
		<Dragbar --bg="rgb(160, 160, 160)"></Dragbar>
		<Box defaultFlex={0.6}>
			<ProbStatement slot="a" --bg="#e49d9f" probability={'1'} statement="P(!A|!B)" />
			<ProbStatement slot="b" --bg="rgb(130, 130, 130)" probability={'1'} statement="P(!B|!A)" />
		</Box>
	</Panel>
</div>

<style>
	div {
		display: flex;
		width: 100%;
		min-height: 100vh;
	}
</style>
