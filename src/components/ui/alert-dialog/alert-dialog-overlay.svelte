<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';

	let { ref = $bindable(null), class: className, ...restProps }: AlertDialogPrimitive.OverlayProps = $props();
</script>

<AlertDialogPrimitive.Overlay
	bind:ref
	data-slot="alert-dialog-overlay"
	class={cn(
		'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
		className
	)}
	{...restProps}
/>
