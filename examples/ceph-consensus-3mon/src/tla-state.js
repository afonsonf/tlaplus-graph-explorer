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
  let vars = parseVars(stateStr);
  return vars.get("step_name");
}

//draw the state
function drawState(content, stateStr){
  vars = parseVars(stateStr);

  // -------------------------------------------------------

  let maindiv = document.createElement("div");
  maindiv.classList.add('state-mainContent');

  let figure = document.createElement("div");
  figure.classList.add('state-figure');

  let messages = document.createElement("div");
  messages.classList.add('state-messages');

  let state = document.createElement("div");
  state.classList.add('state-prettyPrint');

  maindiv.appendChild(figure);
  maindiv.appendChild(messages);
  maindiv.appendChild(state);

  content.innerHTML = ""
  content.appendChild(maindiv);

  // -------------------------------------------------------

  let width = content.clientWidth-15
  let draw_width = width;
  let draw_height = 300;

  state.innerHTML = prettyPrint(stateStr);
  drawFigure(vars, figure, draw_width, draw_height);
  drawMessages(vars, messages, draw_width);
}

// Draw main figure representing the state
function drawFigure(vars, figure, draw_width, draw_height){
  figure.setAttribute("style","height: "+draw_height+"px")
  const draw = SVG().addTo(figure).size(draw_width, draw_height);

  //rects circles
  let rect_sz = (draw_height*1.4/3);
  let circle_sz = (draw_height*0.5/3);

  //components
  let states = []
  for(i=0;i<3;i++)
    states.push(stateComponent(vars, draw, rect_sz, circle_sz, i));

  states[0].move(draw_width*2/4-rect_sz*1.5-4, draw_height*1/4-rect_sz/2+10);
  states[1].move(draw_width*2/4-rect_sz/2, draw_height*1/4-rect_sz/2+10);
  states[2].move(draw_width*2/4+rect_sz/2+4, draw_height*1/4-rect_sz/2+10);

  let info = infoComponent(vars, draw);
  let values = valuesComponent(vars, draw);

  // Draw reference grid over draw space
  // let line_attr = {width: 2, color: '#6699ff', dasharray: '5,5'}
  // drawGrid(draw, 8, line_attr);
}

// Draw Message queue
function drawMessages(vars, messages, draw_width){
  let draw_height = 180;
  messages.setAttribute("style","height: "+draw_height+"px")
  const draw = SVG().addTo(messages).size(draw_width, draw_height);

  let text_top = draw.text(function(add) {
    add.tspan("Message Queue").font({size: 18}).newLine()
  }).font({anchor: 'left'}).move(5, 5);

  let posx = 5;
  let posy = 30;

  let queue1 = queueComponent(draw, draw_width, vars, posx, posy,    1, 2, 3);
  let queue2 = queueComponent(draw, draw_width, vars, posx, posy+50, 2, 1, 3);
  let queue3 = queueComponent(draw, draw_width, vars, posx, posy+100,3, 1, 2);
}

// Draw queue component for each monitor
function queueComponent(draw, draw_width, vars, posx, posy, monA, monB, monC){
  let rect = draw.rect(draw_width-110, 45).move(105, posy+2)
                 .attr({ fill: '#a6a6a6', stroke: '#000080'})
                 .opacity(0.2);

  let mAtoB = ""
  for(m of vars.get("messages").get("m"+monA).get("m"+monB)) mAtoB += " " + m.type

  let mAtoC = ""
  for(m of vars.get("messages").get("m"+monA).get("m"+monC)) mAtoC += " " + m.type

  let text = draw.text(function(add) {
    add.tspan("mon"+monA+":")
    add.tspan("mon"+monB+":").dx(5)
    add.tspan(mAtoB).dx(5)
    add.tspan("").font({size: 1}).newLine()
    add.tspan("mon"+monC+":").dx(50).newLine()
    add.tspan(mAtoC).dx(5)
  }).font({anchor: 'left', size: 16, family: 'Helvetica'}).move(posx, posy+5);
}

// Draw monitor info (value, pn, etc)
function stateComponent(vars, draw, rect_sz, circle_sz, ith_mon){
  let res = draw.group();
  let draw_width = draw.width();
  let draw_height = draw.height();

  let rect_attr = { fill: '#f2f2f2', stroke: '#a6a6a6'};
  let active_attr = {fill: '#c6ecc6', stroke: "#194d19"};
  let outquorum_attr = {fill: '#ffe0cc', stroke: "#ff6600"};
  let inquorum_attr = {fill: '#ffff99', stroke: "#a6a6a6"};

  let circle_attr = inquorum_attr;
  if(!vars.get("quorum").get("m"+(ith_mon+1))) circle_attr = outquorum_attr;
  if(vars.get("state").get("m"+(ith_mon+1)) == "STATE_ACTIVE") circle_attr = active_attr;

  let mon = "m"+(ith_mon+1)
  let role = "Peon"
  if(vars.get("isLeader").get(mon)) role = "Leader"
  let offset = 20;

  let posx = draw_width*1/4-rect_sz/2;
  let posy = draw_height*1/4-rect_sz/2;

  let rect = draw.rect(rect_sz, rect_sz).move(posx, posy).attr(rect_attr);
  let circ = draw.circle(circle_sz)
                 .move(draw_width*1/4-circle_sz/2, draw_height*1/4-circle_sz/2+offset)
                 .attr(circle_attr);

  let text_center = draw.text(function(add) {
    add.tspan(vars.get("monitor_store").get(mon)).font({size: 18}).newLine()
  }).font({anchor: 'middle', family: 'Helvetica'}).center(draw_width*1/4, draw_height*1/4+offset);

  let text_top = draw.text(function(add) {
    add.tspan("Monitor "+(ith_mon+1)).font({size: 14}).newLine()
    add.tspan(role).font({size: 12}).newLine()
    add.tspan(vars.get("state").get(mon)).font({size: 10}).newLine()
  }).font({anchor: 'middle', family: 'Helvetica'}).center(draw_width*1/4, 30);

  let text_bottom = draw.text(function(add) {
    add.tspan("pn: "+vars.get("accepted_pn").get("m"+(ith_mon+1))).font({size: 14}).newLine()
  }).font({anchor: 'right', family: 'Helvetica'}).move(posx+5, posy+rect_sz-20);

  res.add(rect); res.add(circ); res.add(text_center); res.add(text_top);
  res.add(text_bottom);
  return res;
}

