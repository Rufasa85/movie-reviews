const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: process.env.DB_PASSWORD,
      database: 'movies_db'
    },
    console.log(`Connected to the movies_db database.`)
  );
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/movies',(req,res)=>{
   db.query("SELECT * FROM movies",(err,data)=>{
       if(err){
           console.log(err);
           res.status(500).json(err);
       }else {
           res.json(data);
       }
   })
})

app.post("/api/add-movie",(req,res)=>{
    console.log(req.body);
    db.query("INSERT INTO movies(movie_name) VALUES(?)",[req.body.movie_name],(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json(err);
        }else {
            res.json(data.insertId);
        }
    })
})

app.delete("/api/movie/:id",(req,res)=>{
    console.log(req.params);
    db.query("DELETE FROM movies WHERE id = ?",[req.params.id],(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json(err);
        }else {
            if(data.affectedRows){
                res.json({message:`${data.affectedRows} rows deleted!`});
            } else {
                res.status(404).send("that id doesnt exist")
            }
        }
    })
})

app.get("/api/movie-reviews",(req,res)=>{
    db.query("SELECT movie_name,review FROM movies JOIN reviews ON movies.id=movie_id;",(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json(err);
        }else {
            res.json(data);
        }
    })
})

app.put("/api/update-review/:id",(req,res)=>{
    console.log(req.body);
    console.log(req.params);
    db.query("UPDATE reviews SET review = ? WHERE id = ?",[req.body.review,req.params.id],(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json(err);
        }else {
            if(data.affectedRows){
                res.json({message:`${data.affectedRows} rows updates!`});
            } else {
                res.status(404).send("that id doesnt exist")
            }
            // res.json(data);
        }
    })
})


app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
