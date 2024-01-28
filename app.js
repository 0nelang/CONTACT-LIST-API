const express = require('express'); 
const bodyParser = require('body-parser');
const db = require('./services/db')
const app = express()
const PORT = process.env.PORT || 4000

//set body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

//set server
app.listen(PORT, (err)=>{
    if (err) throw err;
    console.log(`API running on port ${PORT}`);
})

//create data
app.post('/api/contact-create', (req, res)=>{
    const data = {...req.body}
    const querySQL = 'INSERT INTO contacts SET ?'
    // console.log(data)
    db.query(querySQL,data, (err, rows, field) => {
        if (err) {
            return res.status(500).json({msg : 'failed insert data contacts', err: err})   
        }
        res.status(200).json({success: true, msg: "Sucess insert data contacts"})
    })
})

//update data
app.put('/api/contact-update/:id', (req,res) => {
    const data = {...req.body}
    const queryFind = 'Select * FROM contacts WHERE id = ?'
    const queryUpdate = 'UPDATE contacts SET ? WHERE id = ?'
    const types = ['ID', 'SGN', 'MLY']
    db.query(queryFind, req.params.id, (err, rows, field) => {
        if (err) {
            return res.status(500).json({msg: 'query find data error', err:err})
        }

        if (rows.length) {
            if (types.includes(data.type)) {
                    db.query(queryUpdate, [data,req.params.id],  (err, rows, field) => {
                        if (err) {
                            return res.status(500).json({msg: 'failed to update data', err:err})
                        }
                        res.status(200).json({success: true, msg: "Sucess update data contacts", row: rows})
                    })
                }else{
                    return res.status(500).json({msg: 'type not found'})
                }
            } else {
                return res.status(404).json({status_code: 404, msg: `Data ${req.params.id} Not Found`})
            }

            
    })

    
})

app.delete('/api/contact-delete/:id', (req,res)=> {
    const queryFind = 'Select * FROM contacts WHERE id = ?'
    const queryDelete = 'DELETE FROM contacts WHERE id = ?'
    db.query(queryFind, req.params.id, (err, rows, field) => {
        if (err) {
            return res.status(500).json({msg: 'query find data error', err:err})
        }

        if (rows.length) {
            db.query(queryDelete, req.params.id, (err) => {
                if (err) {
                    return res.status(500).json({msg: 'failed to delete data', err:err})
                }
                res.status(200).json({success: true, msg: "data successfully deleted"})
            })
            } else {
                return res.status(404).json({status_code: 404, msg: `Data ${req.params.id} Not Found`})
            }

            
    })
})

app.get('/api/contact-show/:id', (req,res) => {
    const queryFind = 'Select * FROM contacts WHERE id = ?'
    db.query(queryFind, req.params.id, (err, rows, field) => {
        if (rows.length) {
            if (err) {
                return res.status(500).json({msg: 'failed to fetch data', err:err})
            }
            res.status(200).json({success: true, msg: "successfully fetch data", row:rows})
        }else {
            return res.status(404).json({status_code: 404, msg: `Data ${req.params.id} Not Found`})
        }
    })
})