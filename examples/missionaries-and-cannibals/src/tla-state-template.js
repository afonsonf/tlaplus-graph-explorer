document.write(`
  <template id="mainTemplate">
    <div class="state-mainContent">
      <div id="figure" class="state-figure">
        <div id="islandW" class="state-islandW"></div>
        <div id="water" class="state-water"></div>
        <div id="islandE" class="state-islandE"></div>
      </div>
      <div id="prettyPrint" class="state-prettyPrint"/>
    </div>
  </template>

  <template id="islandTemplate">
    <div id="island-boat" class="island-boat">
      <div class="boat-sail"></div>
      <div class="boat-base"></div>
    </div>
    <div class="island-sand">
      <div class="island-text"> Missionaries: <p id="island-missionaries"></p></div> <br/>
      <div class="island-text"> Cannibals: <p id="island-cannibals"></p></div>
    </div>
  </template>
`)
