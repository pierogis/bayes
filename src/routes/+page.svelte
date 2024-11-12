<script lang="ts">
	import './style.css';

	import { Panel, Box, HorizontalBar, VerticalBar } from '$lib';

	let grabbingLeft = $state(false);
	let grabbingMiddle = $state(false);
	let grabbingRight = $state(false);

	let showLeftPanel = $state(false);
	let showRightPanel = $state(false);

	let showA = $state(true);

	let showLeftProbs = $state(false);
	let showPanelProbs = $state(false);
	let showRightProbs = $state(false);

	type Props = {
		left?: number;
		right?: number;
		topLeft?: number;
		bottomLeft?: number;
		topRight?: number;
		bottomRight?: number;
	};

	let {
		left = 0.6,
		right = 0.4,
		topLeft = 0.7,
		bottomLeft = 0.3,
		topRight = 0.2,
		bottomRight = 0.8
	}: Props = $props();

	let A = $derived(left / (left + right));
	let notA = $derived(right / (left + right));
	let A_B = $derived((topLeft * left) / (topLeft * left + topRight * right));
	let B_A = $derived(topLeft / (topLeft + bottomLeft));
	let notB_A = $derived(bottomLeft / (topLeft + bottomLeft));
	let A_notB = $derived((bottomLeft * left) / (bottomLeft * left + bottomRight * right));
	let notA_B = $derived((topRight * right) / (topLeft * left + topRight * right));
	let notA_notB = $derived((bottomRight * right) / (bottomLeft * left + bottomRight * right));
	let B_notA = $derived(topRight / (topRight + bottomRight));
	let notB_notA = $derived(bottomRight / (topRight + bottomRight));
</script>

<svelte:head>
	<title>bayes</title>
</svelte:head>

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
			grabbingOther={grabbingMiddle || grabbingRight}
			bind:grabbing={grabbingLeft}
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
		grabbingOther={grabbingLeft || grabbingRight}
		bind:grabbing={grabbingMiddle}
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
			grabbingOther={grabbingLeft || grabbingMiddle}
			bind:grabbing={grabbingRight}
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
