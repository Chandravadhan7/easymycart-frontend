import { useState } from "react";
import "./Addaddress.css"
export default function Addaddress(){
      let [fullName,setFullName] = useState('');
      let [phone,setPhone] = useState('');
      let [pinCode,setPincode] = useState('');
      let [flatNumber,setFlatNumber] = useState('');
      let [area,setArea] = useState('');
      let [village,setVillage] = useState('');
      let [landMark,setLandMark] = useState('');
      let [district,setDistrict] = useState('');
      let [state,setState] = useState('');


      const inputobj = {fullName,phone,pinCode,flatNumber,area,village,landMark,district,state};
      const saveAddress = async function(){
        if(!validate()) return;
        let sessionKey = localStorage.getItem('sessionId');
        let userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:8080/address/`,{
          method:'POST',
          headers:{
            'Content-Type': 'application/json',
            sessionId:sessionKey,
            userId:userId
          },
          body:JSON.stringify(inputobj)
        })
        const data = await response.json();
        console.log(data);
      }

      let isValid = true;
  const validate = () =>{
    if(!fullName){
      isValid = false;
    }
    if(!phone){
      isValid = false;
    }
    if(!pinCode){
      isValid = false;
    }
    if(!flatNumber){
      isValid = false;
    }
    if(!area){
      isValid = false;
    }
    if(!village){
      isValid = false;
    }
    if(!landMark){
      isValid = false;
    }
    if(!district){
      isValid = false;
    }
    if(!state){
      isValid = false;
    }

  }
      return(
        <div className="add-address-form">
          <div className="add-address-title">Add a new address</div>
            <form  className='add-address-form1' >
                  <div className='add-address-form12'>
                  <label className="address-blank-name">Full Name:</label>
                  <input value = {fullName} className = 'address-blank'  onChange={(e) => {setFullName(e.target.value)}} required />
                  </div>
                  <div className='add-address-form12'>
                  <label className="address-blank-name">Phone Number:</label>
                  <input value = {phone} className = 'address-blank' onChange={(e) => {setPhone(e.target.value)}} required/>
                  </div>
                  <div className='add-address-form12'>
                  <label className="address-blank-name">Pin Code:</label>
                  <input value = {pinCode} className = 'address-blank'  onChange={(e) => {setPincode(e.target.value)}} required/>
                  </div>
                  <div className='add-address-form12'>
                  <label className="address-blank-name">Flat Number:</label>
                  <input value = {flatNumber} className = 'address-blank'  onChange={(e) => {setFlatNumber(e.target.value)}} required/>
                  </div>
                
                  <div className='add-address-form12'>
                  <label className="address-blank-name">Area/Locality:</label>
                  <input value = {area} className = 'address-blank' Change={(e) => {setArea(e.target.value)}} required/>
                  </div>
                  <div className='add-address-form12'>
                  <label className="address-blank-name">Village/Town:</label>
                  <input value = {village} className = 'address-blank' onChange={(e) => {setVillage(e.target.value)}} required/>
                  </div>
                  <div className='add-address-form12'>
                  <label className="address-blank-name">Landmark:</label>
                  <input value = {landMark} className = 'address-blank'  onChange={(e) => {setLandMark(e.target.value)}} required/>
                  </div>
                  <div className='add-address-form12'>
                  <label className="address-blank-name">District:</label>
                  <input value = {district} className = 'address-blank'  onChange={(e) => {setDistrict(e.target.value)}} required/>
                  </div>
                  <div className='add-address-form12'>
                  <label className="address-blank-name">state:</label>
                  <input value = {state} className = 'address-blank'  onChange={(e) => {setState(e.target.value)}} required/>
                  </div>
                  <button className='add-address-btnn' onClick={saveAddress}>Add address</button>
                </form>
        </div>
      )
}