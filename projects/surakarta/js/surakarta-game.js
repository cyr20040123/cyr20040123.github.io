var blueLoop;
var greenLoop;
var blackCount;
var redCount;
function setGrids(){
    var container = document.getElementById("grid-container");
    container.innerHTML="";
    for (var i=0; i<6; i++){
        for (var j=0; j<6; j++){
            var g = document.createElement("div");
            var attr1 = document.createAttribute("ondrop");
            attr1.value = "afterdrop(event)";
            var attr2 = document.createAttribute("ondragover");
            attr2.value = "allowDrop(event)";
            g.id = "g"+i+j;
            g.className = "sg";
            g.setAttributeNode(attr1);
            g.setAttributeNode(attr2);
            container.appendChild(g);
            //document.writeln('<div id="g'+i+j+'" class="sg" ondrop="afterdrop(event)" ondragover="allowDrop(event)"></div>');
        }
    }
}

function initChessman(){
    var count = 0;//Create Black Chessmen
    for (var i=0; i<2; i++){
        for (var j=0; j<6; j++){
            var t = document.getElementById('g'+i+j);
            var c = document.createElement("img");
            c.src = "img/chessman-black.png";
            c.id = "b"+count;
            c.className = "chessman"
            t.appendChild(c);
            count++;
        }
    }
    count = 0;//Create Red Chessmen (draggable)
    for (var i=4; i<6; i++){
        for (var j=0; j<6; j++){
            document.getElementById('g'+i+j).innerHTML = '<img id="r'+count+'" class="chessman" draggable="true" ondragstart="drag(event)" src="img/chessman-red.png"/>';
            count++;
        }
    }
}

function init(){
    blackCount = 12;
    redCount = 12;
	updateScore();
    blueLoop = new Array("g01","g11","g21","g31","g41","g51","l","g40","g41","g42","g43","g44","g45","l","g54","g44","g34","g24","g14","g04","l","g15","g14","g13","g12","g11","g10","l");
    greenLoop = new Array("g02","g12","g22","g32","g42","g52","l","g30","g31","g32","g33","g34","g35","l","g53","g43","g33","g23","g13","g03","l","g25","g24","g23","g22","g21","g20","l");
    setGrids();
    initChessman();
    document.getElementById("control-panel").style.display = "block";
    document.getElementById("playground").style.display = "block";
    document.getElementById("menu").style.display = "none";
}

function gameover(){
    var info;
    if(redCount>blackCount) info = "Congratualtions! You win.\n";
    else info = "You lose.\n";
    alert("Game Over\n\n"+info+"\nYour score: "+(redCount-blackCount).toString());
    document.getElementById("control-panel").style.display = "none";
    document.getElementById("playground").style.display = "none";
    document.getElementById("menu").style.display = "block";
}

function updateScore(){
    document.getElementById("score-board").innerHTML="<b>Red "+redCount+"</b> : "+blackCount+" Black";
    if(redCount==0||blackCount==0)gameover();
}

function isLegalCapturing(cur, to)
{//cur, to should be IMG elements.
    if(((to.nodeName != 'IMG') && (to.nodeName != 'img')) || cur.id.charAt(0) == to.id.charAt(0)) return false;
    var ii, i, t, flag;
    if(blueLoop.indexOf(cur.parentElement.id) != -1 && blueLoop.indexOf(to.parentElement.id) != -1) {
        t = blueLoop.indexOf(to.parentElement.id), flag = false;
        for(ii = blueLoop.indexOf(cur.parentElement.id); ii != -1; ii = blueLoop.indexOf(cur.parentElement.id,ii+1)) {
            //Why this ii loop? - For a point in the crossroads, it may appear twice in the loop array. Therefore, there are totally 4 ways to move the chessman.
            ii %= blueLoop.length;
            for(i = (ii + 1) % blueLoop.length; i!=t && blueLoop[i]!=to.parentElement.id; i++, i%=blueLoop.length){
                if(blueLoop[i]=="l"){
                    flag = true;
                    continue;
                }
                if(document.getElementById(blueLoop[i]).childElementCount != 0 && document.getElementById(blueLoop[i]).children[0].id != cur.id){
                    flag = false;
                    break;
                }
            }
            if(flag) return true;
            for(i = (ii - 1 + blueLoop.length) % blueLoop.length; i!=t && blueLoop[i]!=to.parentElement.id; i--, i+=blueLoop.length, i%=blueLoop.length){
                if(blueLoop[i]=="l"){
                    flag = true;
                    continue;
                }
                if(document.getElementById(blueLoop[i]).childElementCount != 0  && document.getElementById(blueLoop[i]).children[0].id != cur.id){
                    flag = false;
                    break;
                }
            }
            if(flag) return true;
        }
    }
    if(greenLoop.indexOf(cur.parentElement.id) != -1 && greenLoop.indexOf(to.parentElement.id) != -1) {
        t = greenLoop.indexOf(to.parentElement.id), flag = false;
        for(ii = greenLoop.indexOf(cur.parentElement.id); ii != -1; ii = greenLoop.indexOf(cur.parentElement.id,ii+1)) {
            ii %= greenLoop.length;
            for(i = (ii + 1) % greenLoop.length; i!=t && greenLoop[i]!=to.parentElement.id; i++, i%=greenLoop.length){
                if(greenLoop[i]=="l"){
                    flag = true;
                    continue;
                }
                if(document.getElementById(greenLoop[i]).childElementCount != 0 && document.getElementById(greenLoop[i]).children[0].id != cur.id){
                    flag = false;
                    break;
                }
            }
            if(flag) return true;
            for(i = (ii - 1 + greenLoop.length) % greenLoop.length; i!=t && greenLoop[i]!=to.parentElement.id; i--, i+=greenLoop.length, i%=greenLoop.length){
                if(greenLoop[i]=="l"){
                    flag = true;
                    continue;
                }
                if(document.getElementById(greenLoop[i]).childElementCount != 0 && document.getElementById(greenLoop[i]).children[0].id != cur.id){
                    flag = false;
                    break;
                }
            }
            if(flag) return true;
        }
    }
    return false;
}

