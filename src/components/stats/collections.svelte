<script lang="ts">
	import { getStatsContext } from '$lib/stores/stats.svelte';
	import CollectionBar from './collectionbar.svelte';

	const ctx = getStatsContext();
	const collections = $derived(ctx.collections);
	const ranks = $derived(ctx.ranks);

	let weightSort = $state(true);

	let list = $derived.by(() => {
		return (
			(weightSort
				? collections?.toSorted((a, b) => b.weight - a.weight)
				: collections?.toSorted((a, b) => a.name?.localeCompare(b.name ?? '') ?? 0)) ?? []
		);
	});

	function swap() {
		weightSort = !weightSort;
	}
</script>

<div class="-mt-5 flex max-w-4xl flex-1 flex-col gap-2">
	<button class="bg-card hover:bg-muted -mt-4 w-20 rounded-md py-1 text-sm whitespace-nowrap" onclick={swap}
		>{weightSort ? 'Weight ↓' : 'A-Z ↓'}</button
	>
	<div class="flex w-full flex-col gap-2">
		{#each list as item (item.key)}
			<CollectionBar {...item} rank={ranks?.[item.key]?.rank} pestRank={ranks?.[item.pest]?.rank} />
		{/each}
	</div>
</div>
