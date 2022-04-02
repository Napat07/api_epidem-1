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
        hospital_code : "11402",
        hospital_name : "รพ.ควนโดน",
        his_identifier : "HospitalOS version 3.9"
      
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
  SELECT 
  tp.patient_pid as cid,  
  patient_prefix_description as prefix,
  tp.patient_firstname  as first_name , 
  tp.patient_lastname as last_name, 
  f4.patient_nation_description as nationality, 
  tp.f_sex_id as gender,
  tp.patient_birthday as birth_date,
  EXTRACT(YEAR FROM AGE(CONCAT(date_part('year',CURRENT_DATE) + 543, '-',to_char(CURRENT_DATE, 'MM'), '-',to_char(CURRENT_DATE, 'DD')) ::date, tp.patient_birthday::date)) AS age_y,
  EXTRACT(MONTH FROM AGE(CONCAT(date_part('year',CURRENT_DATE) + 543, '-',to_char(CURRENT_DATE, 'MM'), '-',to_char(CURRENT_DATE, 'DD')) ::date, tp.patient_birthday::date)) AS age_m, 
  EXTRACT(DAY FROM AGE(CONCAT(date_part('year',CURRENT_DATE) + 543, '-',to_char(CURRENT_DATE, 'MM'), '-',to_char(CURRENT_DATE, 'DD')) ::date, tp.patient_birthday::date)) AS age_d,
  tp.f_patient_marriage_status_id as marital_status_id,
  tp.patient_house as address,
  tp.patient_moo as moo, 
  tp.patient_road as road, 
  f1.address_tambon_type as tmb_code, 
  f2.address_amphur_id as amp_code, 
  f3.address_changwat_id as chw_code,
  tp.patient_patient_mobile_phone as mobile_phone, 
  tp.f_patient_occupation_id as occupation

  
FROM t_patient tp
inner join f_patient_prefix on tp.f_patient_prefix_id = f_patient_prefix.f_patient_prefix_id
inner join f_address f1 on tp.patient_tambon = f1.f_address_id
inner join f_address f2 on tp.patient_amphur = f2.f_address_id
inner join f_address f3 on tp.patient_changwat = f3.f_address_id
inner join f_patient_nation f4 on tp.f_patient_nation_id = f4.f_patient_nation_id
where patient_pid = '${pid}';
    `

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    let raw_result = results.rows[0]
    let message = new Object ; 
    if (raw_result) {
      let raw = {
        cid : raw_result.cid,
        passport_no : '-',
        prefix : raw_result.prefix,
        first_name : raw_result.first_name,
        last_name : raw_result.last_name,
        nationality : raw_result.nationality,
        gender : raw_result.gender,
        birth_date : raw_result.birth_date,
        age_y : raw_result.age_y,
        age_m : raw_result.age_m,
        age_d : raw_result.age_d,
        marital_status_id : raw_result.marital_status_id,
        address : raw_result.address,
        moo : raw_result.moo,
        road : raw_result.road,
        chw_code : raw_result.chw_code,
        amp_code : raw_result.amp_code,
        tmb_code : raw_result.tmb_code,
        mobile_phone : raw_result.mobile_phone,
        occupation : raw_result.occupation
      
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