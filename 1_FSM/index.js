const cnsl = document.getElementById("console");
const tBtn = document.getElementById("traffic_light_btn");
const mBtn = document.getElementById("movement_btn");

let temp;

function log(msg) {
    cnsl.innerHTML = msg;
}

function initTrafficLight() {
    const states = {
        green: 0,
        yellow: 1,
        red: 2
    };

    let state = states.green;

    function checkState() {
        switch (state) {
            case states.green:
                log("Green");
                state = states.yellow;
                break;
            case states.yellow:
                log("Yellow");
                state = states.red;
                break;
            case states.red:
                log("Red");
                state = states.green;
                break;
        }
    }
    
    temp = setInterval(checkState, 1000);
}

function destroyTrafficLight() {
    clearInterval(temp);
    temp = null;
}

function initMovement() {
    const states = {
        initial: 0,
        left: 1,
        right: 2
    };
    
    let state = states.initial;
    
    let x = 100;
    
    function checkState() {
        switch (state) {
            case states.initial:
                break;
            case states.left:
                x -= 5;
                state = states.initial;
                break;
            case states.right:
                x += 5;
                state = states.initial;
                break;
        }
    }
    
    function changeState(newState) {
        state = newState;
        checkState();
        log(x);
    }

    temp = document.onkeydown;
    document.onkeydown = function(event) {
        switch (event.key) {
            case "ArrowLeft":
                changeState(states.left);
                break;
            case "ArrowRight":
                changeState(states.right);
                break;
        }
    };
}

function destroyMovement() {
    document.onkeydown = temp;
    temp = null;
}

tBtn.onclick = function() {
    mBtn.classList.remove("act");
    tBtn.classList.add("act");
    destroyMovement();
    initTrafficLight();
    log("Traffic Light script loaded!");
}

mBtn.onclick = function() {
    tBtn.classList.remove("act");
    mBtn.classList.add("act");
    destroyTrafficLight();
    initMovement();
    log("Movement script loaded!");
}