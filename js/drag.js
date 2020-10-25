function dragElements(){
  var d=document.querySelectorAll("[draggable]");
  for(var i=0;i<d.length;i++){
    dragElement(d[i]);
  }
}

function reset_draggable(){
  var d=document.querySelectorAll('[draggable]');
  for(var i=0;i<d.length;i++){
    if(!d[i].getAttribute("moved")){
      e2=d[i].nextSibling;
      var pos = e2.getBoundingClientRect();
      d[i].style.top = pos.top + "px";
      d[i].style.left = pos.left + "px";
    }
  }
}

/* working only on boxes with width: 100% and max-width:... */
function dragElement(elmnt) {

  /* cloning to keep relative positions and not to destruct other relative elements */
  var st;
  var e=document.createElement(elmnt.nodeName);
  e.innerHTML=elmnt.innerHTML.replace(/draggable/g,"");
  e.className=elmnt.className;
  if(st=elmnt.getAttribute("style"))e.setAttribute("style",st);
  e.style.visibility="hidden";
  e.style.background="red";
  elmnt.parentNode.insertBefore(e,elmnt.nextSibling);

  /* changing box for absolute position */
  var pos = elmnt.getBoundingClientRect();
  elmnt.style.margin = 0;
  elmnt.style.right = "initial";
  elmnt.style.top = pos.top + "px";
  elmnt.style.left = pos.left + "px";
  elmnt.style.position="absolute";
  var d=document.createElement("div");
  elmnt.appendChild(d);

  /* adding title to moving boxes */
  d.className="drag_expl";
  d.innerHTML=`<en title="MOVE ME SOMEWHERE"></en>
  <cz title="PŘESUŇ MĚ NĚKAM"></cz>
  <it title="SPOSTAMI"></it>
  <es title="MUÉVAME A UN LADO"></es>
  <gl title="MÓVEME A UN LADO"></gl>`
  if(!document.getElementById("st-dra")){
    d=document.createElement("style");
    document.head.appendChild(d);
    d.id="st-dra";
    d.innerHTML='.drag_expl *{position:absolute;left:0;right:0;top:0;bottom:0;}';
  }
  
  /* adding listeners for screen sizes changes, only unmoved items will be responsive */ 
  window.addEventListener("onorientationchange", reset_draggable, false);
  window.addEventListener("resize", reset_draggable, false);

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var dh;
  if (dh=document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    dh.onmousedown = dragMouseDown;
    dh.addEventListener("touchstart", dragMouseDown, false);
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
    elmnt.addEventListener("touchstart", dragMouseDown, false);
  }

  function dragMouseDown(e) {
    /* event `e` deactivating translation button, 
    `window.event` blocking scrolling on touch devices and hiding url bar: */
    e = e || window.event;
    e.preventDefault();
    
    // get the mouse cursor position at startup:
    if (e.type === "touchstart") {
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
    } else {
      pos3 = e.clientX;
      pos4 = e.clientY;
    }
    document.onmouseup = closeDragElement;
    document.addEventListener("touchend", closeDragElement, false);
    
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    document.addEventListener("touchmove", elementDrag, false);
  }

  function elementDrag(e) {
    var ex,ey;
    e = e || window.event;
    e.preventDefault();  
    
    // calculate the new cursor position:
    if (e.type === "touchmove") {
      ex = e.touches[0].clientX;
      ey = e.touches[0].clientY;
    } else { 
      ex = e.clientX;
      ey = e.clientY;
    }
    pos1 = pos3 - ex;
    pos2 = pos4 - ey;
    pos3 = ex;
    pos4 = ey;
    
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.setAttribute("moved",true);
  }

  function closeDragElement() {  // stop moving when mouse button is released:
    document.onmouseup = null;
    document.removeEventListener("touchend", closeDragElement, false);
    document.onmousemove = null;
    document.removeEventListener("touchmove", elementDrag, false);
  }
}