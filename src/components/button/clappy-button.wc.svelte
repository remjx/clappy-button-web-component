<svelte:options tag="clappy-button" />

<script lang="ts">
	import { onMount, tick } from 'svelte';
	import gsap from 'gsap';
	import fitty from 'fitty';
	import HandPath from '../../assets/svg/hand.svelte';
	import HandNoisePaths from '../../assets/svg/hand-noise.svelte';
	import Confetti from '../../assets/svg/confetti.svelte';

	// TODO: Export types
	type Message = {
		app: 'clappy-button';
		instanceId: string;
	}

	type PostMessage = Message & ({
		event: 'loading';
		eventData: { amount: number };
	} | {
		event: 'clap';
		eventData: { amount: number };
	});

	type ReceiveMessage = Message & {
		event: 'success' | 'fail'
	}

	export let instanceid: string;
	export let amountperclap: string;
	export let currencycode: string;
	export let currencysymbol: string;
	export let theme: string | undefined;
	let parsedAmountPerClap: number;
	$: parsedAmountPerClap = Number(amountperclap);

	let amount = 0;

	const tipCountContainerInitialScale = 0.8;
	const handDur = 0.5;
	const loaderDur = 5.5;
	const loaderSegDur = (loaderDur / 12) * 0.75;
	const debounceDur = 2;
	const wiggleEase: gsap.EaseFunction = (x) =>
		(-0.031 / (-0.3 + x)) * Math.sin((3.1418 / 0.1) * x); // https://www.desmos.com/calculator/dymuryumyw
	gsap.registerEase('wiggle', wiggleEase);
	const confettiTranslates = [
		{ x: 0, y: -36 },
		{ x: -34, y: -11 },
		{ x: -22, y: 29 },
		{ x: 22, y: 29 },
		{ x: 34, y: -11 },
	];
	const confettiDur = 0.4;

	let button: SVGGElement;
	let loader: SVGGElement;
	let hands: SVGGElement;
	let border: SVGPathElement;
	let inner: SVGGElement;
	let noise: SVGGElement;
	let success: SVGPathElement;
	let tipCount: HTMLSpanElement;
	let tipCountContainer: HTMLDivElement;
	let tipSection: HTMLDivElement;
	let innerPaths: NodeListOf<SVGPathElement>;
	let confetti: SVGGElement;
	let confettiGs: NodeListOf<SVGGElement>;
	let tipBtn: HTMLButtonElement;
	let btnCircle: HTMLDivElement;

	let canClap: boolean;

	const clapAmountFormatter = () => {
		const amt = new Intl.NumberFormat(undefined, {
			minimumFractionDigits: amount < 1 ? 2 : undefined,
		}).format(amount);
		if (currencysymbol) return '+' + currencysymbol + amt;
		return '+' + amt + ` ${currencycode}`;
	};

	onMount(async () => {
		function handleWindowMessage (event: MessageEvent<ReceiveMessage>) {
			if (
				event.data.app === 'clappy-button' &&
				event.data.instanceId === instanceid
			) {
				if (event.data.event === 'success') {
					successAnimation();
				} else if (event.data.event === 'fail') {
					failAnimation();
				}
			}
		}
		await tick();
		initializeAnimation();
		canClap = true;
		window.addEventListener('message', handleWindowMessage);
		return () => {
			window.removeEventListener("message", handleWindowMessage);
		}
	});

	let confettiTL = gsap.timeline({ paused: true });
	let loaderTL = gsap.timeline({
		paused: true,
		repeat: -1,
	});
	let counterTLMovement = gsap.timeline({ paused: true });
	let handTL = gsap.timeline({ paused: true });
	let circlePulseTL = gsap.timeline({ repeat: -1 });
	let mouseDownCallback: gsap.core.Tween;

	function initializeHandAnimation() {
		handTL
			.to(hands, {
				scale: 1.05,
				transformOrigin: '20% 70%',
				duration: (handDur * 3) / 5,
				ease: 'power2',
			})
			.to(hands, {
				scale: 1,
				transformOrigin: '20% 70%',
				duration: (handDur * 1) / 5,
				ease: 'power',
			})
			.to(
				noise,
				{
					opacity: 0,
					duration: handDur,
					ease: 'circ',
				},
				0
			);
		handTL.to(noise, { opacity: 1, duration: handDur / 4 });
	}

	function initializeCounterAnimation() {
		const tipAppearDur = 0.2;
		const tipDisappearDur = 0.4;
		const tipDisappearStart = debounceDur - tipDisappearDur / 2;
		gsap.set(tipCountContainer, { opacity: 1 });
		counterTLMovement
			.from(tipCountContainer, {
				y: '40%',
				opacity: 0,
				duration: tipAppearDur,
			})
			.add('mid')
			.to(
				tipCountContainer,
				{
					y: '-60%',
					opacity: 0,
					duration: tipDisappearDur,
					onComplete: onTipDisappear,
				},
				tipDisappearStart
			);
	}

	function initializeLoaderAnimation() {
		gsap.set([loader, border], { transformOrigin: '50% 50%' });
		loaderTL
			.to(loader, { rotate: 1440, duration: loaderDur, ease: 'none' })
			.to(
				border,
				{
					attr: {
						'stroke-dashoffset': 200,
					},
					duration: loaderSegDur,
					repeat: 3,
					repeatDelay: loaderSegDur * 3,
					ease: 'sine.inOut',
				},
				0
			)
			.to(
				border,
				{
					attr: {
						'stroke-dashoffset': 830,
					},
					duration: loaderSegDur,
					repeat: 3,
					repeatDelay: loaderSegDur * 3,
					ease: 'sine.inOut',
				},
				loaderSegDur * 2
			);
		for (let i = 0; i < 4; i++) {
			loaderTL.to(
				border,
				{
					rotate: (i + 1) * 270,
					duration: loaderSegDur,
					ease: 'sine.inOut',
				},
				i * loaderSegDur * 4 + loaderSegDur * 2
			);
		}
	}

	function initializeCirclePulseAnimation() {
		const duration = 1.4;
		circlePulseTL.to(btnCircle, {
			duration,
			transform: 'translate3d(-50%, -50%, -1px) scale(1.2)',
			ease: 'sine',
		});
		circlePulseTL.to(btnCircle, {
			duration,
			transform: 'translate3d(-50%, -50%, -1px) scale(1)',
			ease: 'sine',
		});
	}

	function initializeAnimation() {
		innerPaths = tipSection.querySelectorAll('#inner path');
		innerPaths?.forEach((innerPath) => {
			gsap.timeline({
				defaults: { overwrite: 'auto' },
			}).to(innerPath, { fill: 'var(--hand)' }, 0);
		});
		initializeConfetti();
		initializeLoaderAnimation();
		initializeCounterAnimation();
		initializeHandAnimation();
		initializeCirclePulseAnimation();
		startCircleBtnPulseAnimation();
	}

	function handAnimation() {
		handTL.restart();
	}

	function startCircleBtnPulseAnimation() {
		circlePulseTL.play();
		gsap.to(btnCircle, {
			opacity: 1,
		});
	}

	function stopCircleBtnPulseAnimation() {
		circlePulseTL.pause();
		gsap.to(btnCircle, {
			transform: 'translate3d(-50%, -50%, -1px) scale(1)',
		});
	}

	goToIdleAnimation();

	function startLoadingAnimation() {
		canClap = false;
		stopCircleBtnPulseAnimation();
		loaderTL.play();
		gsap.to(loader, { autoAlpha: 1, overwrite: 'auto', duration: 0.4 });
		innerPaths.forEach((innerPath) => {
			gsap.to(innerPath, { fill: 'var(--loading)' });
		});
		gsap.to(border, { stroke: 'var(--loading)' });
		gsap.to(btnCircle, {
			opacity: 0,
		});
	}

	function stopLoadingAnimation() {
		loaderTL.pause();
		gsap.to(border, {
			attr: {
				'stroke-dashoffset': 0,
			},
			duration: 0.3,
			ease: 'sine.in',
		});
		gsap.to(btnCircle, {
			opacity: 0,
		});
	}

	function successAnimation(): void {
		stopLoadingAnimation();
		gsap.timeline({
			defaults: { overwrite: 'auto' },
			onComplete: reset,
		})
			.to(inner, { opacity: 0 })
			.to(border, { stroke: 'var(--success)' }, 0)
			.fromTo(success, { opacity: 0 }, { opacity: 1, duration: 0.1 })
			.fromTo(
				success,
				{ 'stroke-dashoffset': success.getTotalLength() },
				{ 'stroke-dashoffset': 0 },
				'<'
			);
	}

	function failAnimation() {
		stopLoadingAnimation();
		gsap.timeline({
			defaults: { overwrite: 'auto' },
		})
			.to(border, { stroke: 'var(--fail)' }, 0)
			.to(
				button,
				{
					x: 50,
					ease: 'wiggle',
					duration: 0.7,
					onComplete: reset,
				},
				0
			);

		innerPaths.forEach((innerPath) => {
			gsap.timeline({
				defaults: { overwrite: 'auto' },
			}).to(innerPath, { fill: 'var(--fail)' });
		});
	}

	function reset(delay: number = 1500) {
		setTimeout(() => {
			amount = 0;
			goToIdleAnimation();
		}, delay);
	}

	function goToIdleAnimation() {
		canClap = true;
		startCircleBtnPulseAnimation();
		innerPaths?.forEach((innerPath) => {
			gsap.timeline({
				defaults: { overwrite: 'auto' },
			}).to(innerPath, { fill: 'var(--hand)' }, 0);
		});
		gsap.timeline({
			defaults: { overwrite: 'auto' },
		})
			.to(inner, { opacity: 1 })
			.to(border, { stroke: 'var(--hand)' }, 0)
			.to(success, { opacity: 0 }, 0)
			.to(
				loader,
				{
					autoAlpha: 0,
					overwrite: 'auto',
					duration: 0.2,
					onComplete: () => {
						loaderTL.progress(0);
					},
				},
				0
			);
	}

	function initializeConfetti() {
		confettiGs = confetti.querySelectorAll('g');
		confettiGs.forEach((_g, i) => {
			const c = confetti.querySelector(`#c${i}`);
			confettiTL
				.to(
					c,
					{
						x: confettiTranslates[i].x,
						y: confettiTranslates[i].y,
						duration: confettiDur,
						ease: 'sine',
					},
					0
				)
				.to(
					c,
					{
						opacity: 1,
						duration: (confettiDur * 1) / 5,
					},
					0
				)
				.to(
					c,
					{
						opacity: 0,
						duration: (confettiDur * 4) / 5,
					},
					(confettiDur * 1) / 5
				);
		});
	}

	function confettiAnimation() {
		gsap.set(confetti, {
			rotation: 'random(-36, 36)',
			transformOrigin: 'center center',
		});
		confettiTL.restart();
	}

	function tipCountAnimation() {
		tipCount.innerText = clapAmountFormatter();
		fitty(tipCount);
		tipCount.setAttribute('aria-labelledby', amount + ' clicks');
		if (!counterTLMovement.isActive()) {
			counterTLMovement.restart();
		} else {
			counterTLMovement.seek('mid');
		}
		gsap.timeline()
			.from(tipCountContainer, {
				scale: 1,
				duration: 0.2,
				overwrite: 'auto',
			})
			.to(tipCountContainer, {
				scale: tipCountContainerInitialScale,
				duration: 0.2,
				ease: 'power1.in',
			});
	}

	function clapAnimation() {
		confettiAnimation();
		handAnimation();
		tipCountAnimation();
		stopCircleBtnPulseAnimation();
	}

	async function clap() {
		if (canClap) {
			amount += parsedAmountPerClap;
			window.navigator.vibrate && window.navigator.vibrate(10);
			clapAnimation();
			postMessage({
				app: 'clappy-button',
				event: 'clap',
				instanceId: instanceid,
				eventData: {
					amount: amount,
				}
			});
		}
	}

	async function onTipDisappear() {
		startLoadingAnimation();
		postMessage({
			app: 'clappy-button',
			event: 'loading',
			instanceId: instanceid,
			eventData: {
				amount: amount,
			},
		});
	}

	function loopedClick() {
		mouseDownCallback = gsap.delayedCall(0.4, () => {
			clap();
			loopedClick();
		});
	}

	function resetLoopedClick() {
		if (mouseDownCallback) mouseDownCallback.kill();
	}

	function handleMouseDown() {
		resetLoopedClick();
		loopedClick();
	}

	function postMessage(message: PostMessage) {
		window.parent.postMessage(message, '*');
	}
