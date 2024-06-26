import express from "express"
import jwt from "jsonwebtoken"
import con from "../utils/db.js"

const router = express.Router()

router.post('/login', (req, res) => {
    if(req.body.email == "" || req.body.password == ""){
        return res.json({Status: false, Error: "Please fill out all the fields!"})
    }
    if (req.body.email == "nawabikacchi1@gmail.com" && req.body.password == "Admins123") {
        const token = jwt.sign({ email: "nawabikacchi1@gmail.com" },
            "nawabi_kacchi_online", { expiresIn: "1d" })
        res.cookie("token", token)
        return res.json({ loginStatus: true })
    }
    else {
        return res.json({ loginStatus: false, Error: "Invalid email or password!" })
    }
})

router.post('/add_employee', (req, res) => {
    if(req.body.name == "" ||
    req.body.position == "" ||
    req.body.salary == "" ||
    req.body.phone == "" ||
    req.body.nid == "" ||
    req.body.address == "" ||
    req.body.join_date == ""){
        return res.json({Status: false, Error: "Please fill out all the fields!"})
    }

    if (/[^\w\s]/.test(req.body.name) || /[^\w\s]/.test(req.body.position)) {
        return res.json({ Status: false, Error: "Name and Position cannot contain symbols!" });
    }

    if (!/^\d+$/.test(req.body.salary) || !/^\d+$/.test(req.body.phone) || !/^\d+$/.test(req.body.nid)) {
        return res.json({ Status: false, Error: "Salary, Phone, and NID number must contain numbers only!" });
    }

    const joinDate = new Date(req.body.join_date);
    const today = new Date();

    if(joinDate > today) {
        return res.json({Status: false, Error: "Join date cannot be in the future!"});
    }

    if (!/^01/.test(req.body.phone)) {
        return res.json({ Status: false, Error: "Phone number must start with '01'!" });
    }
    const sql = 'INSERT INTO employees (name, position, salary, phone, nid, address, join_date) VALUES (?)';
    const values = [
        req.body.name,
        req.body.position,
        req.body.salary,
        req.body.phone,
        req.body.nid,
        req.body.address,
        req.body.join_date,
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error!" })
        return res.json({ Status: true })
    })
})

router.get('/employee', (req, res) => {
    const sql = 'SELECT * FROM employees';
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error!" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/get_employee/:id', (req, res) => {
    const id = req.params.id
    const sql = 'SELECT * FROM employees where id= ?';
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error!" })
        return res.json({ result })
    })
})

router.post('/edit_employee/:id', (req, res) => {
    if(req.body.position == "" || req.body.salary == "" || req.body.phone == "" || req.body.address == ""){
        return res.json({Status: false, Error: "Please fill out all the fields!"})
    }
    const id = req.params.id
    const sql = 'UPDATE employees set position=?, salary=?, phone=?, address=?, status=? where id=? ';
    con.query(sql, [req.body.position, req.body.salary, req.body.phone, req.body.address, req.body.status, id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error!" })
        return res.json({ Status: true, Result: result })
    })
})

router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id
    const sql = 'DELETE from employees where id=?';
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error!" })
        return res.json({ Status: true })
    })
})

router.get('/item', (req, res) => {
    const sql = 'SELECT * from items'
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Eror!!" })
        return res.json({ Status: true, Result: result })
    })
})

router.post('/add_item', (req, res) => {
    if(req.body.item_name == "" || req.body.stock == "" || req.body.unit == "" || req.body.minimum == ""){
        return res.json({Status: false, Error: "Please fill out all the fields!"})
    }

    if (/[^\w\s]/.test(req.body.item_name) || /[^\w\s]/.test(req.body.unit)) {
        return res.json({ Status: false, Error: "Name and Unit cannot contain symbols!" });
    }

    if (!/^\d+$/.test(req.body.stock) || !/^\d+$/.test(req.body.minimum)) {
        return res.json({ Status: false, Error: "Stock and Minimum Quantity must contain numbers only!" });
    }
    const sql = 'INSERT into items (item_name, stock, unit, minimum) values (?)'
    const values = [
        req.body.item_name,
        req.body.stock,
        req.body.unit,
        req.body.minimum
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error!" })
        return res.json({ Status: true })
    })
})

router.delete('/delete_item/:id', (req, res) => {
    const id = req.params.id
    const sql = 'DELETE from items where item_id=?'
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message })
        return res.json({ Status: true })
    })
})

router.get('/get_item/:id', (req, res) => {
    const id = req.params.id
    const sql = 'SELECT * FROM items where item_id= ?';
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error!" })
        return res.json({ result })
    })
})

router.post('/update_item/:id', (req, res) => {
    if(req.body.quantity == ""){
        return res.json({Status: false, Error: "Please enter Quantity!"})
    }
    const id = parseInt(req.params.id)
    const stock = parseFloat(req.body.stock)
    const quantity = parseFloat(req.body.quantity)
    const new_stock = stock + quantity
    if (new_stock < 0) {
        return res.json({ Status: false, Error: "Not enough item in stock!" })
    }
    // const date = new Date()
    const sql = "INSERT INTO iteminfos (item_id, quantity, previous, current) VALUES (?)";
    const values = [
        id,
        quantity,
        stock,
        new_stock
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message })
    })
    const sql2 = 'Update items set stock=? where item_id=?'
    con.query(sql2, [new_stock, id], (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message })
        return res.json({ Status: true })
    })
})

router.post('/item_record', (req, res) => {
    console.log(req.body.date)
    const sql = 'SELECT iteminfos.date, items.item_name, iteminfos.quantity, items.unit, iteminfos.previous, iteminfos.current from iteminfos inner join items on items.item_id=iteminfos.item_id where iteminfos.date = ?';
    con.query(sql, [req.body.date], (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/item_count', (req, res) => {
    const sql = "select count(item_id) as item from items";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/employee_count', (req, res) => {
    const sql = "select count(id) as employee from employees";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/salary_count', (req, res) => {
    const sql = "select sum(salary) as salary from employees";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err })
        return res.json({ Status: true, Result: result })
    })
})

router.post('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({ Status: true })
})

router.post('/add_sale', (req, res) => {
    if(req.body.sale == "" || req.body.expense == "") {
        return res.json({Status: false, Error: "Please input both the fields!"})
    }
    const sql = "INSERT INTO sales (sale, expense) VALUES (?)"
    const values= [
        req.body.sale,
        req.body.expense
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({Status: false, Error: "You Already Entered Todays's Record!"})
        return res.json({Status: true})
    })
})

router.get('/sale', (req, res) => {
    const sql = 'SELECT * FROM sales';
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: err.message });
        
        const count = result.length;

        return res.json({ Status: true, Count: count, Result: result });
    });
});

export { router as loginRouter }