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
    //const query = "SELECT * FROM schedule INNER JOIN programs on program_id = programs.id;";
    const query = "SELECT schedule.id as 'schedule_id', programs.id as 'id', name, day_of_week, start_time, start_date, end_time, end_date, base_price, member_price FROM schedule INNER JOIN programs on program_id = programs.id;";
    
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
    const query = 'INSERT INTO enrollment (user_id, course_id, schedule_id) VALUES (?)';

    const values = [req.body.user_id, req.body.course_id, req.body.schedule_id];

    db.query(query, [values], (err,data)=>{
        if(err) return res.json(err)
        return res.json("enrollment has been created successfully!")
    })
})

app.post('/enrollment2', (req, res)=>{
    const query = 'INSERT INTO enrollment (user_id, course_id, schedule_id, family_member_id) VALUES (?)';

    const values = [req.body.user_id, req.body.course_id, req.body.schedule_id, req.body.family_member_id];

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
        req.body.name
    ];

    db.query(query, [values], (err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/createprogram2", (req, res)=>{
    const query = 'INSERT INTO programs (description, max_capacity, current_enrollment, base_price, member_price, teacher_id, name, prereq_name) VALUES (?)';

    const values = [
        req.body.description,
        req.body.max_capacity,
        req.body.current_enrollment,
        req.body.base_price,
        req.body.member_price,
        req.body.teacher_id,
        req.body.name,
        req.body.name
    ];

    db.query(query, [values], (err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/scheduletable", (req, res)=>{
    const query = 'INSERT INTO schedule (program_id, start_time, end_time, day_of_week, start_date, end_date) VALUES (?)';

    const values = [
        req.body.program_id,
        req.body.start_time,
        req.body.end_time,
        req.body.day_of_week,
        req.body.start_date,
        req.body.end_date
    ];

    db.query(query, [values], (err,data)=>{
        if(err) return res.json(err)
        return res.json("program has been created successfully!")
    })
})

app.get("/registrations", (req, res)=>{
    //const query = "SELECT users.id, users.first_name as username, families.id as 'family_id', families.name as 'family_name', programs.name, start_time, end_time, day_of_week, start_date, end_date, first_name, last_name FROM enrollment INNER JOIN programs on programs.id = course_id INNER JOIN users on users.id = enrollment.user_id INNER JOIN schedule on schedule.id = enrollment.schedule_id LEFT JOIN families on families.user_id = users.id ORDER BY families.id;";
    
    const query = "SELECT users.id, families.id as 'family_id', families.name as 'family_name', programs.name, start_time, end_time, day_of_week, start_date, end_date, first_name, last_name FROM enrollment INNER JOIN programs on programs.id = course_id INNER JOIN users on users.id = enrollment.user_id INNER JOIN schedule on schedule.id = enrollment.schedule_id LEFT JOIN families on families.id = enrollment.family_member_id ORDER BY users.id;";
    
    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
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

app.post("/upgradeToMember", (req, res)=>{
    //does this mf already exist
    const query = "UPDATE users SET membership_status = 2 WHERE id = " + req.body.upgrade_id + "";
   
       db.query(query, (err, data)=>{
           if(err) return res.json(err)
           return res.json(data)
       })
})

app.post("/upgradeToFamily", (req, res)=>{
    //does this mf already exist
    const query = "UPDATE users SET family = 1 WHERE id = " + req.body.upgrade_id + "";
   
       db.query(query, (err, data)=>{
           if(err) return res.json(err)
           return res.json(data)
       })
})

app.post("/families", (req, res)=>{
    //does this mf already exist
    const query = "SELECT * FROM families WHERE user_id = " + req.body.user_id + "";
   

       db.query(query, (err, data)=>{
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

app.post("/familymember", (req, res)=>{
    
    
    const q = "INSERT INTO families (user_id, name) VALUES (?)";

    const values = [
        req.body.user_id,
        req.body.name
    ]

    db.query(q, [values], (err,data)=>{
        if(err) return res.json(err)
        return res.json("member has been created successfully!")
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