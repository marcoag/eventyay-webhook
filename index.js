const crypto = require("crypto");

// Require express and body-parser
const express = require("express")
const bodyParser = require("body-parser")
const { exec } = require('child_process');

// Initialize express and define a port
const app = express()
const PORT = 3000

const branch = "marcoag/test_hook";

const { WEBHOOK_SECRET } = process.env;

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

app.use(bodyParser.json())

app.post("/hook", (req, res) => {
  const expectedSignature = "sha1=" +
        crypto.createHmac("sha1", WEBHOOK_SECRET)
            .update(JSON.stringify(req.body))
            .digest("hex");

  const signature = req.headers["x-hub-signature"];
  if (signature !== expectedSignature){
    console.loc("Invalid signature");
    throw new Error("Invalid signature.");
  }
  else{
    if(req.body.ref == "refs/heads/" + branch){
      console.log("valid signature");
      console.log(req.body) // Call your action on the request here
  
      var command = "git fetch -a && git checkout " + branch;
      exec(command, {
        cwd: '/home/asia/open-event-server'
      }, function(error, stdout, stderr){
        console.log('done')
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
      })
  
      command = "git pull";
      exec(command, {
        cwd: '/home/asia/open-event-server'
      }, function(error, stdout, stderr){
        console.log('done')
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
      })
  
      command = "docker stop opev-celery opev-web opev-postgres opev-redis";
      exec(command, {
        cwd: '/home/asia/open-event-server'
      }, function(error, stdout, stderr){
        console.log('done')
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
      })

      command = "docker-compose -f docker-compose.yml up -d";
      exec(command, {
        cwd: '/home/asia/open-event-server'
      }, function(error, stdout, stderr){
        console.log('done')
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
      })
    }
  }
  res.status(200).end() // Responding is important
});
