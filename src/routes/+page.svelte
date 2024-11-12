<script lang="ts">
	import './style.css';

	import { Panel, Box, HorizontalBar, VerticalBar } from '$lib';
	import { createVisualization } from '$lib/builder';

	const visualization = createVisualization();
	const {
		elements: { root, verticalTrigger, horizontalTrigger, panel, box },
		states: {
			ratios,
			probabilities,
			showA,
			showTopLeftProbs,
			showBottomLeftProbs,
			showTopRightProbs,
			showBottomRightProbs,
			showPanelProbs,
			showLeftPanel,
			showRightPanel
		}
	} = createVisualization();
</script>

<svelte:head>
	<title>bayes</title>
</svelte:head>

<div {...$root} use:root>
	<Panel
		{panel}
		position={{ x: 'left' }}
		bg="#F2B8C5"
		prob={$probabilities.A}
		statement="P(A)"
		flex={$ratios.left}
		showPanel={$showLeftPanel}
		showPanelProbs={$showPanelProbs}
	>
		<Box
			{box}
			position={{ x: 'left', y: 'top' }}
			a={{ prob: $probabilities.A_B, statement: 'P(A|B)', bg: '#8FC0A9' }}
			b={{ prob: $probabilities.B_A, statement: 'P(B|A)', bg: 'rgb(160,160,160)' }}
			showA={$showA}
			flex={$ratios.topLeft}
			showProbs={$showTopLeftProbs}
		></Box>

		<HorizontalBar trigger={horizontalTrigger} side="left" bg="rgb(180,180,180)" />

		<Box
			{box}
			position={{ x: 'left', y: 'bottom' }}
			a={{ prob: $probabilities.A_notB, statement: 'P(A|!B)', bg: '#EDB090' }}
			b={{ prob: $probabilities.notB_A, statement: 'P(!B|A)', bg: 'rgb(90,90,90)' }}
			showA={$showA}
			flex={$ratios.bottomLeft}
			showProbs={$showBottomLeftProbs}
		></Box>
	</Panel>

	<VerticalBar trigger={verticalTrigger} bg="#faf3dd" />

	<Panel
		{panel}
		position={{ x: 'right' }}
		bg="#8da8c8"
		prob={$probabilities.notA}
		statement="P(!A)"
		flex={$ratios.right}
		showPanel={$showRightPanel}
		showPanelProbs={$showPanelProbs}
	>
		<Box
			{box}
			position={{ x: 'right', y: 'top' }}
			a={{ prob: $probabilities.notA_B, statement: 'P(!A|B)', bg: '#7dbac0' }}
			b={{ prob: $probabilities.B_notA, statement: 'P(B|!A)', bg: 'rgb(180, 180, 180)' }}
			showA={$showA}
			flex={$ratios.topRight}
			showProbs={$showTopRightProbs}
		></Box>

		<HorizontalBar trigger={horizontalTrigger} side="right" bg="rgb(160, 160, 160)" />

		<Box
			{box}
			position={{ x: 'right', y: 'bottom' }}
			a={{ prob: $probabilities.notA_notB, statement: 'P(!A|!B)', bg: '#e49d9f' }}
			b={{ prob: $probabilities.notB_notA, statement: 'P(!B|!A)', bg: 'rgb(130, 130, 130)' }}
			showA={$showA}
			flex={$ratios.bottomRight}
			showProbs={$showBottomRightProbs}
		></Box>
	</Panel>
</div>

<style>
	div {
		display: flex;
		width: 100%;
		min-height: 100vh;
	}
</style>
