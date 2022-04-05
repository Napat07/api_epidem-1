const { raw } = require('express')

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '192.168.0.248',
  database: '11402',
  password: 'hos11402',
  port: 5432,
})

const epidem_hospital = (req, res) => {
  let query = `
    SELECT tp.patient_pid 
    FROM t_patient tp
  
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
  SELECT DISTINCT (tp.patient_pid),
        substring(trl.record_date_time,1,16) as report_datetime,
        substring(tvs.visit_service_treatment_date_time,1,10) as treated_date,
        substring(tvdm.visit_diag_map_date_time,1,10) as diagnosis_date,
        trl.result_lab_staff_record as informer_name,
        t_diag_icd10.diag_icd10_number as principal_diagnosis_icd10 ,
				tv.visit_pregnant as pregnant_status,
        tp.patient_house as epidem_address,
        tp.patient_moo as epidem_moo, 
        tp.patient_road as epidem_road, 
        f3.address_changwat_id as epidem_chw_code,
        f2.address_amphur_id as epidem_amp_code, 
				f1.address_tambon_type as epidem_tmb_code, 
				tp.latitude as latitude,
				tp.longitude as longitude,
				case when tor.order_price_type = '1'
                       then 'IPD'
                  when tor.order_price_type ='0'
                       then 'OPD'
                  else ''
                  end AS status	
    FROM
        t_patient tp
        inner join f_address f1 on tp.patient_tambon = f1.f_address_id
        inner join f_address f2 on tp.patient_amphur = f2.f_address_id
        inner join f_address f3 on tp.patient_changwat = f3.f_address_id
        inner join t_order tor on tp.t_patient_id = tor.t_patient_id
        inner join t_visit tv on tp.t_patient_id = tv.t_patient_id
        inner JOIN t_diag_icd10 on (tv.t_visit_id = t_diag_icd10.diag_icd10_vn and t_diag_icd10.f_diag_icd10_type_id = '1' and t_diag_icd10.diag_icd10_active ='1' )
        inner join t_result_lab trl ON tv.t_visit_id = trl.t_visit_id
        inner join t_visit_service tvs ON tv.t_visit_id = tvs.t_visit_id 
        inner join t_visit_diag_map tvdm ON tv.t_visit_id = tvdm.t_visit_id 
			
    WHERE patient_pid = '${pid}'

    ORDER BY 
		    substring(trl.record_date_time,1,16) DESC ;

   `
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    let raw_result = results.rows[0]
    let message = new Object ; 
    if (raw_result) {
        let raw = {
          epidem_report_guid : '-',
          epidem_report_group_id : "92",
          treated_hospital_code : "11402",
          report_datetime : raw_result.report_datetime,
          onset_date : '-',
          treated_date : raw_result.treated_date,
          diagnosis_date : raw_result.diagnosis_date,
          informer_name : raw_result.informer_name,
          principal_diagnosis_icd10 : raw_result.principal_diagnosis_icd10,
          epidem_person_status_id : '-',
          epidem_symptom_type_id : '-',
          pregnant_status : raw_result.pregnant_status,
          respirator_status : '-',
          epidem_accommodation_type_id : '-', 
          vaccinated_status : '-',
          exposure_epidemic_area_status : '-',
          exposure_healthcare_worker_status : '-',
          exposure_closed_contact_status : '-',
          exposure_occupation_status : '-',
          exposure_travel_status : '-', 
          risk_history_type_id : '-',
          epidem_address : raw_result.epidem_address,
          epidem_moo : raw_result.epidem_moo,
          epidem_road : raw_result.epidem_road,
          pidem_chw_code : raw_result.pidem_chw_code,
          epidem_amp_code : raw_result.epidem_amp_code,
          epidem_tmb_code : raw_result.epidem_tmb_code,
          location_gis_latitude : raw_result.latitude,
          location_gis_longitude : raw_result.longitude,
          isolate_chw_code : raw_result.epidem_chw_code,
          isolate_place_id : '-',
          patient_type : raw_result.status

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

const epidem_labs_report = (req, res) => {
  const pid = req.params.pid
  let query = `
  SELECT	
			trl.result_lab_name as epidem_lab_confirm_type_id,
			substring(trl.record_date_time,1,10) as lab_report_date,
			max(case when trim(lower(trl.result_lab_name)) like '%rna%'  then result_lab_value else '' end) as lab_report_result,
			max(case when trim(lower(trl.result_lab_name)) like '%sputum%'  then result_lab_value else '' end) as lab_report_result2,
			substring(tv.visit_begin_visit_time,1,10) as specimen_date, 
			tv.visit_dx AS lab_his_ref_name,
      tv.visit_cause_appointment as tests_reason_type_id
    FROM t_patient tp
        INNER JOIN t_visit tv ON (tp.t_patient_id = tv.t_patient_id )
        INNER JOIN t_result_lab trl ON (tv.t_visit_id = trl.t_visit_id and trl.result_lab_value <> '' )
        AND (   trim(lower(trl.result_lab_name)) like '%rna%' or  trim(lower(trl.result_lab_name)) like '%sputum%' )
    WHERE  	patient_pid = '${pid}'
				and	trl.result_lab_name like 'sputum PCR for COVID%' or trl.result_lab_name like 'SARS-CoV-2-RNA%' or trl.result_lab_name like '%rna%'
				and (trl.result_lab_value like 'SARS-CoV-2-RNA%'  or trl.result_lab_value like 'Pos%' or trl.result_lab_value like 'DE%')
    GROUP BY 
        tv.visit_begin_visit_time,
        trl.record_date_time,
        trl.result_lab_name,
        tv.visit_dx ,
        tv.visit_cause_appointment
    ORDER BY 
        substring(trl.record_date_time,1,10) DESC , 
        substring(trl.record_date_time, 12, 17) DESC ;
		
     `

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    let raw_result = results.rows[0]
    let message = new Object ; 
    if (raw_result) {
        let raw = {
          epidem_lab_confirm_type_id : raw_result.epidem_lab_confirm_type_id,
          lab_report_date: raw_result.lab_report_date,
          lab_report_result: raw_result.lab_report_result,
          specimen_date: raw_result.specimen_date,
          specimen_place_id: "11402",
          tests_reason_type_id: raw_result.tests_reason_type_id,
          lab_his_ref_code: '-',
          lab_his_ref_name: raw_result.lab_his_ref_name,
          tmlt_code: '-'
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

const epidem_vaccination = (req, res) => {
  const pid = req.params.pid
  let query = `
  SELECT  
      substring(tv.visit_begin_visit_time,1,10) as vaccine_date,
      SPLIT_PART(tv.visit_dx, 'เข็ม', 1) as vaccine_manufacturer,
      SPLIT_PART(tv.visit_dx, 'เข็ม', 2) as dose
      
    FROM t_patient tp
    INNER JOIN t_visit tv 
          ON tp.t_patient_id = tv.t_patient_id	

    WHERE tv.visit_dx like '_accine C%'
    and patient_pid = '${pid}'
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
          vaccine_hospital_code : "11402",
          vaccine_date : value.vaccine_date,
          dose : value.dose,
          vaccine_manufacturer : value.vaccine_manufacturer


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