<script lang="ts">
  const { icon }: { icon: string } = $props();
</script>

<span class="icon">
  {icon}
</span>

<style>
  .icon {
    user-select: none;
    font-family: 'Material Symbols Outlined';
    font-weight: normal;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    direction: 1tr;
    -moz-font-feature-settings: 'liga';
    font-feature-settings: 'liga';
  }
</style>