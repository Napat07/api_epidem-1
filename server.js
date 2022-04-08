const express = require('express') ;
const cors = require('cors')
const app = express ()
const db = require('./db/queries')
const PORT = 8001

app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.get('/api/epidem_v1/epidem_hospital', db.epidem_hospital)
app.get('/api/epidem_v1/epidem_person/:cid', db.epidem_person)
app.get('/api/epidem_v1/epidem_report/:cid', db.epidem_report)
app.get('/api/epidem_v1/epidem_labs_report/:cid', db.epidem_labs_report)
app.get('/api/epidem_v1/epidem_vaccination/:cid', db.epidem_vaccination)
app.get('/api/v1/test', (req, res) => {
    res.status(200).send({
        code : 200,
        message : 'Server is Online'
    })
}) 
app.listen(PORT , () => {
    console.log('server is runing port : ' + PORT)
})

