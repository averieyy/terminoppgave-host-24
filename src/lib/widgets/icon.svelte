<script lang="ts">
  const { icon }: { icon: string } = $props();
</script>

<span class="material-symbols-outlined icon">
  {icon}
</span>

<style>
  .icon {
    user-select: none;
  }
</style>