<script>
	import "../app.postcss";
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "svelte-sonner";
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</svelte:head>

<ModeWatcher defaultMode="dark" />
<Toaster expand richColors visibleToasts={6}/>
<slot />