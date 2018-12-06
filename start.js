


app.listen(8080);

'use strict';

// [START gae_node_request_example]
const express = require('express');

const app = express();

app.get("/",function(req,res){
	res.send(200,"Hallo Tom");
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]