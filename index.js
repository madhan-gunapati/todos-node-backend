const express = require('express');
const app = express();

const path = require('path');

const {open} = require('sqlite')

const sqlite3 = require('sqlite3');


const cors = require('cors');





Enable CORS for all origins
app.use(cors({
  origin: '*',
}));

// Parse JSON request bodies
app.use(express.json());



const dbPath = path.join(__dirname , 'tasks.db');

let db = null;



const initDBandServer = async ()=>{
    try{
        db = await open({
            filename:dbPath ,
            driver:sqlite3.Database
        });
        

        const tableHistory = await db.all(`SELECT name FROM sqlite_master WHERE type='table';
        `)
        

       
        if(tableHistory.length === 0){
            const qwery1 = `CREATE TABLE user(
                id int PRIMARY KEY NOT NULL,
                name varchar(250),
                age int
              );`
            const qwery2 = ` CREATE TABLE tasks(
                id int PRIMARY KEY NOT NULL,
                task varchar(250),
                STATUS boolean,
                user_id int,
                FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
              )`
            
             const ans1 = await db.run(qwery1)
             const ans2 = await db.run(qwery2)
               // console.log(' tables created')
              createTable = false
        }


        app.listen( process.env.PORT || 3001 , ()=>{
            console.log("Server is running")
        })
    }
    catch(e){
        console.log(`DB Error: ${e.message}`);
        process.exit(1)
    }
}
initDBandServer();



app.get('/' ,async (request , response)=>{

   
const qwery = `SELECT * FROM tasks`
const result = await db.all(qwery)


    response.send(result)
    
    
    
})

app.post('/tasks' , async(request , response)=>{
    
   
   
    let values = ''
    const tasks = request.body
    for (let item of tasks){
       
        values = values + `('${item.id}' , '${item.task}' , ${item.STATUS} , 22),`
    }
    let newValues = values.slice(0 , -1)
    // console.log('new values are')
    // console.log(newValues)
    console.log(`INSERT INTO tasks VALUES 
    '${newValues}'

 ;`)
    try{
        if(request.body!== undefined && values !== ''){
            await db.run(`delete from tasks where user_id = 22`)

            const qwery = `INSERT INTO tasks VALUES ${newValues};`
            const result = await db.run(qwery)
 
                response.send('ok')
        }
    }
    catch(e){
        console.log(e)
        response.status(500)
    }
})



