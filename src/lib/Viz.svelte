<script lang="ts">
	import { Panel, VerticalBar, HorizontalBar, Box } from '$lib';

	let showLeftPanel = false;
	let showRightPanel = false;

	let showA = true;

	let showLeftProbs = false;
	let showPanelProbs = false;
	let showRightProbs = false;

	export let defaultFlex:
		| Partial<{
				left: number;
				right: number;
				topLeft: number;
				bottomLeft: number;
				topRight: number;
				bottomRight: number;
		  }>
		| undefined = undefined;

	let {
		left = 0.6,
		right = 0.4,
		topLeft = 0.7,
		bottomLeft = 0.3,
		topRight = 0.2,
		bottomRight = 0.8
	} = defaultFlex || {};

	$: A = left / (left + right);
	$: notA = right / (left + right);
	$: A_B = (topLeft * left) / (topLeft * left + topRight * right);
	$: B_A = topLeft / (topLeft + bottomLeft);
	$: notB_A = bottomLeft / (topLeft + bottomLeft);
	$: A_notB = (bottomLeft * left) / (bottomLeft * left + bottomRight * right);
	$: notA_B = (topRight * right) / (topLeft * left + topRight * right);
	$: notA_notB = (bottomRight * right) / (bottomLeft * left + bottomRight * right);
	$: B_notA = topRight / (topRight + bottomRight);
	$: notB_notA = bottomRight / (topRight + bottomRight);
</script>

<div>
	<Panel
		bg="#F2B8C5"
		prob={A}
		statement="P(A)"
		flex={left}
		showPanel={showLeftPanel}
		{showPanelProbs}
	>
		<Box
			a={{ prob: A_B, statement: 'P(A|B)', bg: '#8FC0A9' }}
			b={{ prob: B_A, statement: 'P(B|A)', bg: 'rgb(160,160,160)' }}
			{showA}
			flex={topLeft}
			showProbs={showLeftProbs}
		></Box>

		<HorizontalBar
			bind:topFlex={topLeft}
			bind:bottomFlex={bottomLeft}
			bind:showA
			bind:showPanel={showRightPanel}
			bind:showProbs={showLeftProbs}
			bg="rgb(180,180,180)"
		/>

		<Box
			a={{ prob: A_notB, statement: 'P(A|!B)', bg: '#EDB090' }}
			b={{ prob: notB_A, statement: 'P(!B|A)', bg: 'rgb(90,90,90)' }}
			flex={bottomLeft}
			{showA}
			showProbs={showLeftProbs}
		></Box>
	</Panel>

	<VerticalBar
		bind:leftFlex={left}
		bind:rightFlex={right}
		bind:showPanelProbs
		bind:showLeftPanel
		bind:showRightPanel
		bg="#faf3dd"
	/>

	<Panel
		bg="#8da8c8"
		prob={notA}
		statement="P(!A)"
		flex={right}
		showPanel={showRightPanel}
		{showPanelProbs}
	>
		<Box
			a={{ prob: notA_B, statement: 'P(!A|B)', bg: '#7dbac0' }}
			b={{ prob: B_notA, statement: 'P(B|!A)', bg: 'rgb(180, 180, 180)' }}
			{showA}
			flex={topRight}
			showProbs={showRightProbs}
		></Box>

		<HorizontalBar
			bind:topFlex={topRight}
			bind:bottomFlex={bottomRight}
			bind:showA
			bind:showPanel={showLeftPanel}
			bind:showProbs={showRightProbs}
			bg="rgb(160, 160, 160)"
		/>

		<Box
			a={{ prob: notA_notB, statement: 'P(!A|!B)', bg: '#e49d9f' }}
			b={{ prob: notB_notA, statement: 'P(!B|!A)', bg: 'rgb(130, 130, 130)' }}
			flex={bottomRight}
			{showA}
			showProbs={showRightProbs}
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
