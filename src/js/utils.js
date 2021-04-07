function State(id, offset, size){
  return {
    id: id,
    offset: offset,
    size: size,
    childs: []
  };
}

function radioButton(value){
  let button = document.createElement("input");
  button.type = "radio";
  button.name = "action";
  button.value = value;
  button.setAttribute("onchange","changePreview()");
  let label = document.createElement("label");
  label.appendChild(button);
  if(value == 0){
    label.appendChild(document.createTextNode("Previous"));
    button.checked = true;
  }
  else
    label.appendChild(document.createTextNode("Child "+value));
  return label;
}

function copyState(state){
  return {
    id: state.id,
    offset: state.offset,
    size: state.size,
    childs: state.childs
  };
}

// 0 -> not node, 1 -> state, 2 -> arrow
function parseNode(tmp){
  let type = 0;
  let id=null;
  let value=null;
  let node_x = tmp.indexOf(" ");
  let node_s = tmp.substr(0,node_x);
  let node   = Number(node_s);

  if(node_x != -1 && Number.isInteger(node)){
    id = node;
    // id = node_s;
    if(tmp[node_x +1] == '-'){
      type = 2;
      let tmp2 = tmp.substr(node_x+4);
      let node2_x = tmp2.indexOf(" ");
      let node2_s = tmp2.substr(0,node2_x);
      value = Number(node2_s);
      // value = node2_s;
    } else {
      type = 1;
      start = tmp.indexOf("\"")+1
      end   = tmp.lastIndexOf("\"")-start
      value = String(tmp.substr(start, end))
    }
  }
  return [id, type, value];
}

var updateCurr = function(evt) {
  [id, type, value] = parseNode(evt.target.result);
  curr_state.value = value;
  path.push(curr_state);
  drawCurrState(value);
  drawPreviewState(path[Math.max(0,path.length-2)].value);
  loadChilds();
}

var updateChilds = function(evt) {
  [id, type, value] = parseNode(evt.target.result);
  let c = copyState(graph.get(id));
  c.value = value;
  childs.push(c);

  let button = radioButton(childs_i);
  document.getElementById("actions").appendChild(button);

  if(childs_i == 1){
    button.children[0].checked = true;
    drawPreviewState(value);
  }
  if(childs_i < curr_state.childs.length){
    let child = graph.get(curr_state.childs[childs_i]);
    childs_i += 1;
    readChunk(child.offset, child.size, updateChilds);
  }
}

var readStates = function(evt) {
  let lines = evt.target.result.split("\n")
  for(i =0; i < lines.length - 1; i++ ){
    let type = 0;
    let id=null;
    let value=null;
    let tmp = lines[i];
    [id, type, value] = parseNode(tmp);
    if(type == 1){
      graph.set(id, State(id, curr_offset, tmp.length));
      if(curr_state == null) curr_state = State(id, curr_offset, tmp.length);
    }
    if(type == 2 && !graph.get(id).childs.includes(value)) graph.get(id).childs.push(value)
    curr_offset += tmp.length + 1;
  }
  if(curr_offset - last_print > 100000000){
    last_print = curr_offset
    // console.log(curr_offset/file_sz)
    document.getElementById("progress").innerHTML = String(parseInt(curr_offset/file_sz * 100)) + "%"
  }
  if(curr_offset/file_sz > 0.99) loadCurrState();
  else readChunk(curr_offset, chunk_sz, readStates);
}

const reader = new FileReader();
function readChunk(offset, length, callback){
  let blob = file.slice(offset, length + offset);
  reader.onload = callback;
  reader.readAsText(blob);
}

// remove some escapes
function removeEscapes(str){
  return str.replaceAll("\\\\", "\\")
            .replaceAll("\\\"", "\"")
}

// return pretty printed html version of stateStr
function prettyPrint(stateStr){
  let lines = removeEscapes(stateStr).replaceAll(">", "&gt;")
                                     .replaceAll("<", "&lt;")
                                     .split("\\n");
  let result = "";
  for(line of lines){
    // result += ("<nobr>"+line+"</nobr><br/>");
    result += (line+"<br/>");
  }
  return result;
}

// divides the state string into a dic of TLA+ vars
function parseVars(stateStr){
  let vars = new Map();
  let lines = removeEscapes(stateStr).split("\\n");
  let currVar = null;
  let currVal = "";
  for(line of lines){
    if(line.startsWith("/\\")){
      if(currVar != null) vars.set(currVar, parser.parse(currVal));
      let equalIndex = line.indexOf("=");
      currVar = line.substr(3,equalIndex-4);
      currVal = line.substr(equalIndex+2);
    } else currVal += line;
  }
  if(currVar != null) vars.set(currVar, currVal);
  return vars;
}
