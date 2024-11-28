<script lang="ts">
  import Icon from "./icon.svelte";

  const { title = "Note", icon = "info", content, colour = "var(--lightblue)" }: { title?: string, icon?: string, content: string, colour?: string } = $props();
</script>


<div class="notice" style="background-color: {colour};">
  <div class="noticeheader">
    <Icon icon={icon}/>
    <span>{title}</span>
  </div>
  <p>
    {content}
  </p>
</div>

<style>
  .notice {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding: .75rem;
    color: var(--bg1);
    border-radius: .75rem;
  
    &>p {
      margin: 0;
    }
  }
  .noticeheader {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;
    font-size: 1.5rem;
  
    &>span {
      font-size: 1rem;
      font-weight: bold;
    }
  }
</style>