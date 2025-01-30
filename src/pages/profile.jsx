import './profile.css'
import LocalMallSharpIcon from '@mui/icons-material/LocalMallSharp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Person4SharpIcon from '@mui/icons-material/Person4Sharp';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { userAddress } from './fetchUserAddress';
import { Link } from 'react-router-dom';

export default function Profile(){
  let dispatch = useDispatch();
  let [toDisplay,setToDisplay] = useState('');
  const getPeofileinfo = () =>{
    setToDisplay('profile');
  }
  const getAddressInfo = () =>{
    setToDisplay('address');
  }
  useEffect(() => {
      dispatch(userAddress());
  },[])

  let address = useSelector((state) => state.address);
    let userName = localStorage.getItem('userName')
    return(
        <div className="profile-page">
            <div className='page-side1'>
               <div className='user-name'>
                   <div style={{width:'25%'}}>

                   </div>
                   <div style={{width:'75%',display:'flex',flexDirection:'column',justifyContent:'center',gap:'5%'}}>
                      <div style={{height:'20%',textAlign:'left',fontSize:'70%'}}>
                          Hello,
                      </div>
                      <div style={{height:'30%',fontWeight:'500',textAlign:'left',textTransform:'capitalize'}}>
                         {userName}
                      </div>
                   </div>
               </div>
               <div className='user-contents'>
               <div className='user-contents-cw'>
                    <div style={{width:'20%',color:'rgb(10, 101, 239)',paddingTop:'5%'}}>
                      <LocalMallSharpIcon />
                    </div>
                    <div style={{width:'80%',textAlign:'left',fontSize:'110%',lineHeight:'350%',color:'gray'}}>
                          MY ORDERS
                        </div>
                    </div>
                    <div className='user-contents-cw'>
                    <div style={{width:'20%',color:'rgb(10, 101, 239)',paddingTop:'5.3%'}}>
                       <FavoriteIcon/>
                    </div>
                    <div style={{width:'80%',textAlign:'left',fontSize:'110%',lineHeight:'350%',color:'gray'}}>
                          MY WISHLIST
                    </div>
                    </div>
                    <div className='user-contents-account'>
                        <div style={{height:"40%",display:'flex'}}>
                        <div style={{width:'20%',color:'rgb(10, 101, 239)',paddingTop:'6%'}}>
                          <Person4SharpIcon/>
                        </div>
                        <div style={{width:'80%',textAlign:'left',fontSize:'110%',lineHeight:'370%',color:'gray'}}>
                          ACCOUNT SETTINGS
                        </div>
                        </div>
                        <div className='pro-info'>
                        <div style={{width:'20%'}}>

                        </div>
                        <div style={{width:'80%',textAlign:'left',lineHeight:'300%'}} onClick={() => {getPeofileinfo()}}>
                          Profile Information
                        </div>
                        </div>
                        <div className='pro-info'>
                        <div style={{width:'20%'}}>

                        </div>
                        <div style={{width:'80%',textAlign:'left',lineHeight:'300%'}} onClick={() => {getAddressInfo()}}>
                          Manage Address
                        </div>
                        </div>
                    </div>
                    
               </div>
            </div>
            
            <div className='page-side2'>
             {
              toDisplay === 'profile'?<div className='page-side21'>
                profile
              </div>:
              <div className='page-side21'>
                  <div className='page-side21-add'>
                      <div style={{height:'25%',textAlign:'left',fontSize:'150%'}}>
                        Manage Addresses
                      </div >
                      <Link to={'/add-address'}style={{height:'40%',border: '1px solid rgb(238, 237, 237)',display:'flex',alignItems:'center',color:' rgb(10, 101, 239)',textDecoration:'none'}}>
                        <div style={{width:'5%',height:'60%',lineHeight:'300%'}}>
                          <AddIcon/>
                        </div>
                        <div style={{width:'95%',height:'60%',textAlign:'left',lineHeight:'245%',fontSize:'90%'}}>
                          ADD A NEW ADDRESS
                          </div>
                      </Link>
                  </div>
                  <div className='page-side21-addresses'>
                      {address.map((item) => {
                        return(
                          <div className='page-side21-address'>
                            <div style={{fontWeight:'bold',fontSize:'95%'}}>{item.fullName}{' '}{' '}{' '}{item.phone}</div>
                            <div style={{fontWeight:'100',fontSize:'90%'}}>{item?.flatNumber} {item?.area}, {item?.village}, {item?.district}, {item?.landMark}  ,  {item?.state}</div>
                            <div> {item?.village} - <span style={{fontWeight:'550'}}>{item?.pinCode}</span> </div>
                            <div style={{display:'flex',justifyContent:'end',gap:'3%',fontSize:'80%'}}>
                              <div>
                              <Link to={`/address/edit/${item.id}`} className="custom-link">EDIT</Link>
                              </div>
                              <div>REMOVE</div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
              </div>
             }
            </div>
            
        </div>
    )
}