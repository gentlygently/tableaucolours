<script setup></script>

<template>
  <article>
    <h1>Editing a .tps file</h1>
    <p>
      The .tps file editor allows you to add, edit, clone, re-order and remove templates from a
      Preferences.tps file. A subset of palettes can also be selected for export to a new .tps file.
    </p>

    <section>
      <h2>Selecting palettes</h2>
      <p>Palettes can be selected for filtering, export or removal.</p>
      <p>To select palettes:</p>
      <ul>
        <li>Click on the circle toggle switch on the left side of a palette; or</li>
        <li>
          Click the <em><span class="fas fa-check-circle"></span>Select all</em> button to select
          all palettes.
        </li>
      </ul>
      <p>To de-select palettes:</p>
      <ul>
        <li>Click on the circle toggle switch of selected palette; or</li>
        <li>
          Click the <em><span class="fas fa-broom"></span>Clear selection</em> button to de-select
          all palettes.
        </li>
      </ul>
    </section>

    <section>
      <h2>Current palette</h2>
      <p>
        The current palette is the one highlighted with a blue border, and is distinct from selected
        palettes. The current palette can be moved or deleted using the keyboard.
      </p>
      <p>To choose the current palette:</p>
      <ul>
        <li>Click on a palette; or</li>
        <li>
          If there is already a current palette, use the arrow keys to change the current palette.
        </li>
      </ul>
    </section>

    <section>
      <h2>Adding a palette</h2>
      <p>To add a palette to the file:</p>
      <ul>
        <li>
          Click the <em><span class="fas fa-plus"></span>Add palette</em> button; or
        </li>
        <li>Press the <em>+</em> key on your keyboard.</li>
      </ul>
      <p>
        Both options will open the colour palette editor. When you're done, click <em>Cancel</em> or
        <em>Done</em> to return to the .tps file editor.
      </p>
    </section>

    <section>
      <h2>Editing a palette</h2>
      <p>
        Double click a palette to open the colour palette editor. When you're done, click
        <em>Cancel</em> or <em>Done</em> to return to the .tps file editor.
      </p>
    </section>

    <section>
      <h2>Cloning a palette</h2>
      <p>
        Click the clone button (<span class="fas fa-stamp"></span>) on a palette to open the colour
        palette editor with a clone of that palette. When you're done, click <em>Cancel</em> or
        <em>Done</em> to return to the .tps file editor.
      </p>
    </section>

    <section>
      <h2>Re-ordering palettes</h2>
      <p>Using the mouse:</p>
      <ul>
        <li>
          Click the vertical ellipsis button (<span class="fas fa-ellipsis-v"></span>) on the right
          hand side of the palette and drag it into your desired position
        </li>
      </ul>
      <p>Using the keyboard:</p>
      <ol>
        <li>Choose the current palette</li>
        <li>Hold down the <em>Shift</em> key, then use the arrow keys to move the palette</li>
      </ol>
      <p>Note: palettes cannot be re-ordered when a filter is active.</p>
    </section>

    <section>
      <h2>Deleting palettes</h2>
      <p>To delete palettes using the mouse:</p>
      <ol>
        <li>Select the palettes to be deleted</li>
        <li>
          Click the <em><span class="fas fa-trash-alt"></span>Delete selected palettes</em> button
        </li>
      </ol>
      <p>To delete a single palette using the keyboard:</p>
      <ol>
        <li>Set the current palette</li>
        <li>Press the <em>Delete</em> key</li>
      </ol>
    </section>

    <section>
      <h2>Filtering palettes</h2>
      <p>
        Filtering is useful for finding or selecting a subset or palettes when your .tps file
        contains a large number of palettes.
      </p>
      <p>To filter palettes:</p>
      <ol>
        <li>
          Click the <em><span class="fas fa-filter"></span>Filter palettes</em> button to open the
          filter
        </li>
        <li>Choose your filter options</li>
      </ol>
      <p>
        To clear all filters simply click the
        <em><span class="fas fa-filter"></span>Filter palettes</em> button to close the filter
      </p>
    </section>

    <section>
      <h2>Exporting palettes</h2>
      <p>You can create a new .tps file containing a subset of your palettes:</p>
      <ol>
        <li>Select one or more palettes</li>
        <li>
          Click the <em><span class="fas fa-file-export"></span>Export selected palettes</em> button
        </li>
        <li>Enter a name for the new file</li>
        <li>Click <em>Export</em></li>
      </ol>
      <p>
        Note: If a filter is active, the exported file will not include selected palettes that have
        been excluded by the filter.
      </p>
    </section>
  </article>
</template>
