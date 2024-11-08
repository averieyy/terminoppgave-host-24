<script lang="ts">
  import { page } from "$app/stores";
  import Channelview from "$lib/widgets/channelview.svelte";
  
  let channel = $page.params.channelid;
</script>

<Channelview streamsource={`/api/channel/${channel}`}/>