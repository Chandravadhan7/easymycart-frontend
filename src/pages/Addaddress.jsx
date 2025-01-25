import { useState } from "react";
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
        <div>
            <form  className='add-address' >
                  <div className='add-address1'>
                  <label>Full Name:</label>
                  <input value = {fullName} className = 'add-addressfield' placeholder='Full Name' onChange={(e) => {setFullName(e.target.value)}} required />
                  </div>
                  <div className='add-address1'>
                  <label>Phone Number:</label>
                  <input value = {phone} className = 'add-addressfield' placeholder='phone' onChange={(e) => {setPhone(e.target.value)}} required/>
                  </div>
                  <div className='add-address1'>
                  <label>Pin Code:</label>
                  <input value = {pinCode} className = 'add-addressfield' placeholder='pin code' onChange={(e) => {setPincode(e.target.value)}} required/>
                  <label>Flat Number:</label>
                  <input value = {flatNumber} className = 'add-addressfield' placeholder='Flat No.' onChange={(e) => {setFlatNumber(e.target.value)}} required/>
                  
                  </div>
                  <div className='add-address1'>
                  <label>Flat Number:</label>
                  <input value = {flatNumber} className = 'add-addressfield' placeholder='Flat No.' onChange={(e) => {setFlatNumber(e.target.value)}} required/>
                  </div>
                  <div className='add-address1'>
                  <label>Area/Locality:</label>
                  <input value = {area} className = 'add-addressfield' placeholder='Area' onChange={(e) => {setArea(e.target.value)}} required/>
                  </div>
                  <div className='add-address1'>
                  <label>Village/Town:</label>
                  <input value = {village} className = 'add-addressfield' placeholder='village' onChange={(e) => {setVillage(e.target.value)}} required/>
                  </div>
                  <div className='add-address1'>
                  <label>Landmark:</label>
                  <input value = {landMark} className = 'add-addressfield' placeholder='landmark' onChange={(e) => {setLandMark(e.target.value)}} required/>
                  </div>
                  <div className='add-address1'>
                  <label>District:</label>
                  <input value = {district} className = 'add-addressfield' placeholder='district' onChange={(e) => {setDistrict(e.target.value)}} required/>
                  </div>
                  <div className='add-address1'>
                  <label>state:</label>
                  <input value = {state} className = 'add-addressfield' placeholder='village' onChange={(e) => {setState(e.target.value)}} required/>
                  </div>
                  <button className='add-address-btn' onClick={saveAddress}>save address</button>
                </form>
        </div>
      )
}