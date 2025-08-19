<script setup></script>

<template>
  <article>
    <h1>Editing a colour palette</h1>
    <p>
      The colour palette editor allows you to add, change, re-order and remove colours from a
      palette. Colours can be selected using either a traditional colour picker or by picking
      colours from an image.
    </p>

    <section>
      <h2>Working with images</h2>
      <p>It can be useful to extract or pick palette colours from an image. To open an image:</p>
      <ul>
        <li>
          Click the folder icon (<span class="fas fa-folder-open"></span>) in the top right of the
          editor;
        </li>
        <li>Drag and drop an image onto the image canvas area; or</li>
        <li>Copy an image and paste it onto the image canvas area.</li>
      </ul>
      <p>To change the image zoom level:</p>
      <ul>
        <li>Use the slider in the top right of the editor;</li>
        <li>
          Use the image buttons (<span class="fas fa-image"></span>) either side of the slider; or
        </li>
        <li>
          Hold down the <em>Shift</em> key and scroll over the image canvas using your mouse or
          trackpad.
        </li>
      </ul>
      <p>To automatically extract the most prominent colours fron an image:</p>
      <ol>
        <li>Click the Extract Colours button (<span class="fas fa-magic"></span>)</li>
        <li>Select the number of colours to extract</li>
        <li>Choose whether you want to add to or replace the colours in the palette</li>
        <li>Click the <em>Extract</em> button</li>
      </ol>
      <p>To pick colours from an image:</p>
      <ol>
        <li>Select the colour swatch of the colour you want to change</li>
        <li>
          Use your mouse to pick a colour from the image (a round swatch is shown near the pointer
          to indicate the colour under the pointer)
        </li>
      </ol>
    </section>

    <section>
      <h2>Selecting a colour</h2>
      <p>
        A colour must be selected in order pick a colour from an image. There are also various
        keyboard operations that rely on a colour being selected.
      </p>
      <p>To select a colour:</p>
      <ul>
        <li>Click on a colour swatch in the list; or</li>
        <li>
          Use the arrow keys to move the selection (the currently selected colour has a blue
          border).
        </li>
      </ul>
    </section>

    <section>
      <h2>Picking colours</h2>
      <p>You can either pick colours from an image (see above), or by using a colour picker:</p>
      <ul>
        <li>Double click a colour swatch to show the colour picker.</li>
        <li>In the colour picker select a colour using your mouse; or</li>
        <li>Enter the hex or RGB values (if you know them)</li>
      </ul>
    </section>

    <section>
      <h2>Adding colours</h2>
      <p>
        Either click the plus button (<span class="iconbutton fas fa-plus"></span>) in the menu or
        press the <em>+</em> key on the keyboard.
      </p>
    </section>

    <section>
      <h2>Re-orering colours</h2>
      <p>Using the mouse:</p>
      <ul>
        <li>Click and drag colour swatches to move them.</li>
      </ul>
      <p>Using the keyboard:</p>
      <ol>
        <li>Select a colour</li>
        <li>Hold down the <em>Shift</em> key, then use the arrow keys to move the colour</li>
      </ol>
    </section>

    <section>
      <h2>Reversing colour order</h2>
      <p>
        Either click the reverse button (<span class="iconbutton fas fa-retweet"></span>) in the
        menu or press the <em>R</em> key on the keyboard.
      </p>
    </section>

    <section>
      <h2>Deleting colours</h2>
      <p>To delete a single colour using the mouse:</p>
      <ol>
        <li>Hover over the swatch of the colour you want to delete</li>
        <li>Click the red X icon that appears on the top right of the swatch</li>
      </ol>
      <p>To delete a single colour using the keyboard:</p>
      <ol>
        <li>Select the colour</li>
        <li>Press the <em>Delete</em> key</li>
      </ol>
      <p>
        To delete all colours in a palette click the Delete button (<span
          class="fas fa-trash-alt"
        ></span
        >) in the menu
      </p>
    </section>

    <section>
      <h2>Importing a palette</h2>
      <p>
        If you have the XML of an existing colour palette (e.g. by copying from a .tps file), you
        can import and make changes to that palette.
      </p>
      <ol>
        <li>Click on the Import XML button (<span class="fas fa-file-import"></span>)</li>
        <li>Paste the XML into the form</li>
        <li>Click the <em>Import</em> button</li>
      </ol>
    </section>

    <section>
      <h2>Exporting a palette</h2>
      <p>
        To get the XML for your palette, click the Get XML button (<span class="fas fa-code"></span
        >) in the menu. You can paste the XML into a .tps file.
      </p>
    </section>
  </article>
</template>