</script>

<div
	id="tipSection"
	bind:this={tipSection}
	data-theme={theme === 'dark' || theme === 'light' ? theme : undefined}
	part="custom-theme"
>
	<div
		id="tipCountContainer"
		class="fitty-container prevent-blue-highlight"
		bind:this={tipCountContainer}
		style="opacity: 0; z-index: {amount > 0
			? '1'
			: '0'}; visibility: {amount > 0 ? 'visible' : 'hidden'};"
	>
		<span id="tipCount" bind:this={tipCount} />
	</div>
	<button
		id="tipBtn"
		title={amountperclap && currencycode
			? `${amountperclap} ${currencycode} per clap`
			: undefined}
		class="prevent-blue-highlight"
		bind:this={tipBtn}
		style={`cursor: ${canClap ? 'pointer' : 'none'};`}
		on:click={clap}
		on:mousedown={handleMouseDown}
		on:mouseup={resetLoopedClick}
		on:mouseleave={resetLoopedClick}
		on:touchstart={handleMouseDown}
		on:touchend={resetLoopedClick}
	>
		<div id="btn-circle" bind:this={btnCircle} />
		<svg
			id="tipSVG"
			viewBox="0 0 468 468"
			xmlns="http://www.w3.org/2000/svg"
			focusable="false"
		>
			<g id="confetti" bind:this={confetti}>
				<Confetti />
			</g>

			<g id="button" bind:this={button}>
				<g id="main">
					<g id="loader" style="opacity: 0" bind:this={loader}>
						<path
							id="border"
							d="M377.169 256C377.169 336.094 312.423 401 232.584 401C152.746 401 88 336.094 88 256C88 175.906 152.746 111 232.584 111C312.423 111 377.169 175.906 377.169 256Z"
							stroke="var(--loading)"
							fill="var(--loading-background)"
							stroke-width="10"
							stroke-linecap="round"
							stroke-dasharray="909.884"
							stroke-dashoffset="830"
							bind:this={border}
						/>
					</g>

					<g id="inner" bind:this={inner}>
						<g bind:this={hands} id="hands">
							<HandPath />
						</g>

						<g id="noise" bind:this={noise}>
							<HandNoisePaths />
						</g>
					</g>
				</g>
				<path
					id="success"
					d="M163.5 279L209.5 318L310 206.5"
					stroke="var(--success)"
					fill="none"
					stroke-width="30"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-dasharray="210.41583251953125"
					stroke-dashoffset="210.41583251953125"
					bind:this={success}
				/>
			</g>
		</svg>
	</button>
