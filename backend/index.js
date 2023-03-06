import express from "express"
import mysql from "mysql2"
import cors from "cors"

const app = express()

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database:"new_schema",
    multipleStatements: true
})

app.use(express.json())
app.use(cors())
app.get("/", (req, res)=>{
    res.json("hello this is the backend!")
})

app.get("/users", (req, res)=>{
    const query = "SELECT * FROM users"

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/programs", (req, res)=>{
    const query = "SELECT programs.id, description, max_capacity, programs.current_enrollment, base_price, member_price, name, first_name, last_name, email FROM programs INNER JOIN users ON users.id = programs.teacher_id;"

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/schedules", (req, res)=>{
    const query = "SELECT * FROM schedule INNER JOIN programs on program_id = programs.id;";

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post('/prereq', (req, res)=>{
    const query = "SELECT prereq_name FROM programs WHERE id = '" + req.body.course_id +  "'";

    //const values = [req.body.course_id];

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post('/prereq2', (req, res)=>{
    const query = "SELECT id FROM programs WHERE name = '" + req.body.prereq_name +  "' AND prereq_name IS NULL";

    //const values = [req.body.course_id];

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post('/prereq3', (req, res)=>{
    const query = "SELECT * FROM enrollment WHERE course_id = '" + req.body.prereq + "' AND user_id = '" + req.body.user_id + "'";

    //const values = [req.body.course_id];

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post('/enrollment', (req, res)=>{
    const query = 'INSERT INTO enrollment (user_id, course_id) VALUES (?)';

    const values = [req.body.user_id, req.body.course_id];

    db.query(query, [values], (err,data)=>{
        if(err) return res.json(err)
        return res.json("enrollment has been created successfully!")
    })
})

app.post("/createprogram", (req, res)=>{
    const query = 'INSERT INTO programs (description, max_capacity, current_enrollment, base_price, member_price, teacher_id, name) VALUES (?)';

    const values = [
        req.body.description,
        req.body.max_capacity,
        req.body.current_enrollment,
        req.body.base_price,
        req.body.member_price,
        req.body.teacher_id,
        req.body.name,
        req.body.prereq_name
    ];

    db.query(query, [values], (err,data)=>{
        if(err) return res.json(err)
        return res.json("program has been created successfully!")
    })
})

app.post("/search", (req, res)=>{
 //does this mf already exist
 const search = "SELECT * FROM users WHERE username = '" + req.body.username + "' OR email = '" + req.body.email + "'";
 const values = [req.body.email, req.body.username];

    db.query(search, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/login", (req, res)=>{
    const query = "SELECT * FROM users WHERE email = '" + req.body.email + "'";
    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/users", (req, res)=>{
    
    
    const q = "INSERT INTO users (first_name, last_name, current_enrollment, password, membership_status, private, username, family, email) VALUES (?)";

    const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.current_enrollment,
        req.body.password,
        req.body.membership_status,
        req.body.private,
        req.body.username,
        req.body.family,
        req.body.email
    ]

    db.query(q, [values], (err,data)=>{
        if(err) return res.json(err)
        return res.json("user has been created successfully!")
    })
})

app.listen(8802, ()=>{
    console.log("connected to backend!")
})