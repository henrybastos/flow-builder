<script>
	import "../app.postcss";
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "svelte-sonner";
</script>

<ModeWatcher defaultMode="dark" />
<Toaster expand richColors visibleToasts={6}/>
<slot />