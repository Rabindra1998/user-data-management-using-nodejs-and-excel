
// DATABASE = college1
// DATABASE_HOST = localhost
// DATABASE_ROOT = root
// DATABASE_PASSWORD = password

const express = require('express');
const mysql = require("mysql");
const dotenv = require('dotenv');
const app = express();
const session = require('express-session');
dotenv.config({ path: './.env'});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "college1"
})

db.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
})

app.set('view engine', 'hbs');

const path = require("path")

const publicDir = path.join(__dirname, './public')

app.use(express.static(publicDir))

// const bodyparser = require('body-parser')
// // const fs = require('fs');
// const readXlsxFile = require('read-excel-file/node');
// const multer = require('multer')
// // body-parser middleware use
// app.use(bodyparser.json())
// app.use(bodyparser.urlencoded({
//     extended: true
// }))
// Multer Upload Storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//        cb(null,__basedir + '/uploads/')
//     },
//     filename: (req, file, cb) => {
//        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
//     }
// });
// const upload = multer({storage: storage});
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

const xlsx=require('xlsx');

// (D) IMPORT EXCEL
app.get("/read-excel-data", (req, res) => {
    
    res.render("read-excel-data");
})
app.post("/auth/read-excel-data", (request, response) => {    
let userexcel=request.body.uploadfile;
    let workbook=xlsx.readFile("userexcel.xlsx"),
worksheet = workbook.Sheets[workbook.SheetNames[0]],
    range = xlsx.utils.decode_range(worksheet["!ref"]);
 
for (let row=range.s.r; row<=range.e.r; row++) {
    // (D1) READ CELLS
    let data = [];
    for (let col=range.s.c; col<=range.e.c; col++) {
      let cell = worksheet[xlsx.utils.encode_cell({r:row, c:col})];
      data.push(cell.v);
    }
    let sql = "INSERT INTO college1.userdata1 (name,contact,email,password,date) VALUES (?,?,?,?,?)";
  db.query(sql, data, (err, results, fields) => {
    if (err) { return console.error(err.message); }
    console.log("USER ID:" + results.insertId);
  });
    console.log(data);
}
response.send("read from excel");
})


app.get("/", (req, res) => {
    res.render("index")
})
app.get("/login", (req, res) => {
    res.render("login")
})

// const bcrypt = require("bcryptjs");




//read excel data and enter in database ----------------------------------------------------------------------------------

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
//   });
// app.post('/uploadfile', upload.single("uploadfile"), (req, res) =>{
//     importExcelData2MySQL(__basedir + '/uploads/' + req.file.filename);
//      console.log(res);
// });

// function importExcelData2MySQL(filePath){
//     readXlsxFile(filePath).then((rows) => {
//         console.log(rows);
//         rows.shift();
//         b.connect((error) => {
//             if (error) {
//                 console.error(error);
//             } else {
//                 let query = 'INSERT INTO college1.userdata (name,email,contact,password,regisdate) VALUES ?';
//                 connection.query(query, [rows], (error, response) => {
//                 console.log(error || response);
//             });
//         }
//     });
//     })
// }
 
// login------------------------------------------------------------------------------------------
app.post("/auth/login", (request, response) => {    
 let name=request.body.name;
 let password=request.body.password;   
if(name && password)
{
db.query('SELECT * FROM college1.userdata1 WHERE name = ? AND password = ?', [name, password], function(error, results) {
       if (error) throw error
        if (results.length > 0)
         {
            // Authenticate the user
            request.session.loggedin = true;
            request.session.username = name;
            // Redirect to home page
            // response.redirect('/auth/view data');
            response.send('login successfully');
            // response.send()
        }
         else {
            response.send('Incorrect Username and/or Password!');
        }		
        response.end();
    })       
}
else{
   response.send('Please enter Username and Password!');
		response.end();
}
})

// excel line----------------------------------------------------------------------------------------
// const excel = require('exceljs');
// const { error } = require('console');

// app.get("/view-data", (req, res) => {
    
//     res.render("view-data")
// })
// app.post("/auth/view-data", (request, response) => {
//     let date=request.body.date;
// db.query("SELECT * FROM college1.userdata where regisdate = ? ",[date],function(error, results) {
//     // (C1) EXTRACT DATA FROM DATABASE
//     if (error) throw error
//     if(results.length > 0){
//     var data = [];
//     results.forEach(row => {
//       data.push([row["name"], row["contact"],row["email"],row["regisdate"]]);
//     });


// // (C2) WRITE TO EXCEL FILE
// var worksheet = xlsx.utils.aoa_to_sheet(data),
// workbook = xlsx.utils.book_new();
// xlsx.utils.book_append_sheet(workbook, worksheet, "Users");
// xlsx.writeFile(workbook, "demo.xlsx");
// response.send("data send to excel");
// }
// });

// });



   

app.listen(5500, ()=> {
console.log("server started on port 5500");
})
