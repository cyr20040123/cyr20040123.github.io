//===============================================  USER  LOGIN  ===========================================
var displayName;
var email;
var emailVerified;
var photoURL;
var isAnonymous;
var uid;
var providerData;
var userJSON = null;
var competitor_email = "N/A";

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// User is signed in.
		displayName = user.displayName;
		email = user.email;
		emailVerified = user.emailVerified;
		photoURL = user.photoURL;
		isAnonymous = user.isAnonymous;
		uid = user.uid;
		providerData = user.providerData;
		document.getElementById("uid").innerText=email;
		document.getElementById("useronline").style.display="inline";
		document.getElementById("login-btn").style.display="none";
		document.getElementById("logout-btn").style.display="inline";
        document.getElementById("startButton").setAttribute("onclick","newInit();");
        document.getElementById("profileButton").setAttribute("onclick","window.open('surakarta-myprofile.html');");
        firebase.database().ref("userdata/"+uid).on("value",function(snapshot) {
            userJSON = readJSON(snapshot);
            if (userJSON["uid"] != uid) {
                firebase.database().ref('userdata/'+uid).set({
                    win: 0,
                    lose: 0,
                    offline: 0,
                    uid: uid,
                    email: email
                });
            }
        });
		// ...
	} else {
		// User is signed out.
		displayName = null;
		email = null;
		emailVerified = null;
		photoURL = null;
		isAnonymous = null;
		uid = null;
        providerData = null;
		document.getElementById("uid").innerText="null";
		document.getElementById("useronline").style.display="none";
		document.getElementById("login-btn").style.display="inline";
		document.getElementById("logout-btn").style.display="none";
        document.getElementById("startButton").setAttribute("onclick","window.open('surakarta-login.html');");
        document.getElementById("profileButton").setAttribute("onclick","window.open('surakarta-login.html');");
        userJSON = null;
	}
});
//==============================================================================================================

var database = firebase.database();
var gameListSnapshot;
var gameTemplateSnapshot;
var gameJSON = null;
var gameKey = "";
var me = "", competitor = ""; // red or black
var offlineflag = false;

window.onbeforeunload = function(event) { 
    if(gameJSON != null) return confirm("Are you sure to end this game?");
    return ;
}

function readJSON(gameSnapshot){
    var tJson = {};
    gameSnapshot.forEach(function(keyvalues) {
        var childKey = keyvalues.key;
        var childData = keyvalues.val();
        tJson[keyvalues.key] = childData;
    });
    return tJson;
}

function newGame(){
    var gameRef;
    //Find an available game
    gameJSON = null;
    offlineflag = false;

    firebase.database().ref('new-game-template').set({
        b0:"g00", b1:"g01", b10:"g14", b11:"g15",
        b2:"g02", b3:"g03", b4:"g04", b5:"g05",
        b6:"g10", b7:"g11", b8:"g12", b9:"g13",
        r0:"g40", r1:"g41", r10:"g54", r11:"g55",
        r2:"g42", r3:"g43", r4:"g44", r5:"g45",
        r6:"g50", r7:"g51", r8:"g52", r9:"g53",
        starttime:Date.parse(new Date()),
        turn:"r",
        red:"null",
        redtimeout:0,
        black:"null",
        blacktimeout:0,
        round:0
    });

    firebase.database().ref("currentgame").once("value").then(function(snapshot) {
        console.log("Search game.");
        snapshot.forEach(function(gameSnapshot) {
            //if(gameJSON != null) return;
            if(gameJSON != null && gameJSON["round"] == 0) { return; }
            gameJSON = readJSON(gameSnapshot);
            gameKey = gameSnapshot.key;
            if(gameJSON["round"] == 0 && gameJSON["black"] == "null" && Date.parse(new Date()) - gameJSON["timestamp"] < 5000) {
                alert("Join game: You play as BLACK side.");
                console.log("Join game: "+gameKey);
                gameJSON["black"] = uid;
                var updates = {};
                updates["currentgame/"+gameKey+"/black"] = uid;
                firebase.database().ref().update(updates);
                me = "b";
                competitor = "r";
                return;
            }
            else gameJSON = null;
        });
        if (gameJSON == null || gameJSON["round"] != 0) {
            //Create a new game from template
            alert("New game: You play as RED side.\n\nPlease wait for another player.");
            document.getElementById("startButton").setAttribute("onclick","");
            document.getElementById("startButton").setAttribute("value","Waiting for a player ...");
            console.log("New game.");
            gameRef = firebase.database().ref('currentgame').push();
            firebase.database().ref('new-game-template').once('value').then(function(snapshot) {
                gameRef.set(snapshot.val());
                gameRef.once('value').then(function(cursnapshot){
                    alert("New Game: " + cursnapshot.key);
                    gameKey = cursnapshot.key;
                    var updates = {};
                    updates["currentgame/"+gameKey+"/red"] = uid;
                    firebase.database().ref().update(updates);
                    gameJSON = readJSON(cursnapshot);
                    console.log(gameJSON);
                });
            });
            me = "r";
            competitor = "b";
        }
        wait();
    });
}

