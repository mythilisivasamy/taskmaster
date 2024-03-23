const express = require('express');
let cors = require("cors");
let bodyparser=require("body-parser");
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

app.use(express.static(__dirname+"/public/dist/task-master-fe"))
app.get('/*',(req,res)=>{
   res.redirect('http://localhost:8003');
})

app.listen(8000,()=>{
    console.log("sever is listening at 8003")
});
