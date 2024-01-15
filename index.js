import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import pg from "pg";



const app = express();
const port = 3000;
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "secrets",
    password: "admin",
    port: 5433,
  });

db.connect();

app.get("/", (req, res)=>{
    res.render("home.ejs")
})

app.get("/login", (req, res)=>{
    res.render("login.ejs")
})
app.get("/register", (req, res)=>{
    res.render("register.ejs")
})

app.get("/secrets", (req, res)=>{
    res.render("secrets.ejs")
})
//Register
app.post("/register", async (req, res)=>{
    const email = req.body["username"];
    const password = req.body["password"];
   
    try{
    const result2 = await db.query(
      "SELECT email FROM users WHERE LOWER(email) LIKE  $1 ;",
        [ email.toLowerCase()]
    )
      const data = result2.rows.length;
      console.log(data);
      if(data === 0 ){
        try{
            await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email,password]);
            
            res.render("secrets.ejs");
            
            
          } catch (err) {
            console.log(err);
            
            res.render("register.ejs", {
             
              error: " Error....",
            });
            
          }
      }else{
        
        res.render("login.ejs", {
             
            error: "This acount is already exists! please login with Email",
          });
          console.log("This acount is already exists! please login with Email")
      }
 
  } catch (err) {
    console.log(err);
    
      res.render("/", {
     
      error: "Error!!",
    });
    
  }

})

//Login
app.post("/login", async (req, res)=>{
    const email = req.body["username"];
    const password = req.body["password"];
     
    try{
        const result2 =await db.query("SELECT * FROM users WHERE LOWER(email) LIKE  $1 ;",
        [ email.toLowerCase()]);

          const dataLength = result2.rows.length;
          const data =result2.rows[0];
          console.log(data);
          if(dataLength !== 0 && data.password === password){         
                
                res.render("secrets.ejs");
                console.log("you have an acount");         
         }else{
            
            res.render("login.ejs", {
                 
                error: "you have entered wrong password! ",
              });
             
          }
     
      } catch (err) {
        console.log(err);
        
          res.render("/", {
         
          error: "Error!!",
        });
        
      }
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  