// Draw info about the state (epoch, step name)
function infoComponent(vars, draw){
  let draw_width = draw.width();
  let draw_height = draw.height();

  let rect_attr = { fill: '#f2f2f2', stroke: '#a6a6a6'}
  let rect_sz_w = (draw_height*1.4/3+30);
  let rect_sz_h = (draw_height*0.7/3-20);

  let posx = draw_width*2/4+rect_sz_w/2-10-20;
  let posy = draw_height*3/4-rect_sz_h/2;

  let rect = draw.rect(rect_sz_w, rect_sz_h).move(posx, posy).attr(rect_attr);

  let text_step = draw.text(function(add) {
    add.tspan("step: "+vars.get("step_name")).newLine()
    add.tspan("epoch: "+vars.get("epoch")).newLine()
  }).font({anchor: 'left', size: 14, family: 'Helvetica'}).move(posx+3, posy+10);
}

// Draw values log
function valuesComponent(vars, draw){
  let draw_width = draw.width();
  let draw_height = draw.height();

  let rect_attr = { fill: '#f2f2f2', stroke: '#a6a6a6'}
  let rect_sz_w = (draw_height*2.1/3);
  let rect_sz_h = (draw_height*1.05/3);

  let posx = draw_width*2/4-rect_sz_w*4/5;
  let posy = draw_height*3/4-rect_sz_h/2;

  let rect = draw.rect(rect_sz_w, rect_sz_h).move(posx, posy).attr(rect_attr);

  let text_top = draw.text(function(add) {
    add.tspan("Values").font({size: 18}).newLine()
  }).font({anchor: 'left'}).move(posx+5, posy+5);

  let rect_attr2 = { fill: '#6699ff', stroke: '#a6a6a6'}
  let rect_sz_w2 = rect_sz_w-10;
  let rect_sz_h2 = rect_sz_h-30;
  let posx2 = posx+5;
  let posy2 = posy+25;

  mon_valuesComponent(draw, posx2, posy2, 1, vars);
  mon_valuesComponent(draw, posx2, posy2+rect_sz_h2*1/3, 2, vars);
  mon_valuesComponent(draw, posx2, posy2+rect_sz_h2*2/3, 3, vars);
}

// Value log for one monitor
function mon_valuesComponent(draw, posx, posy, mon, vars){
  let last_committed = vars.get("last_committed").get("m"+mon);
  let values = vars.get("values").get("m"+mon);
  let i = 0;

  let curr = "";
  for(; i<last_committed; i++) curr += " "+values[i]

  let to_commit = ""
  for(; i<values.length; i++) to_commit += " "+values[i]

  let rect = draw.rect(150, 20).move(posx+45, posy+3)
                 .attr({ fill: '#a6a6a6', stroke: '#000080'})
                 .opacity(0.2);

  let dx_sep = 0;
  if(curr == "") dx_sep = 5;

  let text = draw.text(function(add) {
    add.tspan("mon"+mon+":").font({size: 14})
    add.tspan(curr).font({size: 14}).dx(5)
    add.tspan(" |").font({size: 14, weight: "1000"}).fill("#000080").dx(dx_sep)
    add.tspan(to_commit).font({size: 14}).fill("#7575a3")
  }).font({anchor: 'left', family:   'Helvetica'}).move(posx, posy+5);
}

// Draw a grid over svg draw space
function drawGrid(draw, N, line_attr){
  let draw_width = draw.width();
  let draw_height = draw.height();

  for(i=1;i<=N-1;i++){
    draw.line(0, draw_height*i/N, draw_width, draw_height*i/N).stroke(line_attr);
    draw.line(draw_width*i/N, 0, draw_width*i/N, draw_height).stroke(line_attr)
  }
}

// Draw an arrow from pos1 to pos2
function drawArrow(draw, pos1, pos2){
  let offset = pos1.width()/2;
  if(pos1.cx() > pos2.cx()) offset = offset*-1;

  let line = draw.line(pos1.cx()+offset, pos1.cy(),
                       pos2.cx()-offset, pos2.cy())
                 .stroke({ width: 5, color: '#6699ff'}).opacity(0.5)

  line.marker('end', 14, 14, function(add) {
    add.line(3, 4, 8, 7)
    add.line(3, 10, 8, 7)
    this.stroke({ width: 1, color: '#6699ff'})
  })
}
