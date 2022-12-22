<script context="module" lang="ts">
	type Message = {
		app: 'clappy-button';
		instanceId: string;
	}

	export type PostMessage = Message & ({
		event: 'loading';
		eventData: { amount: number };
	} | {
		event: 'clap';
		eventData: { amount: number };
	});

	export type ReceiveMessage = Message & {
		event: 'success' | 'fail'
	}
</script>