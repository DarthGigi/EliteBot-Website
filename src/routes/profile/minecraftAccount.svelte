<script lang="ts">
	import { enhance } from '$app/forms';
	import CopyToClipboard from '$comp/copy-to-clipboard.svelte';
	import PlayerHead from '$comp/sidebar/player-head.svelte';
	import type { components } from '$lib/api/api';
	import { Button } from '$ui/button';
	import * as Popover from '$ui/popover';
	import Star from '@lucide/svelte/icons/star';

	interface Props {
		mc?: Partial<components['schemas']['MinecraftAccountDetailsDto']>;
	}

	let { mc = {} }: Props = $props();
	let loading = $state(false);
</script>

<div class="bg-card flex flex-col rounded-md p-4">
	<div class="flex flex-row items-center justify-between gap-2">
		<div class="flex flex-row items-center gap-4">
			<PlayerHead uuid={mc.id} size="2xl" />
			<h1 class="font-mono text-xl font-semibold">{mc.name}</h1>

			{#if mc.primaryAccount}
				<Popover.Mobile>
					{#snippet trigger()}
						<Star size={16} class="text-completed fill-current" />
					{/snippet}
					<p class="font-semibold">Primary Account</p>
					<div class="pt-2">
						<p>All Elite features will show stats of this account by default.</p>
					</div>
				</Popover.Mobile>
			{/if}
		</div>

		<Button href="/@{mc.name}" size="sm" variant="outline">Stats</Button>
	</div>
	<div class="flex flex-wrap items-baseline justify-between gap-2">
		<div class="flex flex-row items-center gap-1 leading-none">
			<p class="text-muted-foreground text-xs sm:text-sm">{mc.id}</p>
			<CopyToClipboard text={mc.id} size="sm" />
		</div>
		{#if !mc.primaryAccount}
			<form
				method="POST"
				action="?/setPrimary"
				use:enhance={() => {
					loading = true;
					return async ({ result, update }) => {
						if (result) loading = false;
						update();
					};
				}}
			>
				<input type="hidden" name="username" value={mc.id} />
				<button disabled={loading} class="text-muted-foreground text-sm whitespace-nowrap underline"
					>Set As Primary</button
				>
			</form>
		{/if}
	</div>
</div>