function updateChessman(){
    var i,j,k,cur,to,pid,x,y,point=0;

    for(i = 0; i < 12; i ++){
        cur = document.getElementById(competitor+i);
        if(cur != null) pid = cur.parentElement.id;
        else continue;
        if(gameJSON[competitor+i] != pid){
            if(gameJSON[competitor+i] == "null") {
                cur.parentElement.innerHTML="";
                point+=1;
                count[competitor] --;
                updateScore();
            }
            else{
                to = document.getElementById(gameJSON[competitor+i]);
                if(to == null) continue;
                if(to.childElementCount != 0){
                    to.innerHTML="";
                    appear(cur);
                    cur.parentElement.innerHTML="";
                    to.appendChild(cur);
                    alert("The competitor gets 1 point.");
                    count[me] --;
                    updateScore();
                }
                else{
                    appear(cur);
                    cur.parentElement.innerHTML="";
                    to.appendChild(cur);
                }
                continue;
            }
        }
    }
    if(point == 1){
        alert("You get 1 point!");
    }
}

function offlineTimer(timeout){
    console.log("Offline Timer: "+timeout);
    if(gameJSON["turn"] == me) return;
    if(timeout <= 0){
        gameover(false, true);
        return ;
    }
    else{
        setTimeout(function(){
            offlineTimer(timeout-1);
        }, 1000);
        return ;
    }
}

var resetTimer = false;
function updateTimer(timeout){
    if(resetTimer){
        resetTimer = false;
        return;
    }
    console.log("Timer:"+timeout);
    document.getElementById("timer").innerText = "Your turn: "+timeout;
    if(gameJSON["turn"] == me) {
        if(timeout<=0){
            gameJSON["round"] = gameJSON.round + 1;
            gameJSON["turn"] = competitor;
            firebase.database().ref("currentgame/"+gameKey).set(gameJSON);
            document.getElementById("timer").innerText = "Competitor's Turn";
            //offlineTimer(45);
            return ;
        }
        else setTimeout(function(){updateTimer(timeout-1);} , 1000);
        return;
    }
    else if(document.getElementById("timer").innerText != "Competitor's Turn"){
        document.getElementById("timer").innerText = "Competitor's Turn";
    }
    /*if(offlineflag){
        console.log("update offline:"+ eval(userJSON["offline"]) + "+1");
        var updates = {};
        updates["userdata/"+uid+"/offline"] = eval(userJSON["offline"]) + 1;
        firebase.database().ref().update(updates);
        offlineflag = false;
    }*/
    return ;
    //for the creator, update the database every 2 second
    //for the joiner, if detect the timestamp for over 3 second, delete the game and research again
}

