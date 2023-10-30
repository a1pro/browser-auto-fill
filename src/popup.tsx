import React, { useEffect, useState } from 'react';
import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"
import "./style.css"
import { countryList } from "./constant.tsx";

function IndexPopup() {
  const [backResponse, setBackResponse] = useState(false)

  const data = {
    title: '',
    first_name: '',
    last_name: "",
    gender: "",
    country: "",
    dob_day:"",
    dob_month:"",
    dob_year:"",
    date_of_birth:""
  }
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    async function fetchSavedData() {
      const userData = await sendToBackground<RequestBody, ResponseBody>({
        name: "get-user-data",
        body: {},
      });
      if (userData.success)
        setFormData(userData.data);
    }
    fetchSavedData()
  }, [])

  const handleChange = (e) => {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [e.target.name]: e.target.value
      }
    })
  }

  return (
    <div
      className="popupPage popupOuter" 
      style={{
        padding: "16",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div className="formOuter">
        {
          (backResponse === true)?(
            <div className="successMsg"> Data saved successfuly ! </div>
          ):null
        }
        <h2 className="formTitle">Create An Account</h2>
        <p className="subTitle">Create an account on website name to enjoy the best services without any changes!!</p>
        <div className="fieldOuter">
          <label>Title:</label>
          <select 
            name="title"
            onChange={(e) => handleChange(e)}
            value={formData.title}
            >
            <option value="">  </option> 
            <option value="Ms"> Ms </option> 
            <option value="Miss"> Miss </option> 
            <option value="Mrs"> Mrs </option> 
            <option value="Mr"> Mr </option>
          </select>
        </div>
        <div className="fieldOuter">
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            onChange={(e) => handleChange(e)}
            value={formData.first_name}
          />
        </div>
        <div className="fieldOuter">
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            placeholder="Last Name"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="fieldOuter">
          <label>Gender:</label>
          <select 
            name="gender"
            value={formData.gender}
            onChange={(e) => handleChange(e)}
            >
            <option value="Unspecified"> Unspecified  </option> 
            <option value="Male"> Male </option> 
            <option value="Female"> Female </option> 
          </select>
        </div>
        <div className="fieldOuter">
          <label>Date Of Birth:</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            placeholder="dd/mm/yyyy"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="fieldOuter">
          <label>Country:</label>
          <select 
            name="country"
            value={formData.country}
            onChange={(e) => handleChange(e)}
            >
            {
              countryList.map((prop, key) => {
                return (
                  <option key={key} value={prop.iso.toLowerCase()}>{prop.name}</option>
                )
              })
            }
          </select>
        </div>
        <div className="fieldOuter noBorder">
          <button
            onClick={async () => {
              const response = await sendToBackground({
                name: "save-user-data",
                body: formData
              });
              if (response.success){
                setBackResponse(response.success)
                window.close();
              }
            }}>
            Save&Store
          </button>
        </div>
      </div>
      <footer className="popupFooter">Built by <a href="https://www.datamystic.com/" target="_blank">DataMystic</a></footer>
    </div>
  )
}

export default IndexPopup