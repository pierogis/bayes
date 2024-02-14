<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import MidBar from '$lib/MidBar.svelte';
	import { tick } from 'svelte';
	import HorizontalBar from '$lib/HorizontalBar.svelte';

	const _C = 1.4;
	const _P = 10;
	let r = 0.001;

	let left: HTMLElement;
	let right: HTMLElement;

	let leftPanelProb: HTMLElement;
	let rightPanelProb: HTMLElement;

	let midBar: HTMLElement;
	let leftBar: HTMLElement;
	let rightBar: HTMLElement;

	let topLeft: HTMLElement;
	let topRight: HTMLElement;
	let bottomLeft: HTMLElement;
	let bottomRight: HTMLElement;

	let topLeftProbA: HTMLElement;
	let topLeftProbB: HTMLElement;
	let topRightProbA: HTMLElement;
	let topRightProbB: HTMLElement;
	let bottomLeftProbA: HTMLElement;
	let bottomLeftProbB: HTMLElement;
	let bottomRightProbA: HTMLElement;
	let bottomRightProbB: HTMLElement;

	let showLeftPanel: boolean = false;
	let showRightPanel: boolean = false;

	let showLeftBar: boolean = true;
	let showRightBar: boolean = true;

	let showA = true;

	let showLeftProbs: boolean = false;
	let showPanelProbs: boolean = false;
	let showRightProbs: boolean = false;

	const p = {
		A: 0,
		A_B: 0,
		B_A: 0,
		A_notB: 0,
		notB_A: 0,
		notA: 0,
		notA_B: 0,
		B_notA: 0,
		notA_notB: 0,
		notB_notA: 0
	};

	// calculate and show the relative sizes of two divs
	function dragProbs(box1: HTMLElement, box2: HTMLElement) {
		const box1Space = box1.clientWidth * box1.clientHeight;
		const box2Space = box2.clientWidth * box2.clientHeight;
		const totalSpace = box1Space + box2Space;

		const box1Prob = (100 * box1Space) / totalSpace;
		const box2Prob = (100 * box2Space) / totalSpace;

		return {
			box1Prob,
			box2Prob
		};
	}

	// calculate the bayes results for all 4 prob boxes
	function releaseProbs() {
		const tlSpace = topLeft.clientWidth * topLeft.clientHeight;
		const blSpace = bottomLeft.clientWidth * bottomLeft.clientHeight;
		const trSpace = topRight.clientWidth * topRight.clientHeight;
		const brSpace = bottomRight.clientWidth * bottomRight.clientHeight;

		p.A_B = tlSpace / (tlSpace + blSpace);
		p.A_notB = blSpace / (tlSpace + blSpace);
		p.notA_B = trSpace / (trSpace + brSpace);
		p.notA_notB = brSpace / (trSpace + brSpace);
	}

	const calcLeft = () => {
		const { box1Prob, box2Prob } = dragProbs(topLeftProbB, bottomLeftProbB);
		p.B_A = box1Prob;
		p.notB_A = box2Prob;
	}
	const calcMid = () => {
		const { box1Prob, box2Prob } = dragProbs(leftPanelProb, rightPanelProb);
		p.A = box1Prob;
		p.notA = box2Prob;
	}
	const calcRight = () => {
		const { box1Prob, box2Prob } = dragProbs(topRightProbB, bottomRightProbB);

		p.B_notA = box1Prob;
		p.notB_notA = box2Prob;
	}

	let leftFlex = 0.6;
	let rightFlex = 0.4;

	let topLeftFlex = 0.7;
	let bottomLeftFlex = 0.3;
	let topRightFlex = 0.2;
	let bottomRightFlex = 0.8;
</script>

<svelte:head>
	<title>bayes' visualizer</title>
</svelte:head>

