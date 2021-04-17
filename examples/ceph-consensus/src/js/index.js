"use strict";

// Default chunk size. This is overwritten by the value in tla-state.js.
const _1MB = 1000000;
let chunk_sz = 500*_1MB;

// Current dot file
let file = null;
let file_sz   = 1;

// Nodes
let graph = null;
let curr_state = null;
let path  = [];
let childs = [];

// Setup page
window.onload = function() {
  document.querySelector('.loading').classList.add('hidden');
  document.getElementById("check").classList.add('hidden-visibility');
  document.getElementById("mainDiv").setAttribute("style","height: "+((window.innerHeight|| document.documentElement.clientHeight||document.body.clientHeight)-250)+"px")
}

// Load dot file (submit action)
async function loadFile(){
  file = document.getElementById("graph").files[0];
  if(file == null) return;

  curr_state = null;
  path = [];
  await readFile();

  if(graph == null) return;
  document.querySelector('.loading').classList.add('hidden');
  document.getElementById("check").classList.remove('hidden-visibility');
  loadCurrState();
}

// Reloads the file and maintains the current state.
async function reloadFile(){
  file = document.getElementById("graph").files[0];
  if(file == null) return;

  try { await readFile();}
  catch (e) {
    document.getElementById("error").classList.remove('hidden');
    document.querySelector('.loading').classList.add('hidden');
    document.getElementById("check").classList.remove('hidden-visibility');
    return;
  }

  if(graph == null) return;
  document.querySelector('.loading').classList.add('hidden');
  document.getElementById("check").classList.remove('hidden-visibility');
  loadCurrState();
}

// Load curent state and its childs
async function loadCurrState(){
  if(graph == null) return;
  curr_state = copyState(graph.get(curr_state.id));

  let text = await readChunk(curr_state.offset, curr_state.size);
  let [id, type, stateStr] = parseNode(text);
  curr_state.value = stateStr;

  if(path.length == 0 || path[path.length-1].id != id)
    path.push(curr_state);

  drawCurrState(stateStr);
  drawPreviewState(path[Math.max(0,path.length-2)].value);

  loadChilds();
}

// Create childs buttons
async function loadChilds(){
  document.getElementById("actions").innerHTML = "";
  document.getElementById("actions").appendChild(radioButton(0, ""));
  childs = [];
  for(let child_i = 0; child_i < curr_state.childs.length; child_i++){
    let child = copyState(graph.get(curr_state.childs[child_i]));
    childs.push(child);

    let text = await readChunk(child.offset, child.size);
    let [id, type, stateStr] = parseNode(text);
    child.value = stateStr;

    let button = radioButton(child_i+1, stateStr);
    document.getElementById("actions").appendChild(button);

    if(child_i == 0){
      button.children[0].checked = true;
      drawPreviewState(stateStr);
    }
  }
}

// Update state preview when selected child changes
function updatePreview(){
  let selected = document.querySelector('input[name="action"]:checked').value;
  if(selected == 0){
    drawPreviewState(path[Math.max(0,path.length-2)].value);
    return;
  }
  drawPreviewState(childs[selected-1].value);
}

// Update current state to the selected child (submit action)
function updateCurrent(){
  let selected = document.querySelector('input[name="action"]:checked').value;
  if(selected == 0){
    curr_state = path[Math.max(0,path.length-2)]
    path.pop();
    path.pop();
  }
  else curr_state = childs[selected-1]
  loadCurrState();
}

// Draw current state
function drawCurrState(stateStr){
  let content = document.getElementById("content-curr");
  drawState(content, stateStr);
}

// Draw next state preview
function drawPreviewState(stateStr){
  let content = document.getElementById("content-next");
  drawState(content, stateStr);
}