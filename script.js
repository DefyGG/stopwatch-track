// variable
// display
let display = document.querySelectorAll('[id^=display]');

let runners = {1: true};
let runnerslap = {1: []};
let endTime = {1: 0}
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let runnersname = {1: "Runner 1"};
let n = 1;

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

function convert(elapsedTime){
    let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
    let seconds = Math.floor(elapsedTime / 1000 % 60);
    let milliseconds = Math.floor(elapsedTime % 1000 / 10);

    // hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");
    return [minutes, seconds, milliseconds]
}

function generateRunnerInfo() {
    let runnerInfo = "";
    for (let i = 1; i <= n; i++) {
        runnerInfo += `${runnersname[i]}: \n`;
        if (runnerslap[i] !== undefined) {
            runnerslap[i].forEach((lapTime, index) => {
                runnerInfo += `Lap ${index + 1}: ${lapTime}\n`;
            });
        }
        if (endTime[i] !== 0) {
            runnerInfo += `Final Stop Time: ${endTime[i]}\n`;
        }
        runnerInfo += "\n";
    }

    return runnerInfo;

}
function start(){
    if(!isRunning){
        startTime = Date.now() - elapsedTime;
        timer = setInterval(update, 10);
        isRunning = true;
    }
}
function lap(id){
    if (runnerslap[id] == undefined){
        runnerslap[id] = [];
    }
    if (runners[id] == true && isRunning){
        selectedRunner = document.getElementById("display" + id);
        console.log("Lapping runner " + id);
        let [minutes, seconds, milliseconds] = convert(Date.now() - startTime);
        runnerslap[id].push(`${minutes}:${seconds}:${milliseconds}`);
        addRunner(-1*n);
        // selectedRunner.textContent = `${minutes}:${seconds}:${milliseconds}`;
    }

}
function download() {
    const runnerInfo = generateRunnerInfo();
    const filename = "runner_info.txt";
    const element = document.createElement("a");
    const file = new Blob([runnerInfo], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
function share() {
    console.log("Sharing")
    const runnerInfo = generateRunnerInfo();
    const subject = "Runner Times";
    const emailBody = encodeURIComponent(runnerInfo);
    const emailLink = `mailto:?subject=${subject}&body=${emailBody}`;
    const phoneLink = `sms:?&body=${emailBody}`;
    window.location.href = phoneLink;
}
function stop(id){

    if (id == -1){
        if(isRunning){
            clearInterval(timer);
            elapsedTime = Date.now() - startTime;
            isRunning = false;
        }
        for (var key in runners){
            runners[key] = false;
        }
        for (var keys in endTime){
            if (endTime[keys] == 0){
                time = convert(Date.now() - startTime);
                let [minutes, seconds, milliseconds] = time;
                endTime[keys] = `${minutes}:${seconds}:${milliseconds}`;
            }
        }
    }
    else{
        if (runners[id] == true && isRunning){
            time = convert(Date.now() - startTime);
            let [minutes, seconds, milliseconds] = time;
            endTime[id] = `${minutes}:${seconds}:${milliseconds}`;
            selectedRunner = document.getElementById("display" + id);
            console.log("Stopping runner " + id);
    
            selectedRunner.textContent = `${minutes}:${seconds}:${milliseconds}`;
            runners[id] = false;
            
        }
        
    }
    
}

function reset(){
    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    for (let i=0; i<display.length; i++){
        display[i].textContent = "00:00:00";
    }
    for (var key in runners){
        runners[key] = true;
    }
    for (var key in runnerslap){
        runnerslap[key] = [];
    }
    for (var key in endTime){
        endTime[key] = 0;
    }
    addRunner(-1 * n);
}

function update(){
    
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;

    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let [minutes, seconds, milliseconds] = convert(elapsedTime);

    for (let i=0; i<display.length; i++){
        //Checking if runner is not stopped
        if (runners[i] == true || i == 0){
            display[i].textContent = `${minutes}:${seconds}:${milliseconds}`;
        }
    }
}

function changeName(id, name){
    console.log(id, name);
    runnersname[id] = name;
}
function checkSave(){
    modal.style.display = "block";
}
function addRunner(numRunners){
    for (let i = 1; i<=numRunners; i++){
        if (runnersname[i] == undefined){
            runnersname[i] = "Runner " + i;
        }
    }
    if (numRunners > 0){
        runners={};
        for (let i = 1; i<=numRunners; i++){
            runners[i] = true;
        }
        endTime = {};
        for (let i = 1; i<=numRunners; i++){
            endTime[i] = 0;
        }
    }
    else{
        numRunners *= -1;
    }
    n = numRunners;
    console.log(runnerslap);
    let result = '<table style="border-radius: 20px;border:2px solid white;margin-left:auto;margin-right:auto;table-layout: fixed;width: 100%;" border=1> ';

	for (let i = 1; i <= numRunners; i++) {
		result += '<tr style = "border-color: transparent; "><td style="text-align: center;"><input onChange = "changeName(' + i +  ',this.value)" style = "font-weight: bold; text-align: center; font-size: 100%;width: 100%;background: transparent; border:0px; color:white; "value = "';
        result += runnersname[i];    
        result += '"></input> <p id="display'
        result += i; 
        result += '">'
        // console.log(i, endTime[i])
        if (endTime[i] != 0){
            result += endTime[i];
        }
        else {
            result += '00:00:00';
        }
        
        result += '</p></td> <td style=" text-align: center;"><button style = "text-align: center; font-weight: bold;padding-top:5px; padding-bottom:5px; width: 70%; border-style: solid; font-size: 100%; border-radius: 10px;border-color: white;cursor: pointer;color: white;" id="indivRunner" onclick="lap('
        result += i;
        result += ')">Lap</button>';
        result += '</td> <td style="text-align: center; "> <button style = "text-align: center; font-weight: bold; height: 100%;padding-top:5px; padding-bottom:5px; width: 70%; border-style: solid; font-size: 100%; border-radius: 10px;border-color: white;cursor: pointer;color: white;" id="indivRunner" onclick="stop('
        result += i;
        result += ')">Stop</button> </td> </tr><tr style = "border-top: 5px solid white; "><td style = "border-left: none; border-right: none; border-bottom: 1px solid white;">';
        result += '<ul style="color: white; text-align: center; list-style-type:none;">';

        if (runnerslap[i] !== undefined) {
            runnerslap[i].forEach((lapTime, index) => {
                result += '<li>Lap ' + (index + 1) +  '</li>';
            });
        }

        result += '</ul>';
        
        result += '<td style = "border-left: none; border-right: none; border-bottom: 1px solid white; text-align: center"><ul style="color: white; text-align: center; list-style-type:none;">';

        if (runnerslap[i] !== undefined) {
            runnerslap[i].forEach(lapTime => {
                result += '<li>' + lapTime + '</li>';
            });
        }

        result += '</ul></td><td style = "border-left: none; border-right: none; border-bottom: 1px solid white; padding-bottom: 1px;"></td></tr>';
     
	}
	result += "</table>";
    document.getElementsByClassName('scheds')[0].innerHTML = result;
    display = document.querySelectorAll('[id^=display]');
}
addRunner(1);

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
    reset();
  }
  
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
if (event.target == modal) {
    modal.style.display = "none";
    reset();
}
}