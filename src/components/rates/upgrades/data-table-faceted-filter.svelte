<script lang="ts" module>
	type TData = unknown;
	type TValue = unknown;
</script>

<script lang="ts" generics="TData, TValue">
	import { cn } from '$lib/utils.js';
	import { Badge } from '$ui/badge';
	import { Button } from '$ui/button';
	import * as Command from '$ui/command';
	import * as Popover from '$ui/popover';
	import { Separator } from '$ui/separator';
	import Check from '@lucide/svelte/icons/check';
	import CirclePlus from '@lucide/svelte/icons/circle-plus';
	import type { Column } from '@tanstack/table-core';
	import { SvelteSet } from 'svelte/reactivity';

	type Props<TData, TValue> = {
		column: Column<TData, TValue>;
		title: string;
		options: {
			label: string;
			value: string;
			// This should be `Component` after @lucide/svelte updates types
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon?: any;
		}[];
	};

	let { column, title, options }: Props<TData, TValue> = $props();

	const facets = $derived(column?.getFacetedUniqueValues());
	const selectedValues = $derived(new SvelteSet(column?.getFilterValue() as string[]));
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class="h-8 border-dashed">
				<CirclePlus />
				{title}
				{#if selectedValues.size > 0}
					<Separator orientation="vertical" class="mx-2 h-4" />
					<Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
						{selectedValues.size}
					</Badge>
					<div class="hidden space-x-1 lg:flex">
						{#if selectedValues.size > 2}
							<Badge variant="secondary" class="rounded-sm px-1 font-normal">
								{selectedValues.size} selected
							</Badge>
						{:else}
							{#each options.filter((opt) => selectedValues.has(opt.value)) as option (option)}
								<Badge variant="secondary" class="rounded-sm px-1 font-normal">
									{option.label}
								</Badge>
							{/each}
						{/if}
					</div>
				{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0" align="start">
		<Command.Root>
			<Command.Input placeholder={title} />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group>
					{#each options as option (option)}
						{@const isSelected = selectedValues.has(option.value)}
						<Command.Item
							onSelect={() => {
								if (isSelected) {
									selectedValues.delete(option.value);
								} else {
									selectedValues.add(option.value);
								}
								const filterValues = Array.from(selectedValues);
								column?.setFilterValue(filterValues.length ? filterValues : undefined);
							}}
						>
							<div
								class={cn(
									'border-primary mr-2 flex size-4 items-center justify-center rounded-sm border',
									isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
								)}
							>
								<Check class="size-4" />
							</div>
							{#if option.icon}
								{@const Icon = option.icon}
								<Icon class="text-muted-foreground" />
							{/if}

							<span>{option.label}</span>
							{#if facets?.get(option.value)}
								<span class="ml-auto flex size-4 items-center justify-center font-mono text-xs">
									{facets.get(option.value)}
								</span>
							{/if}
						</Command.Item>
					{/each}
				</Command.Group>
				{#if selectedValues.size > 0}
					<Command.Separator />
					<Command.Group>
						<Command.Item
							onSelect={() => column?.setFilterValue(undefined)}
							class="justify-center text-center"
						>
							Clear filters
						</Command.Item>
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
