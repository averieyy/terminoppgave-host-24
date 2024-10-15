<script lang="ts">
  import { page } from "$app/stores";
  import Channelview from "$lib/frontend/views/channelview.svelte";
  
  let channel = $page.params.channelid;
</script>

<Channelview streamsource={`/api/channel/${channel}`}/>