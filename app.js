let express=require("express");
let app=express();
const path=require("path");
app.use(express.static(path.join(__dirname, "public")));


app.listen(8080,(req,res)=>{
    console.log("server is listening to port 8080");
    
})
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, "public", "main.html"));

})