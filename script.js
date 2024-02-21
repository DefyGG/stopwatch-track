// variable
// display
let display = document.querySelectorAll('[id^=display]');

let runners = {1: true};
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

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

function start(){
    if(!isRunning){
        startTime = Date.now() - elapsedTime;
        timer = setInterval(update, 10);
        isRunning = true;
    }
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
    }
    else{
        if (runners[id] == true){
            selectedRunner = document.getElementById("display" + id);
            console.log("Stopping runner " + id);
            let [minutes, seconds, milliseconds] = convert(Date.now() - startTime);
    
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

function addRunner(numRunners){
    runners = {}
    for (let i = 1; i <= numRunners; i++){
        runners[i] = true;
    }
    let result = '<table style="border-radius: 20px;border:2px solid white;margin-left:auto;margin-right:auto;table-layout: fixed;width: 100%;" border=1> ';

	for (let i = 1; i <= numRunners; i++) {
		result += '<tr style = "border-color: transparent; "><td style="padding : 10px; text-align: center;"><p><b>Runner ';
        result += i; 
        result += '</b></p></td> <td style="padding : 10px; text-align: center;"><p id="display'
        result += i; 
        result += '">00:00:00</p></td> <td style="padding : 10px; text-align: center; "> <button style = "font-size: 1.5rem;font-weight: bold;padding: 10px 20px;min-width: 100px;border-style: solid;border-radius: 10px;border-color: white;cursor: pointer;color: white;transition: background-color 0.5s ease;" id="indivRunner" onclick="stop('
        result += i;
        result += ')">Stop</button> </td> </tr>'
	}
	result += "</table>";
    document.getElementsByClassName('scheds')[0].innerHTML = result;
    display = document.querySelectorAll('[id^=display]');
}
addRunner(1);