<div class="drag-container">
	<div class="panel left" bind:this={left} style:flex={leftFlex}>
		{#if showLeftPanel}
			<div class="panel-probability" transition:slide bind:this={leftPanelProb}>
				{#if showPanelProbs}
					<span class="probability">{p.A.toFixed(2)}%</span>
				{:else}
					<span class="statement">P(A)</span>
				{/if}
			</div>
		{:else}
			<div class="box tl" transition:slide bind:this={topLeft}>
				{#if showA}
					<div class="prob-statement a" bind:this={topLeftProbA}>
						{#if showLeftProbs}
							<span class="probability">{p.A_B.toFixed(2)}%</span>
						{:else}
							<span class="statement">P(A|B)</span>
						{/if}
					</div>
				{:else}
					<div class="prob-statement b" bind:this={topLeftProbB}>
						{#if showLeftProbs}
							<span class="probability">{p.B_A.toFixed(2)}%</span>
						{:else}
							<span class="statement">P(B|A)</span>
						{/if}
					</div>
				{/if}
			</div>

			{#if showLeftBar}
				<HorizontalBar
					bind:topFlex={topLeftFlex}
					bind:bottomFlex={bottomLeftFlex}
					on:pointerenter={() => {
						showRightPanel = true;
					}}
					on:pointerleave={async () => {
						showRightPanel = false;

						await tick();
						releaseProbs();
					}}
					on:pointerdown={async () => {
						showLeftProbs = true;
						showA = false;

						await tick();
						calcLeft()
					}}
					on:pointermove={async () => {
						await tick();
						calcLeft()
					}}
					on:pointerup={async () => {
						showLeftProbs = false;
						showA = true;
					}}
					--bg="rgb(180, 180, 180)"
				></HorizontalBar>
			{/if}

			<div class="box bl" transition:slide bind:this={bottomLeft}>
				{#if showA}
					<div class="prob-statement a" bind:this={bottomLeftProbA}>
						{#if showLeftProbs}
							<span class="probability">{p.A_notB.toFixed(2)}%</span>
						{:else}
							<span class="statement">P(A|!B)</span>
						{/if}
					</div>
				{:else}
					<div class="prob-statement b" bind:this={bottomLeftProbB}>
						{#if showLeftProbs}
							<span class="probability">{p.notB_A.toFixed(2)}%</span>
						{:else}
							<span class="statement">P(!B|A)</span>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<MidBar
		bind:leftFlex
		bind:rightFlex
		on:pointerenter={() => {
			showLeftPanel = true;
			showRightPanel = true;
		}}
		on:pointerleave={async () => {
			showLeftPanel = false;
			showRightPanel = false;
			await tick();
			releaseProbs();
		}}
		on:pointerdown={async () => {
			showPanelProbs = true;

			await tick();
			calcMid()
		}}
		on:pointermove={async () => {
			await tick();
			calcMid()
		}}
		on:pointerup={async () => {
			showPanelProbs = false;
		}}
		--bg="#faf3dd"
	/>

	<div class="panel right" bind:this={right} style:flex={rightFlex}>
		{#if !showRightPanel}
			<div class="box tr" transition:slide bind:this={topRight}>
				{#if showA}
					<div class="prob-statement a" bind:this={topRightProbA}>
						{#if showRightProbs}
							<span class="probability">{p.notA_B.toFixed(2)}%</span>
						{:else}
							<span class="statement">P(!A|B)</span>
						{/if}
					</div>
				{:else}
					<div class="prob-statement b" bind:this={topRightProbB}>
						{#if showRightProbs}
							<span class="probability">{p.B_notA.toFixed(2)}%</span>
						{:else}
							<span class="statement">P(B|!A)</span>
						{/if}
					</div>
				{/if}
			</div>

			{#if showRightBar}
				<HorizontalBar
					bind:topFlex={topRightFlex}
					bind:bottomFlex={bottomRightFlex}
					on:pointerenter={() => {
						showLeftPanel = true;
					}}
					on:pointerleave={async () => {
						showLeftPanel = false;

						await tick();
						releaseProbs();
					}}
					on:pointerdown={async () => {
						showRightProbs = true;
						showA = false;

						await tick();
						calcRight()
					}}
					on:pointermove={async () => {
						await tick();
						calcRight()
					}}
					on:pointerup={async () => {
						showRightProbs = false;
						showA = true;
					}}
					--bg="rgb(160, 160, 160)"
				></HorizontalBar>
			{/if}

			<div class="box br" transition:slide bind:this={bottomRight}>
				{#if showA}
					<div class="prob-statement a" bind:this={bottomRightProbA}>
						{#if showRightProbs}
							<span class="probability">{p.notA_notB.toFixed(2)}%</span>
						{:else}
							<span class="statement">P(!A|!B)</span>
						{/if}
					</div>
				{:else}
					<div class="prob-statement b" bind:this={bottomRightProbB}>
						{#if showRightProbs}
							<span class="probability">{p.notB_notA.toFixed(2)}%</span>
						{:else}
							<span class="statement">P(!B|!A)</span>
						{/if}
					</div>
				{/if}
			</div>
		{:else}
			<div class="panel-probability" transition:slide bind:this={rightPanelProb}>
				{#if showPanelProbs}
					<span class="probability">{p.notA.toFixed(2)}%</span>
				{:else}
					<span class="statement">P(!A)</span>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.drag-container {
		display: flex;
		width: 100%;
		min-height: 100vh;
	}

	.panel {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.panel.left {
		background-color: #f2b8c5;
	}

	.panel.right {
		background-color: #8da8c8;
	}

	.panel-probability {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.box {
		display: flex;
		justify-content: center;
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

	.box.tl > .a {
		background-color: #8fc0a9;
	}

	.box.tr > .a {
		background-color: #7dbac0;
	}

	.box.bl > .a {
		background-color: #edb090;
	}

	.box.br > .a {
		background-color: #e49d9f;
	}

	.box.tl > .b {
		background-color: rgb(160, 160, 160);
	}

	.box.tr > .b {
		background-color: rgb(180, 180, 180);
	}

	.box.bl > .b {
		background-color: rgb(90, 90, 90);
	}

	.box.br > .b {
		background-color: rgb(130, 130, 130);
	}

	.statement,
	.probability {
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none;
		padding: 0 10px;
	}
</style>
