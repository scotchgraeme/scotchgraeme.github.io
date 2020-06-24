var answers = [
        ["Wall 1 answer 1", "Wall 1 answer 2", "Wall 1 answer 3", "Wall 1 answer 4"],
        ["Wall 2 answer 1", "Wall 2 answer 2", "Wall 2 answer 3", "Wall 2 answer 4"]
    ];
var rowColors = ["#072C5B", "#1F755B", "#4D012E", "#0B6E7D"];

var xOffset = 116;
var yOffset = 12;
var xWidth = 208;
var yHeight = 128;
var framesPerSecond = 25.0;

var walls = [
        [
            ["Answer 1", 1],
            ["Answer 14", 4],
            ["Answer 3", 1],
            ["Answer 9", 3],
            ["Answer 6", 2],
            ["Answer 15", 4],
            ["Answer 10", 3],
            ["Answer 7", 2],
            ["Answer 2", 1],
            ["Answer 11", 3],
            ["Answer 8", 2],
            ["Answer 4", 1],
            ["Answer 16", 4],
            ["Answer 12", 3],
            ["Answer 5", 2],
            ["Answer 13", 4]
        ], [
            ["2Answer 1", 1],
            ["2Answer 14", 4],
            ["2Answer 3", 1],
            ["2Answer 9", 3],
            ["A2nswer 6", 2],
            ["2Answer 15", 4],
            ["A2nswer 10", 3],
            ["An2swer 7", 2],
            ["Ans2wer 2", 1],
            ["An2swer 11", 3],
            ["An2swer 8", 2],
            ["An2swer 4", 1],
            ["Ans2wer 16", 4],
            ["Ans2wer 12", 3],
            ["Ans2wer 5", 2],
            ["Ans2wer 13", 4]
        ]
    ];

var audioPlayer = document.getElementById("audioPlayer");
var current_wall = -1;
var current_answer = 1;
var selection = [];
var positions = [];

var idle = true;
var lives = 3;


function setUpWall() {
    positions.splice(0, positions.length);
    selection.splice(0, selection.length);
    
    for (eachSquare = 0; eachSquare < 16; eachSquare++) {
        document.getElementById("square" + eachSquare).innerHTML = walls[current_wall - 1][eachSquare][0];
        document.getElementById("square" + eachSquare).setAttribute("data-group",""+walls[current_wall - 1][eachSquare][1]);
        document.getElementById("square" + eachSquare).setAttribute("data-position",""+eachSquare);
        document.getElementById("square" + eachSquare).style.left = (xOffset + xWidth * (eachSquare % 4))+"px";
        document.getElementById("square" + eachSquare).style.top = (yOffset + yHeight * Math.floor(eachSquare / 4))+"px";
        positions[eachSquare] = "square" + eachSquare;
    
        document.getElementById("square"+[eachSquare]).style.backgroundColor = "";
        document.getElementById("square"+[eachSquare]).style.color = "";
    }
    
    lives = 3;
    idle = true;
    current_answer = 1;
    
}

document.getElementById("answer").onclick = function () {
    audioPlayer.src="showQuestion.wav";
    audioPlayer.load();
    audioPlayer.play();
    
    document.getElementById("answer").style.display = "none";
    
    if(document.getElementById("answer").getAttribute("data-row")=="4") {
        document.getElementById("wall").style.display = "none";
        document.getElementById("intro").style.display = "block";
        document.getElementById("lives").style.visibility = "hidden";
        document.getElementById("life1").style.visibility = "hidden";
        document.getElementById("life2").style.visibility = "hidden";
        document.getElementById("life3").style.visibility = "hidden";
        current_wall = -1;
    }
    
    idle = true;
}

document.getElementById("reveal").onclick = function () {
    
    if(current_wall == -1)
        return;
    
    if((lives<=0)||(current_answer>4))
        return;

    resolveWall();
}

document.querySelectorAll("button.glyph").forEach((square) => {
    square.addEventListener("click", (event) => {
        
        buttonID = event.target.id;
        buttonPressed = Number(buttonID.substr(6,1));
        event.target.disabled = true;
        
        current_wall = buttonPressed;
        setUpWall();
        document.getElementById("wall").style.display="block";
        document.getElementById("intro").style.display="none";
        
        
    });
});
                            
