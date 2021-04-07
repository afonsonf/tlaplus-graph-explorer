const _1MB = 1000000;
let chunk_sz = 500*_1MB;

let file = null;
let file_sz   = 1;

let curr_offset = 0;
let last_print = 0;

let graph = null;
let curr_state = null;
let path  = [];

let childs_i = 0;
let childs = [];

document.querySelector('.loading').classList.add('hidden');
document.getElementById("check").classList.add('hidden');

function loadChilds(){
  document.getElementById("actions").innerHTML = "";
  document.getElementById("actions").appendChild(radioButton(0));
  if(curr_state.childs.length > 0){
    let child = graph.get(curr_state.childs[0]);
    childs_i = 1;
    childs = [];
    readChunk(child.offset, child.size, updateChilds);
  }
}

function loadCurrState(){
  if(graph == null) return;

  document.querySelector('.loading').classList.add('hidden');
  document.getElementById("check").classList.remove('hidden');
  curr_state = graph.get(curr_state.id)
  readChunk(curr_state.offset, curr_state.size, updateCurr);
}

function loadFile() {
  file = document.getElementById("graph").files[0];
  document.getElementById("progress").innerHTML = "0%"
  if(file == null) return;
  file_sz = file.size
  curr_offset = 0;
  last_print = 0;
  graph = new Map();
  curr_state = null;
  path = [];
  document.querySelector('.loading').classList.remove('hidden')
  readChunk(curr_offset, chunk_sz, readStates);
}

function changePreview(){
  let selected = document.querySelector('input[name="action"]:checked').value;
  if(selected == 0){
    drawPreviewState(path[Math.max(0,path.length-2)].value);
    return;
  }
  drawPreviewState(childs[selected-1].value);
}

function submitAction(){
  let selected = document.querySelector('input[name="action"]:checked').value;
  if(selected == 0){
    curr_state = path[Math.max(0,path.length-2)]
    path.pop();
    path.pop();
  }
  else curr_state = childs[selected-1]
  loadCurrState();
}

function drawCurrState(state){
  let content = document.getElementById("content-curr");
  drawState(content, state);
}

function drawPreviewState(state){
  let content = document.getElementById("content-next");
  drawState(content, state);
}
