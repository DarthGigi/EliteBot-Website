<script lang="ts">
	import * as Dialog from '$ui/dialog';
	import type { FortuneSourceProgress } from 'farming-weight';
	import FortuneProgress from './fortune-progress.svelte';
	import ItemProgress from './item-progress.svelte';

	interface Props {
		name: string;
		progress: FortuneSourceProgress[];
		children?: import('svelte').Snippet;
	}

	let { name, progress, children }: Props = $props();

	let progressModal = $state(false);
	let shownProgress = $state<FortuneSourceProgress | undefined>(undefined);
</script>

<div class="flex flex-1 basis-64 flex-col justify-center gap-2">
	<div class="mx-1 flex w-full max-w-lg flex-1 flex-col gap-2">
		<div class="flex flex-row items-center gap-1">
			{@render children?.()}
			<h2 class="pl-1 text-xl">{name}</h2>
		</div>
		<div class="flex w-full max-w-lg flex-1 flex-col gap-1.5">
			{#each progress as p (p.name + p.fortune + (p.item?.uuid ?? ''))}
				{#if p.nextInfo || p.maxInfo || p.progress?.length || p.item}
					<button
						class="bg-card hover:bg-card/40 cursor-pointer rounded-md border px-1"
						onclick={() => {
							shownProgress = p;
							progressModal = true;
						}}
					>
						<FortuneProgress progress={p} />
					</button>
				{:else}
					<div class="border border-transparent px-1">
						<FortuneProgress progress={p} />
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>

<Dialog.Root bind:open={progressModal}>
	<Dialog.ScrollContent>
		<Dialog.Title>{shownProgress?.name}</Dialog.Title>
		{#if shownProgress}
			<ItemProgress progress={shownProgress} />
		{/if}
	</Dialog.ScrollContent>
</Dialog.Root>