function resolveWall() {
    for(eachPosition = 4 * (current_answer - 1); eachPosition < (positions.length - 4); eachPosition++) {
        if((eachPosition % 4) == 0) {
            findRow = document.getElementById(positions[eachPosition]).getAttribute("data-group");
        } else {
            nextPosition = eachPosition;
            while(findRow != document.getElementById(positions[nextPosition]).getAttribute("data-group")) {
                nextPosition = nextPosition + 1;
            }
            if(nextPosition != eachPosition) {
                // recut array - up to eachPosition-1 remove nextPosition from remander, and add from eachPosition
                nextArray = positions.splice(nextPosition, 1)
                positions = positions.slice(0, eachPosition).concat(nextArray, positions.slice(eachPosition, positions.length));
            }
        }
    }  
    for(eachPosition = 4 * (current_answer - 1); eachPosition < positions.length; eachPosition++) {
        eachRow = Math.floor(eachPosition / 4);
        document.getElementById(positions[eachPosition]).style.backgroundColor = rowColors[eachRow];
        document.getElementById(positions[eachPosition]).style.color = "white";    
    }
    current_answer = 3;
    audioPlayer.src="whoosh.wav";
    audioPlayer.load();
    audioPlayer.play();
        
    animatePosition(500);
}

document.querySelectorAll("span.square").forEach((square) => {
    square.addEventListener("click", (event) => {
        
        if(!idle)
            return;

        buttonID = event.target.id;
        buttonPressed = buttonID.substr(6,2);
        // dataGroup = event.target.getAttribute("data-group")
        buttonPosition = Number(event.target.getAttribute("data-position"));

        if((lives<=0)||(current_answer>4))
        {
            if(buttonPosition < (4 * (current_answer-1))) {
                idle = false;
                audioPlayer.src="questionChoiceAnswerReveal.wav";
                audioPlayer.load();
                audioPlayer.play();
                
                //show answer;    
                dataGroup = event.target.getAttribute("data-group");
                rowGroup = Math.floor(buttonPosition / 4);
                topPosition = 216;
                if(rowGroup == 1)
                    topPosition = topPosition + yHeight;
                if(rowGroup == 2)
                    topPosition = topPosition - yHeight;
                
                
                document.getElementById("answer").innerHTML = answers[current_wall - 1][dataGroup - 1];
                document.getElementById("answer").style.backgroundColor = rowColors[rowGroup];
                document.getElementById("answer").setAttribute("data-row",""+(1 + rowGroup));
                document.getElementById("answer").style.top = topPosition + "px";
                document.getElementById("answer").style.display = "flex";
            
            } else {
                //resolve the wall;
                
                resolveWall();
                
            }
            return;
        }
        
       
        // if last group then go back to wall choice (check this in answer pressed routine)
        
        // check if you can select this button - ie not in a locked group
        if(buttonPosition < (4 * (current_answer-1)))
            return;
        
        if(selection.includes(buttonID)) {
            audioPlayer.src="Windows Default.wav";
            audioPlayer.load();
            audioPlayer.play();
            
            // remove pressed button from selection and reset style
            selection.splice(selection.indexOf(buttonID), 1);
            document.getElementById(buttonID).style.backgroundColor = "";
            document.getElementById(buttonID).style.color = "";
            
        } else {
            // add pressed button to selection and amend style
            audioPlayer.src="Windows Ding.wav";
            audioPlayer.load();
            audioPlayer.play();
            
            selection.push(buttonID);
            document.getElementById(buttonID).style.backgroundColor = rowColors[current_answer - 1];
            document.getElementById(buttonID).style.color = "white";
            
            // if 4 are selected, check for a match
            if(selection.length == 4) {
                idle = false;
                setTimeout(function() {checkSelection();}, 500);
            }
        }
        
    });
});

