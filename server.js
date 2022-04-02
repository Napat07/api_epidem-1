const express = require('express') ;
const cors = require('cors')
const app = express ()
const db = require('./db/queries')
const PORT = 8000

app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.get('/api/epidem_hospital', db.epidem_hospital)
app.get('/api/epidem_person/:pid', db.epidem_person)
app.get('/api/epidem_report/:pid', db.epidem_report)
app.get('/api/epidem_labs_report/:pid', db.epidem_labs_report)
app.get('/api/epidem_vaccination/:pid', db.epidem_vaccination)

app.get('/api/v1/test', (req, res) => {
    res.status(200).send({
        code : 200,
        message : 'Server is Online'
    })
}) 
app.listen(PORT , () => {
    console.log('server is runing port : ' + PORT)
})

