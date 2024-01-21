const { faker } = require('@faker-js/faker');
// Get the client
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const MethodOverride = require("method-override");

app.use(MethodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"/views"));

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'user_app',
    password : 'passofmysql10@',
  });

//inserting new data- single data-
//q = "SHOW TABLES";
// let q = "INSERT INTO user (id,username,email,password) VALUES (?,?,?,?)";
// let user = ["123","123_newuser","abc@gmail.com","abc"];
// try{
// connection.query(q,user,(err, result)=>{
//     if (err) throw err;
//     console.log(result);
//     // console.log(result.length);
//     // console.log(result[0]);
//     // console.log(result[1]);
// });
// } catch(err){
//     console.log(err);
// }
// connection.end();//TO CLOSE CONNECTION

//multiple data enteries-

// let q = "INSERT INTO user (id,username,email,password) VALUES ?";
// let users = [ 
//             ["123b","123_newuserb","abc@gmail.comb","abcb"],
//             [ "123c","123_newuserc","abc@gmail.comc","abcc"],
// ];
// try{
// connection.query(q,[users],(err, result)=>{
//     if (err) throw err;
//     console.log(result);
//     // console.log(result.length);
//     // console.log(result[0]);
//     // console.log(result[1]);
// });
// } catch(err){
//     console.log(err);
// }
// connection.end();//TO CLOSE CONNECTION

// let getRandomUser = () => {
//   return {
//     //userId
//     Id: faker.string.uuid(),
//     username: faker.internet.userName(),
//     email: faker.internet.email(),
//   //  avatar: faker.image.avatar(),
//     password: faker.internet.password(),
//   //  birthdate: faker.date.birthdate(),
//   //  registeredAt: faker.date.past(),
//   };
// }

//console.log(getRandomUser());
//print data in bulk
let getRandomUser = () => {
  return [
  faker.string.uuid(),
  faker.internet.userName(),
  faker.internet.email(),
  faker.internet.password(),
  ];
};
// let q = "INSERT INTO user (id,username,email,password) VALUES ?";
// let data = [];
// for(let i = 1;i <= 100; i++){
//  // console.log(getRandomUser());
//  data.push(getRandomUser()); // 100 random user
// }
// try{
//   connection.query(q,[data],(err, result)=>{
//       if (err) throw err;
//       console.log(result);
//     });
//   } catch(err){
//       console.log(err);
//   }
//   connection.end();//TO CLOSE CONNECTION
// HOME ROUTE
app.get("/",(req,res)=>{
      let q = `SELECT count(*) FROM user`;
    //  res.send("welcome to home page");
    try{
      connection.query(q,(err, result)=>{
          if (err) throw err;
         // console.log(result[0]["count(*)"]);
         // res.send("success");
         let count = result[0]["count(*)"];
          res.render("home.ejs",{count});
        });
      } catch(err){
          console.log(err);
          res.send("some error in db");
  
      }
     // connection.end();
});
//GET/SHOW USERS ROUTE
app.get("/users",(req,res) => {
  //res.send("success");
  let q = `SELECT * FROM user `;
  try{
    connection.query(q,(err, users)=>{
        if (err) throw err;
      // console.log(result);
      //  res.send(result);
      res.render("showusers.ejs",{users});
      });
    } catch(err){
        console.log(err);
        res.send("some error in db");
    }
});

//Edit route 
app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
   // res.render("edit.ejs");
  //  console.log(id);
  try{
    connection.query(q,(err, result)=>{
        if (err) throw err;
       // console.log(result[0]);
       let user = result[0];
      res.render("edit.ejs",{user});
      });
    } catch(err){
        console.log(err);
        res.send("some error in db");
    }
});
//UPDATE (DB) ROUUTE
app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let {password:formpassword,username:newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
 // res.send("updated");
 try{
  connection.query(q,(err, result)=>{
      if (err) throw err;
     // console.log(result[0]);
     let user = result[0];
    //res.render("edit.ejs",{user});
    if(formpassword != user.password){
      res.send("wrong password");
    }else{
      let q2 = `UPDATE user SET username= '${newUsername}' WHERE id = '${id}'`;
      connection.query(q2,(err,result)=>{
        if(err)throw err;
      //  res.send(result);
      res.redirect("/users");
      });
    }
    // res.send(user);
    });
  } catch(err){
      console.log(err);
      res.send("some error in db");
  }
});

app.listen("8080",()=>{
    console.log("server is listening to port 8080");
});

  
  
// const { faker } = require('@faker-js/faker');

// export function createRandomUser(): User {
//   return {
//     userId: faker.string.uuid(),
//     username: faker.internet.userName(),
//     email: faker.internet.email(),
//     avatar: faker.image.avatar(),
//     password: faker.internet.password(),
//     birthdate: faker.date.birthdate(),
//     registeredAt: faker.date.past(),
//   };
// }
