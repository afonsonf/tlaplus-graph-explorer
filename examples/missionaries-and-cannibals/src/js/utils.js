// State structure
function State(id, offset, size){
  return {
    id: id,
    offset: offset,
    size: size,
    childs: []
  };
}

function copyState(state){
  return {
    id: state.id,
    offset: state.offset,
    size: state.size,
    childs: state.childs,
    value: state.value
  };
}

// Creates a radio button
function radioButton(child_i, stateStr){
  let button = document.createElement("input");
  button.type = "radio"; button.name = "action"; button.value = child_i;
  button.setAttribute("onchange","updatePreview()");
  let label = document.createElement("label");
  label.appendChild(button);
  if(child_i == 0){
    label.appendChild(document.createTextNode("Previous"));
    button.checked = true;
  }
  else{
    label.appendChild(document.createTextNode(stateIdentifier(child_i, stateStr)));
  }
  return label;
}

// Parse a dot node
// 0 -> not node, 1 -> state, 2 -> arrow
// 1: returns [id, 1, stateStr]
// 2: return [id1, 2, id2]
// _s variant: use string instead of int to prevent overflow
function parseNode(tmp){
  let type = 0, id=null, value=null;
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

// remove some escapes
function removeEscapes(str){
  return str.replaceAll("\\\\", "\\").replaceAll("\\\"", "\"")
}

// return pretty printed html version of stateStr
function prettyPrint(stateStr){
  let lines = removeEscapes(stateStr).replaceAll(">", "&gt;").replaceAll("<", "&lt;").split("\\n");
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
  if(currVar != null) vars.set(currVar, parser.parse(currVal));
  return vars;
}
