window.onload = function () {
    getStates();

    updateLog = window.setInterval(function () {
        loadLog();
    }, 1000);
}

function changeState(id){
    let sensorState = document.getElementById(`${id}-state`);

    if (sensorState.style.backgroundColor == 'darkred'){
        sensorState.style.backgroundColor = 'green';
        sensorState.innerHTML = "ARMED"
        state = 'ARMED'
    }

    else {
        sensorState.style.backgroundColor = 'darkred';
        sensorState.innerHTML = "DISARMED"
        state = 'DISARMED'
    }

    fetch("/updateState", {
        method: "POST",
        body: JSON.stringify({
          widgetName: id,
          newState: state
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
}

async function getStates(){
    let sensors = document.getElementsByClassName('state-button');

    for (i=0; i < sensors.length; i++){
        let sensor = (sensors[i].id).replace('-state','')
        const response = await fetch(`/getState/${sensor}`);
        const state = await response.text();

        if (state == 'ARMED'){
            sensors[i].style.backgroundColor = 'green';
            sensors[i].innerHTML = "ARMED"
        }
        if (state == 'DISARMED'){
            sensors[i].style.backgroundColor = 'darkred';
            sensors[i].innerHTML = "DISARMED"
        }
    }
}

async function loadLog(){
    const response = await fetch(`/log`);
    const log = await response.text();

    let logDisplay = document.getElementById('log-child');
    logDisplay.innerText = log;
}