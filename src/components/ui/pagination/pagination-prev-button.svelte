<script lang="ts">
	import { buttonVariants } from '$comp/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import { Pagination as PaginationPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: PaginationPrimitive.PrevButtonProps = $props();
</script>

{#snippet Fallback()}
	<ChevronLeftIcon class="size-4" />
	<span>Previous</span>
{/snippet}

<PaginationPrimitive.PrevButton
	bind:ref
	aria-label="Go to previous page"
	class={cn(
		buttonVariants({
			size: 'default',
			variant: 'ghost',
			class: 'gap-1 px-2.5 sm:pl-2.5',
		}),
		className
	)}
	children={children || Fallback}
	{...restProps}
/>