function dbStart(){
    console.log("Database on tracking.");
    firebase.database().ref("currentgame/"+gameKey).on("value",function(snapshot){
        gameJSON = readJSON(snapshot);
        updateChessman();
        console.log("chess board refreshed");
        if(gameJSON["turn"] == me && gameJSON["red"] != "null" && gameJSON["black"] != "null") updateTimer(30);
        var t_competitor = "black", tJSON;
        if(me == "b") t_competitor = "red";
        firebase.database().ref("userdata/"+gameJSON[t_competitor]).on("value",function(snapshot){
            tJSON = readJSON(snapshot);
            competitor_email = tJSON["email"];
            console.log("Update competitor email: "+competitor_email);
        });
    });
}

function waitForAnotherPlayer(){
    if(gameJSON["black"] == "null" || gameJSON["red"] == "null" || competitor_email == "N/A"){
        console.log("Wait for another player ...");
        var updates = {};
        updates["currentgame/"+gameKey+"/timestamp"] = Date.parse(new Date());
        firebase.database().ref().update(updates);
        setTimeout(waitForAnotherPlayer, 2000);
        return;
    }
    alert("Game Begins!\n\nYour competitor is [ "+competitor_email+" ].\n\n* Please click ok in 20 sec. Otherwise, you may be considered as offline.");
    offlineTimer(50);
    if(!offlineflag){
        var updates = {};
        console.log("update offline:" + eval(userJSON["offline"]) + "+1");
        updates["userdata/"+uid+"/offline"] = eval(userJSON["offline"]) + 1;
        firebase.database().ref().update(updates);
        offlineflag = true;
    }
    init();
    document.getElementById("startButton").setAttribute("onclick","newInit();");
    document.getElementById("startButton").setAttribute("value","Start a game");
}

function wait(){
    if(gameJSON == null || gameJSON["round"] != 0) {
        console.log("Wait for a game ...");
        setTimeout(wait, 1000);
        return;
    }
    dbStart();
    waitForAnotherPlayer();
}

function newInit()
{
    //Problem, the function is a synchronized one.
    newGame();
    //IamAlive();
    //wait();
}


var blueLoop;
var greenLoop;
//var blackCount;
//var redCount;
var count = Array();
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
            if(me=="b"){
                c.setAttribute("draggable","true");
                c.setAttribute("ondragstart","drag(event)");
            }
            else console.log("I am not b:"+me);
            t.appendChild(c);
            count++;
        }
    }
    count = 0;//Create Red Chessmen
    for (var i=4; i<6; i++){
        for (var j=0; j<6; j++){
            var t = document.getElementById('g'+i+j);
            var c = document.createElement("img");
            c.src = "img/chessman-red.png";
            c.id = "r"+count;
            c.className = "chessman"
            if(me=="r"){
                c.setAttribute("draggable","true");
                c.setAttribute("ondragstart","drag(event)");
            }
            else console.log("I am not r:"+me);
            t.appendChild(c);
            count++;
            //document.getElementById('g'+i+j).innerHTML = '<img id="r'+count+'" class="chessman" draggable="true" ondragstart="drag(event)" src="img/chessman-red.png"/>';
            //count++;
        }
    }
}

function init(){
    //blackCount = 12;
    //redCount = 12;
    count[me] = 12;
    count[competitor] = 12;
	updateScore();
    blueLoop = new Array("g01","g11","g21","g31","g41","g51","l","g40","g41","g42","g43","g44","g45","l","g54","g44","g34","g24","g14","g04","l","g15","g14","g13","g12","g11","g10","l");
    greenLoop = new Array("g02","g12","g22","g32","g42","g52","l","g30","g31","g32","g33","g34","g35","l","g53","g43","g33","g23","g13","g03","l","g25","g24","g23","g22","g21","g20","l");
    setGrids();
    initChessman();
    document.getElementById("control-panel").style.display = "block";
    document.getElementById("playground").style.display = "block";
    document.getElementById("menu").style.display = "none";
}