function isLegalMove(olddiv,newdiv) {
    if(olddiv==null || newdiv==null) return false;
    oldid=olddiv.id;
    newid=newdiv.id;
    if(document.getElementById(newid) != null && document.getElementById(newid).childElementCount == 0)
        return Math.abs(oldid.charAt(1) - newid.charAt(1)) <= 1 && Math.abs(oldid.charAt(2) - newid.charAt(2)) <= 1;
}

function appear(oImg) {
    var alpha = 0;
    var iTarget = 1;
    var timer = null;
    clearInterval(timer);
    timer = setInterval(function(){
        var speed = 0;
        if( alpha < iTarget ) {
            speed = 0.1;
        }else{
            speed = -0.1;
        }
        if(alpha == iTarget){
            clearInterval(timer);
        }else{
            alpha = (alpha*10 + speed*10)/10;
            oImg.style.opacity = alpha;//for Firefox
            oImg.style.filter = "alpha(opacity="+ alpha*100 +")";//for IE
        }
    },80);
    /*var alpha = 100;
    while(alpha>0) {
        ele.style.filter = 'alpha(opacity:'+alpha+')'; //for IE
        ele.style.opacity = alpha / 100; //for firefox
        alpha --;
    }*/
}

function dropsg(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var cur = document.getElementById(data);
    if ((ev.target.nodeName != 'DIV') && (ev.target.nodeName != 'div')) {
        //Evaluating capturing move here:
        if(isLegalCapturing(cur,ev.target)) {
            appear(cur);
            var par = ev.target.parentElement;
            par.innerHTML="";
            par.appendChild(document.getElementById(data));//Move element
            alert("Red gets 1 point!");
            blackCount --;
            updateScore();
            return true;
        }
        return false;
    }
    if(isLegalMove(cur.parentElement,ev.target) == false) {
        alert("Illegal move.");
        return false;
    }
    appear(cur);
    ev.target.appendChild(document.getElementById(data));//Move element
    return true;
}

function afterdrop(ev) {
    if(dropsg(ev)==false) return;
    var i,j,k,cur,to,tid,x,y;
    for(i = 0; i < 12; i ++)
    {
        cur = document.getElementById("b"+i);
        if(cur == null) continue;
        for(j = 0; j < 12; j ++)
        {//sometimes don't capture red chessman?
            to = document.getElementById("r"+j);
            if(to == null) continue;
            if(isLegalCapturing(cur, to)){
                appear(cur);
                var par1 = to.parentElement, par2 = cur.parentElement;
                par1.innerHTML="";
                par1.appendChild(cur);
                par2.innerHTML="";
                alert("Black gets 1 point!");
                redCount --;
                updateScore();
                return;
            }
        }
    }
    //alert("AI moves.");
    for(i = 11; i >=0 ; i --)
    {
        cur = document.getElementById("b"+i);
        if(cur == null) continue;
        tid = cur.parentElement.id;
        x = tid.charAt(1)-0;
        y = tid.charAt(2)-0;
        for(j=-1;j<=1;j++){
            for(k=-1;k<=1;k++){
                if(j==0 && k==0)continue;
                to = document.getElementById("g"+(x+j).toString()+(y+k).toString());
                if(isLegalMove(cur.parentElement, to)){
                    appear(cur);
                    cur.parentElement.innerHTML="";
                    to.appendChild(cur);
                    return;
                }
            }
        }
    }
    //gameover();
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
