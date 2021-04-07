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

chunk_sz = 500*_1MB;

function drawState(content, stateStr){
  let result = document.createElement("div");
  result.classList.add('state-mainContent');

  let state = document.createElement("div");
  state.innerHTML = prettyPrint(stateStr);
  state.classList.add('state-prettyPrint');

  result.appendChild(state);

  content.innerHTML = ""
  content.appendChild(result);
}
