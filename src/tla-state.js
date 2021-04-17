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

// Return the identifier label to use in the next state buttons
function stateIdentifier(child_i, stateStr){
  return "Child " + child_i;
}

//draw the state
function drawState(content, stateStr){
  let template = document.getElementById("mainTemplate");
  let result = template.content.cloneNode(true);

  statePrettyPrint = result.querySelector("#prettyPrint");
  statePrettyPrint.innerHTML = prettyPrint(stateStr);

  content.innerHTML = "";
  content.appendChild(result);
}
