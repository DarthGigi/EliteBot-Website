<script lang="ts">
	import Farmingtool from '$comp/items/tools/farmingtool.svelte';
	import { getStatsContext } from '$lib/stores/stats.svelte';
	import { Button } from '$ui/button';
	import {
		calcWeightForCrop,
		Crop,
		FarmingTool as FT,
		getCropMilestoneLevels,
		type EliteItemDto,
	} from 'farming-weight';
	import { watch } from 'runed';

	const ctx = getStatsContext();

	const garden = $derived(ctx.garden);
	let shown = $state(10 - (ctx.member.events?.length ?? 0));
	let currentShown = $state(10 - (ctx.member.events?.length ?? 0));

	let actualTools = $state<FT[]>([]);

	watch(
		() => ctx.tools,
		(tools) => {
			const options = {
				milestones: getCropMilestoneLevels(garden?.crops ?? {}),
			};

			actualTools = FT.fromArray(tools as EliteItemDto[], options).sort((a, b) => {
				return (
					calcWeightForCrop(b.crop ?? Crop.Wheat, b.farmed) -
					calcWeightForCrop(a.crop ?? Crop.Wheat, a.farmed)
				);
			});
		}
	);
</script>

{#if actualTools.length !== 0}
	<div class="flex flex-1 flex-col items-center gap-2">
		{#each actualTools.slice(0, currentShown) as tool, i (tool.item.uuid ?? i)}
			<Farmingtool {tool} />
		{/each}
		{#if currentShown < ctx.tools.length}
			<Button variant="outline" size="sm" onclick={() => (currentShown = ctx.tools.length)}>Show All</Button>
		{:else if ctx.tools.length > shown}
			<Button variant="outline" size="sm" onclick={() => (currentShown = shown)}>Show Less</Button>
		{/if}
	</div>
{/if}
