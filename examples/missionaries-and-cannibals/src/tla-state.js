/*
Helpers:
  function prettyPrint(stateStr)
    Receives the StateStr and returns a pretty printed html version of the state
    Can be used to print the state in a similar way as the tlc-trace prints it

  function parseVars(stateStr)
    Parse the vars in the stateStr and returns a map of them
    Functions are parsed into js Map
    Sequences are parsed into js Array
    Sets are parsed into js Set
    Records are parsed into js objects
*/

// Chunk size when reading a file
chunk_sz = 500*_1MB;

// Return the identifier label to use in the next state buttons
function stateIdentifier(child_i, stateStr){
  return "Child " + child_i;
}

// Draw the state
function drawState(content, stateStr){
  let vars = parseVars(stateStr);

  let template = document.getElementById("mainTemplate");
  let result = template.content.cloneNode(true);

  // Create islands from template
  let islandTemplate = document.getElementById("islandTemplate");

  let islandW = islandTemplate.content.cloneNode(true);
  let [nCannibalsW, nMissionariesW] = groupPeople(vars.get("who_is_on_bank")["W"])
  islandW.querySelector("#island-missionaries").innerHTML = nMissionariesW;
  islandW.querySelector("#island-cannibals").innerHTML = nCannibalsW;

  let islandE = islandTemplate.content.cloneNode(true);
  let [nCannibalsE, nMissionariesE] = groupPeople(vars.get("who_is_on_bank")["E"])
  islandE.querySelector("#island-missionaries").innerHTML = nMissionariesE;
  islandE.querySelector("#island-cannibals").innerHTML = nCannibalsE;

  // hide boat
  if(vars.get("bank_of_boat") == "\"E\"")
    islandW.querySelector("#island-boat").classList.add('hidden-visibility');
  else
    islandE.querySelector("#island-boat").classList.add('hidden-visibility');

  result.querySelector("#islandW").appendChild(islandW);
  result.querySelector("#islandE").appendChild(islandE);

  // Pretty Print
  statePrettyPrint = result.querySelector("#prettyPrint");
  statePrettyPrint.innerHTML = prettyPrint(stateStr);

  content.innerHTML = "";
  content.appendChild(result);
}

// Count number of Missionaries and Cannibals
function groupPeople(people){
  let nCannibals = 0, nMissionaries = 0;
  for(p of people){
    if(p[0] == 'c') nCannibals += 1;
    else nMissionaries += 1;
  }
  return [nCannibals, nMissionaries];
}
