const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '192.168.0.248',
  database: '11402',
  password: 'hos11402',
  port: 5432,
})

const epidem_hospital = (req, res) => {
  const pid = req.params.pid
  let query = `
    
  
  `
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }

    let raw_result = results.rows[0]
    let message = new Object ; 
    if (raw_result) {
      let raw = {

      }
      message.msg = true
      message.data = raw

    }
    else {
      message.msg = false 
      message.data = {}
    }
    res.status(200).json(message)
  })
}

const epidem_person = (req, res) => {
  const pid = req.params.pid
  let query = `
 
    `

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    let raw_result = results.rows
    let result_total = []
    let message = new Object ; 
    if (raw_result.length > 0) {
      for (let value of raw_result) {
        let raw = {
         
        }
        result_total.push(raw)
      }
      message.msg = true 
      message.data = result_total
    }
    else {
      message.msg = false 
      message.data = result_total
    }
    res.status(200).json(message)
  })
}

const epidem_report = (req, res) => {
  const pid = req.params.pid
  let query = `
  

   `
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    let raw_result = results.rows
    let result_total = []
    let message = new Object ; 
    if (raw_result.length > 0) {
      for (let value of raw_result) {
        let raw = {
         
        }
        result_total.push(raw)
      }
      message.msg = true 
      message.data = result_total
    }
    else {
      message.msg = false 
      message.data = result_total
    }
    res.status(200).json(message)
  })
}

const epidem_labs_report = (req, res) => {
  const pid = req.params.pid
  let query = `
  
     `

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    let raw_result = results.rows
    let result_total = []
    let message = new Object ; 
    if (raw_result.length > 0) {
      for (let value of raw_result) {
        let raw = {
        
        
        }
        result_total.push(raw)
      }
      message.msg = true 
      message.data = result_total
    }
    else {
      message.msg = false 
      message.data = result_total
    }
    res.status(200).json(message)
  })
}

const epidem_vaccination = (req, res) => {
  const pid = req.params.pid
  let query = `
 
 
  `
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    let raw_result = results.rows
    let message = new Object ; 
    let result_total = []
    if (raw_result.length > 0) {
      for (let value of raw_result) {
        let raw = {
       


        }
        result_total.push(raw)
      }
      message.msg = true 
      message.data = result_total
    }
    else {
      message.msg = false 
      message.data = result_total
    }
  res.status(200).json(message)
  })


}

module.exports = {
  epidem_hospital,
  epidem_person,
  epidem_report,
  epidem_labs_report,
  epidem_vaccination
}