function checkSelection() {
    // check if all 4 in same group
    // shuffle everything around
    // current_answer = current_answer + 1;
    
    var matched = true;
    
    var matchGroup = document.getElementById(selection[0]).getAttribute("data-group");
    for(eachSelection = 1; eachSelection < 4; eachSelection++)
        if(document.getElementById(selection[eachSelection]).getAttribute("data-group") != matchGroup)
            matched = false;
    
    if(matched) {
        
        // remove selections from position, insert selection at point 5
        for(eachSelection = 0; eachSelection < selection.length; eachSelection++)
            positions.splice(positions.indexOf(selection[eachSelection]), 1);
        positions = positions.slice(0, 4 * (current_answer - 1)).concat(selection, positions.slice( 4 * (current_answer-1), positions.length));
        
        selection.splice(0, selection.length);

        audioPlayer.src="whoosh.wav";
        // if current_answer is 3, also color in final group
        if(current_answer==3) {
            for(eachPosition = 12; eachPosition < 16; eachPosition++) {
                document.getElementById(positions[eachPosition]).style.backgroundColor = rowColors[current_answer - 0];
                document.getElementById(positions[eachPosition]).style.color = "white";
            }
            audioPlayer.src="mvGO.wav";
        }
        audioPlayer.load();
        audioPlayer.play();
        
        animatePosition(500);

    } else {
        // deselect everything
        audioPlayer.src="Windows Critical Stop.wav";
        
        for(eachSelection = 0; eachSelection < selection.length; eachSelection++) {
            document.getElementById(selection[eachSelection]).style.backgroundColor = "";
            document.getElementById(selection[eachSelection]).style.color = "";
        }
        selection.splice(0, 4);
        
        // check if lives to be deducted and game over
        if(current_answer == 3) {
            if(lives > 0) {
                document.getElementById("life"+lives).style.visibility="hidden";
                lives = lives - 1;
            }
            if(lives == 0)
            {
                audioPlayer.src="Windows Hardware Fail.wav";
            }
        }
        audioPlayer.load();
        audioPlayer.play();
        
        idle = true;
    }
}

function animatePosition(animationTime) {
    
    var animationDelay = 1000.0 / framesPerSecond;
    var currentTime = 0;
    var percentage = 0;
    
    setTimeout(function () {animationLoop();}, animationDelay);
    
    function animationLoop() {

        currentTime = currentTime + animationDelay;
        if(currentTime < animationTime) {
            percentage = currentTime / animationTime;
                        
            for(eachPosition = 0; eachPosition < positions.length; eachPosition++) {
                currentPosition =  Number(document.getElementById(positions[eachPosition]).getAttribute("data-position"));
                if(currentPosition != eachPosition) {
                    currentPositionX = xOffset + xWidth * (currentPosition % 4);
                    currentPositionY = yOffset + yHeight * Math.floor(currentPosition / 4);
                
                    targetPositionX = xOffset + xWidth * (eachPosition % 4);
                    targetPositionY = yOffset + yHeight * Math.floor(eachPosition / 4);
                
                    leftPosition = currentPositionX + percentage * (targetPositionX - currentPositionX);
                    topPosition = currentPositionY + percentage * (targetPositionY - currentPositionY);
                
                    document.getElementById(positions[eachPosition]).style.left = leftPosition + "px";
                    document.getElementById(positions[eachPosition]).style.top = topPosition + "px";
                }
            }
                
            setTimeout(function () {animationLoop();}, animationDelay);

        } else {
            // fix positions of squares post-animation and update html attribute
            for(eachPosition = 0; eachPosition < positions.length; eachPosition++) {
                document.getElementById(positions[eachPosition]).setAttribute("data-position", ""+eachPosition);
                document.getElementById(positions[eachPosition]).style.left = (xOffset + xWidth * (eachPosition % 4))+"px";
                document.getElementById(positions[eachPosition]).style.top = (yOffset + yHeight * Math.floor(eachPosition / 4))+"px";
            }
            current_answer = current_answer + 1;
    
            // show lives for last round
            if(current_answer == 3) {
                document.getElementById("lives").style.visibility="visible";
                document.getElementById("life3").style.visibility="visible";
                document.getElementById("life2").style.visibility="visible";
                document.getElementById("life1").style.visibility="visible";
            }
        
            if(current_answer == 4) {
                
                current_answer = 5;
                //game won! - or board resolved
            }
        
            idle = true;
        }
    }
    
}
