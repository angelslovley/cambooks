import React from "react";
import "./Card.scss";
import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


const style = {
  position: 'absolute' ,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Card = ({ item }) => {
  const dispatch = useDispatch();

 
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    const loggedIn = localStorage.getItem("token") || localStorage.getItem("isSubscribed")
    if(!loggedIn){
      alert("Please log in to read")
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  
  return (
    <>
    
      <div className="card">
      <Link className="link" >
        <div className="image" >
         
          <img
            src={
              item.publisher
            }
            alt=""
            className="mainImg"
          />
          
        </div>
        <p style={{
          textAlign:"center",
          marginBottom: "10px",
          fontSize:'20px',
          fontFamily:'Josefin Sans',
          fontWeight:'bold',
         

        }} >{item.title}</p>
        </Link>
        <div >
        <Button variant="contained" onClick={handleOpen} disableElevation fullWidth 
        >READ ME</Button>
         <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {item.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
           {item.description}
          </Typography>
        </Box>
      </Modal>
        </div>
        

      </div>
    
   
    </>
  );
};

export default Card;
