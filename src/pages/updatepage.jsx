import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UpdateAddress(){
     let [fullName,setFullName] = useState('');
      let [phone,setPhone] = useState('');
      let [pinCode,setPincode] = useState('');
      let [flatNumber,setFlatNumber] = useState('');
      let [area,setArea] = useState('');
      let [village,setVillage] = useState('');
      let [landMark,setLandMark] = useState('');
      let [district,setDistrict] = useState('');
      let [state,setState] = useState('');
      let [address,setAddress] = useState(null);

      let {addressId} = useParams();

      const getAddress = async () => {
        let sessionId = localStorage.getItem("sessionId");
        let userId = localStorage.getItem("userId");
        const  response = await fetch(`http://localhost:8080/address/${addressId}`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                sessionId:sessionId,
                userId:userId
            }
        })
        if(!response.ok){
            console.log("{error occured");
        }
        const data = await response.json();
        setAddress(data);
        console.log(data)
    }
    useEffect(()=>{
        getAddress();
    },[])
    useEffect(() => {
        if (address) {
          setFullName(address.fullName || "");
          setPhone(address.phone || "");
          setPincode(address.pinCode || "");
          setFlatNumber(address.flatNumber || "");
          setArea(address.area || "");
          setVillage(address.village || "");
          setLandMark(address.landMark || "");
          setDistrict(address.district || "");
          setState(address.state || "");
        }
      }, [address]);

    const inputobj ={fullName,phone,pinCode,flatNumber,area,village,landMark,district,state}
    const updateAddressfun = async () => {
        const response = await fetch(`http://localhost:8080/address/api/update-address/${addressId}`,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(inputobj)
        })
        if(!response.ok){
            console.log("error occured in updating the address");
        }
        const data = await response.text();
        alert(data);
    }

    return(
        <div className="add-address-form">
          <div className="add-address-title">Edit your address</div>
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
                  <input value = {area} className = 'address-blank' onChange={(e) => {setArea(e.target.value)}} required/>
                  </div>
                  <div className='add-address-form12'>
                  <label className="address-blank-name">Village/Town:</label>
                  <input value= {village} className = 'address-blank' onChange={(e) => {setVillage(e.target.value)}} required/>
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
                  <button className='add-address-btnn' onClick={(e) => {e.preventDefault();updateAddressfun()}}>Update address</button>
                </form>
        </div>
      )
}