</div>

<style>
	#tipSection[data-theme='light'] {
		--background: #e6e6e6;
		--counter-background: #000;
		--counter-label: #fff;
		--confetti-primary: #2599ff;
		--confetti-secondary: #fdcb01;
		--hand: #000;
		--loading: #ababab;
		--loading-background: white;
		--success: #4bb543;
		--fail: #fc100d;
		--button-border: transparent;
	}

	#tipSection[data-theme='dark'] {
		--background: #000;
		--counter-background: #f2f2f2;
		--counter-label: #000;
		--confetti-primary: #00b5fc;
		--confetti-secondary: #fcfc00;
		--hand: #fff;
		--loading: #ababab;
		--loading-background: black;
		--success: #00e600;
		--fail: #ff0000;
		--button-border: #fff;
	}
	.prevent-blue-highlight {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
	}

	.fitty-container {
		white-space: nowrap;
		display: inline-block;
	}

	#tipSection {
		display: inline-block;
		position: relative;
	}

	#tipCountContainer {
		position: relative;
		left: 2px;
		top: 6px;
		width: 75px;
		height: 75px;
		border-radius: 50%;
		font-size: 20px;
		background-color: var(--counter-background);
		color: var(--counter-label);
		display: grid;
		pointer-events: none;
		margin-top: -45px;
	}

	#tipCount {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 0 5px;
		font-family: 'Open Sans', 'Noto Sans JP', sans-serif;
		text-align: center;
	}

	#tipBtn {
		border: none;
		outline: none;
		background-color: transparent;
		position: relative;
		z-index: 2;
		padding: 0px 0px;
		touch-action: none;
	}

	#btn-circle {
		background-color: var(--background);
		width: 50px;
		height: 50px;
		border-radius: 50%;
		position: absolute;
		z-index: -1;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, -1px) scale(1);
		transform-origin: center;
		border: 1px solid var(--button-border);
	}

	#tipSVG {
		width: 80px;
		overflow: visible;
		margin-top: -10px;
	}

	#tipBtn > * {
		vertical-align: middle;
	}
</style>
