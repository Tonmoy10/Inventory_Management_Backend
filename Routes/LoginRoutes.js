import express from "express"
import jwt from "jsonwebtoken"
import con from "../utils/db.js"

const router = express.Router()

router.post('/login', (req, res) => {
    if(req.body.email == "nawabikacchi1@gmail.com" && req.body.password == "Admins123") {
        const token = jwt.sign({action: "logged"}, 
        "nawabi_kacchi_online", {expiresIn: "1d"})
        res.cookie("token", token)
        return res.json({loginStatus: true})
    }
    else {
        return res.json({loginStatus: false, Error: "Invalid email or password!"})
    }
})

router.post('/add_employee', (req, res) => {
    const sql = 'INSERT INTO employees (name, position, salary, phone, address, join_date) VALUES (?)';
    const values = [
        req.body.name,
        req.body.position,
        req.body.salary,
        req.body.phone,
        req.body.address,
        req.body.join_date,
    ]
    con.query(sql, [values], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error!"})
        return res.json({Status: true})
    })
})

router.get('/employee', (req, res) => {
    const sql = 'SELECT * FROM employees';
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error!"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/get_employee/:id', (req, res) => {
    const id = req.params.id
    const sql = 'SELECT * FROM employees where id= ?';
    con.query(sql, [id] , (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error!"})
        return res.json({result})
    })
})

router.post('/edit_employee/:id', (req, res) => {
    const id = req.params.id
    const sql = 'UPDATE employees set position=?, salary=?, phone=?, address=? where id=? ';
    con.query(sql,[req.body.position, req.body.salary, req.body.phone, req.body.address, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error!"})
        return res.json({Status: true, Result: result})
    })
})

router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id
    const sql = 'DELETE from employees where id=?';
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error!"})
        return res.json({Status: true})
    })
})

export {router as loginRouter}