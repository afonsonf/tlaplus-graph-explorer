// read a chunk
async function readChunk(offset, length){
  let blob = file.slice(offset, length + offset);
  let text = await blob.text();
  return text;
}

// Read a dot file
async function readFile(){
  file_sz = file.size

  document.getElementById("progress").innerHTML = "0%";
  document.querySelector('.loading').classList.remove('hidden');

  graph = new Map();
  let curr_offset = 0;
  let last_percentage_update = 0;

  while(curr_offset/file_sz < 0.99){
    let text = await readChunk(curr_offset, chunk_sz);
    curr_offset += readStates(text, curr_offset);

    if(curr_offset - last_percentage_update > _1MB*50){
      last_percentage_update = curr_offset;
      document.getElementById("progress").innerHTML = String(parseInt(curr_offset/file_sz * 100)) + "%"
    }
  }
}

// Parse nodes in a chunk, when loading the file
// returns amount read
function readStates(text, curr_offset){
  let amountRead = 0;
  let lines = text.split("\n");
  for(i =0; i < lines.length - 1; i++ ){
    let tmp = lines[i];
    let [id, type, value] = parseNode(tmp);
    if(type == 1){
      graph.set(id, State(id, curr_offset+amountRead, tmp.length));
      if(curr_state == null) curr_state = State(id, curr_offset+amountRead, tmp.length);
    }
    if(type == 2 && !graph.get(id).childs.includes(value))
      graph.get(id).childs.push(value)
    amountRead += tmp.length + 1;
  }
  return amountRead;
}

async function readTrace(){
  file_sz = file.size

  document.getElementById("progress").innerHTML = "0%";
  document.querySelector('.loading').classList.remove('hidden');

  graph = new Map();
  let curr_offset = 0;
  let last_percentage_update = 0;

  let text = await file.text();
  let lines = text.split("\n");

  //search start of error trace
  let i = 0;
  for(; i<lines.length; i++)
    if(lines[i] == "1: <Initial predicate>") break;
  if(i == lines.length) return;

  let state_id = Number(lines[i].substr(0, lines[i].indexOf(":")));
  let value = "";

  i++;
  for(; i<lines.length; i++){
    if(!Number.isInteger(state_id)) break;
    if(lines[i].substr(0,4) == "@!@!"){
      graph.set(state_id, State(state_id, 0, 0))
      graph.get(state_id).value = value;
      if(state_id > 1) graph.get(state_id-1).childs.push(state_id);
      if(curr_state == null) curr_state =   graph.get(state_id);
      i += 2;
      state_id = Number(lines[i].substr(0, lines[i].indexOf(":")));
      value = "";
      continue;
    }
    value += lines[i] + "\\n";
  }
}
