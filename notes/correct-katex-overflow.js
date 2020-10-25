function correct_katex_overflow(){
    var e=document.getElementsByClassName("katex-html");
    for(var i=0;i<e.length;i++){
        arrows(e[i]);
        e[i].onscroll=arrows;
    }
    window.onresize=correct_katex_overflow;
}

function maxScrollX(c){
    return c.scrollWidth-c.clientWidth;
}

function arrows(c){
    var co=c.constructor.name;
    if((co?co:c.toString()).indexOf("Event")>-1)c=this;
    var m=maxScrollX(c);
    var x=c.scrollLeft;
    var p=c.parentNode;
    p.className=p.className.replace(/ (left|right|arrow-after)/g,"");
    if(m<4||c.clientWidth==0)return;
    if(!p.style.height&&p.offsetHeight)p.style.height=(p.offsetHeight+1)+"px";
    if(p.className.indexOf("arrow-after")===-1)p.className+=" arrow-after";
    if(x<4)p.className+=" right";
    else if(m-x<4)p.className+=" left";
}