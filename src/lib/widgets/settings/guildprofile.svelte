<script lang="ts">
  import { isLight, shortHand } from "$lib/frontend/guild";
  import Colourpicker from "$lib/widgets/colourpicker.svelte";

  let { colour, description, name, guild, updatename, updatecolour, updatedescription }: {
    colour: string,
    description: string,
    name: string,
    guild: {name: string},
    updatename: (name: string) => void,
    updatedescription: (description: string) => void,
    updatecolour: (colour: string) => void,
  } = $props();

  $effect(() => {
    updatename(name);
    updatedescription(description);
    updatecolour(colour);
  });
</script>

<div class="outerprofileeditor">
  <div class="profileeditor">
    <div class="guildprofile">
      <input type="text" bind:value={name} placeholder="Name">
      <textarea bind:value={description}></textarea>
      <Colourpicker colour={colour} changeColourCallback={c => colour = c} />
    </div>
    <div class="outerpreview">
      <div class="preview" style={`background-color: ${colour}; color: ${isLight(colour) ? 'var(--bg1)' : 'var(--fg1)'};`}>
        <span>
          {shortHand(name || guild.name)}
        </span>
      </div>
    </div>
  </div>
</div>

<style>
  .guildprofile {
    flex: 1;
  }
  .profileeditor {
    background-color: var(--bg2);
    padding: 1rem;

    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  .outerpreview {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .preview {
    width: 6rem;
    height: 6rem;

    overflow: hidden;

    border-radius: 33.3%;
    background-color: var(--bg1);

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;

    user-select: none;
  }
  .guildprofile {
    display: flex;
    flex-direction: column;
    gap: .5rem;

    &>input, &>textarea {
      background-color: var(--bg1);
      border: none;
      color: var(--fg1);
      padding: .5rem;
      resize: vertical;
      margin: 0;
      font-size: .85rem;
    }
  }
</style>