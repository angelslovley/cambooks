import React from "react";
import "./Cart.scss";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { makeRequest } from "../../makeRequest";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";


import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";

const Cart = () => {
  const dispatch = useDispatch();
  const user=useSelector(state=>state?.user)

const products =[{desc:"sdsdd",id:"123",img:"ds",price:1500,quantity:1,title:"dsig"}]

  const handlePayment = async () => {
    console.log("user", user)

    try {
      const res = await axios.post('http://localhost:8000/paybook', {
        products: products,
        userId: 'iduser',
        total: 1500
    });
      console.log(res);
      window.location = res.data.url;

    const dataresponse =  await axios.post('http://localhost:8000/api/users/subscription', {
        userId: 'iduser',
        isSubscribed:true
    });

    localStorage.setItem("isSubscribed", dataresponse?.data?.isSubscribed)
    

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="cart">
      <h1 style={{
        textAlign: 'center',
      }} >Subscription</h1>

      <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 350,borderBottom:'1px solid #e0e0e0' ,marginBottom:5}} aria-label="simple table">
                    
                    <TableBody>
                          <TableRow
                          key={"1"}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                           
                          <TableCell align='center'>
                              <h3>Pricing stratergies</h3>
                              <p>Subscription can be segmented to gold and non-gold members</p>
                              <p>Features: Unlimited reading</p>
                              <p>Monthly Rate: 1500</p>
                          </TableCell>          
                         </TableRow>                    
                    </TableBody>
                    </Table>
            </TableContainer>

      
      
      <button onClick={handlePayment}>Subscribe the plan</button>
     
    </div>
  );
};

export default Cart;
