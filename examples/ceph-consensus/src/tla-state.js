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

//chunk size when reading a file
chunk_sz = 500*_1MB;

// Return the identifier label to use in the next state buttons
function stateIdentifier(child_i, stateStr){
  let vars = parseVars(stateStr);
  return vars.get("step_name");
}

// Draw the state
function drawState(content, stateStr){
  let vars = parseVars(stateStr);
  let mainTemplate = document.getElementById("mainTemplate");
  let result = mainTemplate.content.cloneNode(true);

  // Monitors
  monitorsDiv = result.querySelector("#monitorsDiv");
  for(v of vars.get("quorum")) //v[1]=true if mon (v[0]) is in quorum
    monitorsDiv.appendChild(drawMonitor(vars, v));

  // Messages
  messagesDiv = result.querySelector("#messagesDiv");
  for(v of vars.get("messages"))
    messagesDiv.appendChild(drawMessages(vars, v));

  // Values
  valuesDiv = result.querySelector("#valuesDiv");
  for(v of vars.get("values"))
    valuesDiv.appendChild(drawValues(vars, v));

  // State info
  stateInfoDiv = result.querySelector("#stateInfoDiv");
  stateInfoDiv.querySelector("#stateInfo-step").innerHTML = vars.get("step_name");
  stateInfoDiv.querySelector("#stateInfo-epoch").innerHTML = vars.get("epoch");

  // Pretty print
  statePrettyPrint = result.querySelector("#prettyPrint");
  statePrettyPrint.innerHTML = prettyPrint(stateStr);

  content.innerHTML = "";
  content.appendChild(result);
}

// Fill the monitor state values
function drawMonitor(vars, v){
  let monitorTemplate = document.getElementById("monitorTemplate");
  let monitor = monitorTemplate.content.cloneNode(true);

  let mon = v[0];
  monitor.querySelector("#monitor-name").innerHTML = "Monitor " + mon[1];
  monitor.querySelector("#monitor-value").innerHTML = vars.get("monitor_store").get(mon);

  if( vars.get("isLeader").get(mon) ) monitor.querySelector("#monitor-role").innerHTML = "Leader"
  else monitor.querySelector("#monitor-role").innerHTML = "Peon"

  monitor.querySelector("#monitor-state").innerHTML = vars.get("state").get(mon);
  monitor.querySelector("#monitor-pn").innerHTML = vars.get("accepted_pn").get(mon);
  try{monitor.querySelector("#monitor-pending_pn").innerHTML = vars.get("pending_pn").get(mon);}catch (e) {}
  monitor.querySelector("#monitor-new_value").innerHTML = vars.get("new_value").get(mon);
  monitor.querySelector("#monitor-uncommitted_pn").innerHTML = vars.get("uncommitted_pn").get(mon);
  monitor.querySelector("#monitor-uncommitted_v").innerHTML = vars.get("uncommitted_v").get(mon);
  monitor.querySelector("#monitor-uncommitted_value").innerHTML = vars.get("uncommitted_value").get(mon);

  let curr_class = "monitor-not-active";
  if(!v[1]) curr_class = "monitor-crashed";
  else if(vars.get("state").get(mon) == "STATE_ACTIVE") curr_class = "monitor-active";
  monitor.querySelector("#monitor-div").classList.add(curr_class);

  return monitor;
}

// Fill the message queue
function drawMessages(vars, v){
  let queueTemplate = document.getElementById("queueTemplate");
  let queue = queueTemplate.content.cloneNode(true);

  let from=v[0];
  queue.querySelector("#queue-from").innerHTML = "From mon"+from[1]+" to:";

  let queueList = queue.querySelector("#queue-list")
  for(k of v[1]){
    if(k[0] == from) continue;

    let singleQueueTemplate = document.getElementById("singleQueueTemplate");
    let singleQueue = singleQueueTemplate.content.cloneNode(true);

    let dest = k[0];
    singleQueue.querySelector("#queue-dest").innerHTML = "mon"+dest[1]+":";

    let messages = "<nobr>&nbsp;";
    for(m of k[1]) messages += m["type"] + " ";
    messages+= "</nobr>";
    singleQueue.querySelector("#queue-messages").innerHTML = messages;

    queueList.appendChild(singleQueue);
  }
  return queue;
}

// Fill value log
function drawValues(vars, v){
  let valueTemplate = document.getElementById("valueTemplate");
  let value = valueTemplate.content.cloneNode(true);

  let mon=v[0];
  value.querySelector("#value-monitor").innerHTML = "mon" + mon[1]+":";

  let last_committed = vars.get("last_committed").get(mon);
  let i = 0, committed="", uncommitted="";
  for(;i<last_committed;i++) committed += (v[1][i]+" ")
  for(;i<v[1].length;i++) uncommitted += (" "+v[1][i])

  value.querySelector("#value-committed").innerHTML = committed;
  value.querySelector("#value-uncommitted").innerHTML = uncommitted;

  return value;
}
