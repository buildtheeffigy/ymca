import express from "express"
import mysql from "mysql2"
import cors from "cors"
import sha256 from 'crypto-js/sha256.js'

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

//Pulls all users, and all user's data
app.get("/users", (req, res)=>{
    const query = "SELECT * FROM users"

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})


//Returns data on all programs, used for the program search pages
app.get("/schedules", (req, res)=>{
    const query = "SELECT schedule.id as 'schedule_id', programs.id as 'id', teacher_id, name, day_of_week, canceled, start_time, start_date, end_time, end_date, base_price, member_price, max_capacity, current_enrollment FROM schedule INNER JOIN programs on program_id = programs.id;";

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

//Soft delete account
app.post('/deleteaccount',(req, res)=>{
    const query = "UPDATE users SET deleted = 1 WHERE id = '" + req.body.user_id +  "'";

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

//hard delete account
app.post('/harddelete', (req, res)=>{
    const query = "DELETE from users WHERE id = '" + req.body.user_id + "'";

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

//returns program/schedule data for all programs CREATED BY THIS SPECIFIC USER, that AREN'T CANCELED
app.post('/staffschedule', (req, res)=>{
    const query = "SELECT teacher_id, program_id, start_time, canceled, end_time, day_of_week, start_date, end_date, description, name, max_capacity, current_enrollment, base_price, member_price FROM new_schema.schedule LEFT JOIN new_schema.programs on programs.id = program_id WHERE teacher_id="+req.body.teach_id+" AND canceled=0;";
    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

//returns all programs that the current user is enrolled in
app.post('/personalschedule', (req, res)=>{
    const query = "SELECT schedule_id, program_id, start_time, canceled, end_time, day_of_week, start_date, end_date, description, name, max_capacity, current_enrollment, base_price, member_price FROM new_schema.enrollment LEFT JOIN new_schema.schedule on schedule.id = schedule_id LEFT JOIN new_schema.programs on programs.id = course_id WHERE user_id = '" + req.body.user_id + "';";
    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

//returns all programs that the current user is enrolled in, and takes family stuff into account
app.post('/personalschedulefamily', (req, res)=>{
    const query = "SELECT schedule_id, program_id, start_time, canceled, end_time, day_of_week, start_date, end_date, description, name, max_capacity, current_enrollment, base_price, member_price FROM new_schema.enrollment LEFT JOIN new_schema.schedule on schedule.id = schedule_id LEFT JOIN new_schema.programs on programs.id = course_id WHERE user_id = '" + req.body.user_id + "' AND family_member_id = '" + req.body.family_member_id + "';";
    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

//Drops a class
app.post('/droppersonalclass', (req, res)=>{
    const query = "DELETE from enrollment WHERE schedule_id = '" + req.body.schedule_id + "' AND user_id = '" + req.body.user_id + "';";

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

//Drops a family member's class
app.post('/droppersonalclassfamily', (req, res)=>{
    const query = "DELETE from enrollment WHERE schedule_id = '" + req.body.schedule_id + "' AND user_id = '" + req.body.user_id + "' AND family_member_id = '"+ req.body.family_member_id +"';";

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

//the following three functions are used one after the other in order to properly check if the user has taken prerequisite classes that are needed.
app.post('/prereq', (req, res)=>{
    const query = "SELECT prereq_name FROM programs WHERE id = '" + req.body.course_id +  "'";

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post('/prereq2', (req, res)=>{
    const query = "SELECT id FROM programs WHERE name = '" + req.body.prereq_name +  "' AND prereq_name IS NULL";

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post('/prereq3', (req, res)=>{
    const query = "SELECT * FROM enrollment WHERE course_id = '" + req.body.prereq + "' AND user_id = '" + req.body.user_id + "'";

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

//used for normal accounts to enroll in a class
app.post('/enrollment', (req, res)=>{
    const query = 'INSERT INTO enrollment (user_id, course_id, schedule_id) VALUES (?)';

    const values = [req.body.user_id, req.body.course_id, req.body.schedule_id];

    db.query(query, [values], (err,data)=>{
        if(err) return res.json(err)
        return res.json("enrollment has been created successfully!")
    })
})

//used specifically for family members to enroll
app.post('/enrollment2', (req, res)=>{
    const query = 'INSERT INTO enrollment (user_id, course_id, schedule_id, family_member_id) VALUES (?)';

    const values = [req.body.user_id, req.body.course_id, req.body.schedule_id, req.body.family_member_id];

    db.query(query, [values], (err,data)=>{
        if(err) return res.json(err)
        return res.json("enrollment has been created successfully!")
    })
})

//Modifies the current enrollment counts for a program
app.post('/increaseSeats', (req, res)=>{
      const query="UPDATE programs SET current_enrollment="+req.body.enrol+" WHERE id="+req.body.program_id+"";

      db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

//create program without prerequisite
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

//create program that needs a prerequisite
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

//Cancels a program
app.post('/cancelProgram', (req, res)=>{
      const query="UPDATE programs SET canceled=1 WHERE id="+req.body.program_id+"";

      db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

//creates new entry in the schedule table, used for creating multiple days for the same class
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

//Used for checking registration conflicts
app.get("/registrations", (req, res)=>{
    const query = "SELECT users.id, families.id as 'family_id', programs.id as 'programID', families.name as 'family_name', programs.name, start_time, end_time, day_of_week, start_date, end_date, first_name, last_name FROM enrollment INNER JOIN programs on programs.id = course_id INNER JOIN users on users.id = enrollment.user_id INNER JOIN schedule on schedule.id = enrollment.schedule_id LEFT JOIN families on families.id = enrollment.family_member_id ORDER BY users.id;";

    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/search", (req, res)=>{
 //does this user already exist
 const search = "SELECT * FROM users WHERE username = '" + req.body.username + "' OR email = '" + req.body.email + "'";
 const values = [req.body.email, req.body.username];

    db.query(search, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/upgradeToMember", (req, res)=>{
    //upgrades the normal account to a YMCA member account
    const query = "UPDATE users SET membership_status = 2 WHERE id = " + req.body.upgrade_id + "";

       db.query(query, (err, data)=>{
           if(err) return res.json(err)
           return res.json(data)
       })
})

app.post("/upgradeToFamily", (req, res)=>{
    //upgrades a normal account to a family account
    const query = "UPDATE users SET family = 1 WHERE id = " + req.body.upgrade_id + "";

       db.query(query, (err, data)=>{
           if(err) return res.json(err)
           return res.json(data)
       })
})

app.post("/families", (req, res)=>{
    //gets all family members associated with a single family account id
    const query = "SELECT * FROM families WHERE user_id = " + req.body.user_id + "";

       db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
         })
   })

   //lets administrators delete family members on family accounts
app.post("/deletefamilymember", (req, res)=>{
    const query = "DELETE FROM families WHERE id = " + req.body.id;
    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
         })
})


//function that we used to figure out if the login info has been used for a soft deleted account
app.post("/login", (req, res)=>{
    const query = "SELECT * FROM users WHERE email = '" + req.body.email + "' AND deleted IS NULL";
    db.query(query, (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

//adding a new family member
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

//creates new user with proper hashed password
app.post("/users", (req, res)=>{
    const q = "INSERT INTO users (first_name, last_name, current_enrollment, password, membership_status, private, username, family, email) VALUES (?)";

    const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.current_enrollment,
        sha256(req.body.password),
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
