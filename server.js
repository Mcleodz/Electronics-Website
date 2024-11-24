const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 2000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Dashboard files
app.get('/', (req, res) =>{
  res.redirect('/home');
})

app.get('/home', (req, res) =>{
  res.sendFile(__dirname + "/public/index.html");
})

app.get('/home/script', (req, res) =>{
  res.sendFile(__dirname + "/public/index.js");
})

app.get('/styles', (req, res) =>{
  res.sendFile(__dirname + "/public/styles.css");
})

app.get('/font', (req, res) =>{
  res.sendFile(__dirname + "/src/fonts/Montserrat/Montserrat-VariableFont_wght.ttf");
})

app.post('/updateState', async (req, res) =>{
  // Declaring Variables
  const widgetName = await req.body.widgetName;
  const newState = await req.body.newState;

  const fs = require('fs');

  // Reading States File
  let statesObj = fs.readFileSync(__dirname + "/src/states.json", 'utf-8');
  let states = JSON.parse(statesObj);
  const arr = Array.from(states);

  // Finding Widget and Updating State
  for (i=0; i < arr.length; i++){
    if (arr[i].name == widgetName){
      arr[i].state = newState;
    }
  }
  statesObj = JSON.stringify(arr, null, 4);
  fs.writeFileSync(__dirname + "/src/states.json", statesObj,'utf-8')

  res.sendStatus(200);
})

app.get('/getState/:widgetName', (req, res) =>{
  const widgetName = req.params.widgetName;
  const fs = require('fs');

  // Reading States File
  let statesObj = fs.readFileSync(__dirname + "/src/states.json", 'utf-8');
  let states = JSON.parse(statesObj);
  const arr = Array.from(states);

  // Finding Widget and Updating State
  for (i=0; i < arr.length; i++){
    if (arr[i].name == widgetName){
      res.send(arr[i].state)
    }
  }
})

app.get('/trigger/:widgetName', (req, res) =>{
  const widgetName = req.params.widgetName;
  const fs = require('fs');

  // Reading States File
  let statesObj = fs.readFileSync(__dirname + "/src/states.json", 'utf-8');
  let states = JSON.parse(statesObj);
  const arr = Array.from(states);

  // Finding Widget and Updating State
  for (i=0; i < arr.length; i++){
    if (arr[i].name == widgetName){
      if (arr[i].state == 'ARMED'){
        let rawTrigger = new Date;
        let timeofTrigger = rawTrigger.toLocaleTimeString();
        let dateofTrigger = rawTrigger.toLocaleDateString();
        let data = `\n${req.params.widgetName} was triggered at ${timeofTrigger} on ${dateofTrigger}`
        fs.appendFile(__dirname + "/src/log.txt", data, (err) => {
          if (err) {
            res.sendStatus(500)
          }
          else {
            res.sendStatus(200);
          };
        })
      }
      else{
        res.sendStatus(424);
      }
    }
  }
})

app.get('/calibrating/:widgetName/:calibrationDist', (req, res) =>{
  const widgetName = req.params.widgetName;
  const refDist = req.params.calibrationDist;
  const fs = require('fs');

  // Reading States File
  let statesObj = fs.readFileSync(__dirname + "/src/states.json", 'utf-8');
  let states = JSON.parse(statesObj);
  const arr = Array.from(states);

  // Finding Widget and Updating State
  for (i=0; i < arr.length; i++){
    if (arr[i].name == widgetName){
        let rawTrigger = new Date;
        let timeofTrigger = rawTrigger.toLocaleTimeString();
        let dateofTrigger = rawTrigger.toLocaleDateString();
        let data = `\n${req.params.widgetName} was calibrated to a distance of ${refDist}cm at ${timeofTrigger} on ${dateofTrigger}`
        fs.appendFile(__dirname + "/src/log.txt", data, (err) => {
          if (err) {
            res.sendStatus(500)
          }
          else {
            res.sendStatus(200);
          };
        })
      }
    }
})

app.get('/log', (req, res) =>{
  res.sendFile(__dirname + "/src/log.txt")
})

// Starting server
app.listen(port, () => {
  console.log(`server active on 'http://localhost:${port}/home'`);
})