function gameover(giveup = false, offline = false){
    if(competitor=="N/A") return;
    var i;
    var info = "";
    if(giveup){
        for(i=0;i<12;i++){
            gameJSON[me+i] = "null";
        }
        gameJSON["turn"] = competitor;
        firebase.database().ref("currentgame/"+gameKey).set(gameJSON);
    }
    if(offline){
        info += "[Time out] Player offline, game over.\n*If you are online, this game will be counted as your winning.\n\n";
        for(i=0;i<12;i++){
            gameJSON[competitor+i] = "null";
        }
        gameJSON["turn"] = competitor;
        firebase.database().ref("currentgame/"+gameKey).set(gameJSON);
    }
    var updates = {};
    if(offlineflag){
        console.log("update offline:"+ eval(userJSON["offline"]) + "-1");
        updates["userdata/"+uid+"/offline"] = userJSON["offline"] - 1;
        offlineflag = false;
    }
    if(count[me]>count[competitor]) {
        info += "Congratualtions! You win.\n";
        updates["userdata/"+uid+"/win"] = userJSON["win"] + 1;
    }
    else {
        info += "You lose.\n";
        updates["userdata/"+uid+"/lose"] = userJSON["lose"] + 1;
    }
    firebase.database().ref().update(updates);
    alert("Game Over\n\n"+info+"\nYour score: "+(count[me]-count[competitor]).toString());
    document.getElementById("control-panel").style.display = "none";
    document.getElementById("playground").style.display = "none";
    document.getElementById("menu").style.display = "block";
    resetTimer = true;
    competitor_email = "N/A";
}

function updateScore(){
    //document.getElementById("score-board").innerHTML="<b>Me "+count[me]+"</b> : "+count[competitor]+" Competitor";
    document.getElementById("my-score").innerText = "Me " + count[me];
    document.getElementById("competitor-score").innerText = count[competitor] + " Competitor";
    if(me=="r") {
        document.getElementById("my-score").setAttribute("style","color: red; font-weight: bold;");
        document.getElementById("competitor-score").setAttribute("style","color: black;");
    }
    else {
        document.getElementById("competitor-score").setAttribute("style","color: red;");
        document.getElementById("my-score").setAttribute("style","font-weight: bold;");
    }
    if(count[me]==0 || count[competitor]==0) gameover();
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
    console.log("Drop "+ev.target.id);
    var data = ev.dataTransfer.getData("text");
    var cur = document.getElementById(data);
    if ((ev.target.nodeName != 'DIV') && (ev.target.nodeName != 'div')) {
        //Evaluating capturing move here:
        if(isLegalCapturing(cur,ev.target)) {
            console.log("Capturing");
            appear(cur);
            var par = ev.target.parentElement;
            par.innerHTML="";
            par.appendChild(document.getElementById(data));//Move element
            alert("You get 1 point!");
            count[competitor] --;
            updateScore();
            return true;
        }
        return false;
    }
    if(isLegalMove(cur.parentElement,ev.target) == false) {
        alert("Illegal move.");
        return false;
    }
    console.log("Normal move");
    appear(cur);
    ev.target.appendChild(document.getElementById(data));//Move element
    return true;
}

function afterdrop(ev) {
    if(gameJSON["turn"] != me) { console.log(me + " Not your turn: "+gameJSON["turn"]); return; }
    if(dropsg(ev) == false) { console.log("Illegal move"); return; }
    var i,cur;
    for(i=0;i<12;i++){
        cur = document.getElementById(me+i);
        if(cur == null) gameJSON[me+i] = "null";
        else gameJSON[me+i] = cur.parentElement.id;
    }
    gameJSON["round"] = gameJSON.round + 1;
    if(gameJSON["turn"] == me) {
        gameJSON["turn"] = competitor;
        firebase.database().ref("currentgame/"+gameKey).set(gameJSON);
        offlineTimer(45);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    console.log("Drag "+ev.target.id);
    ev.dataTransfer.setData("text", ev.target.id);
}
