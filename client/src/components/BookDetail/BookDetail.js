import React , {useEffect, useState} from "react";

import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import { addToCart } from "../../redux/cartReducer";
import { message, Card } from "antd";
import {  getBookId } from "../../redux/bookSlice";
import { useParams } from "react-router-dom";


const BookDetails = ({ item }) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [book,setBook] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(getBookId(id));
        setBook(data?.payload);
      } catch (error) {
        // Handle errors if any
        console.error("Error fetching book:", error);
      }
    };
  
    fetchData();
  }, []);

  
  const success = () => {

    dispatch(
      addToCart({
        id: book?._id,
        title: book?.title,
        desc: book?.description,
        price: book?.price,
        img: book?.publisher,
        quantity: 1,
      })
    );

    message.success("Book has been added to cart");
  };

  console.log("booke", book)

  return (
    <>
      <div
        className="card"
        style={{ marginTop: 40, marginLeft: 30, width: "80%" }}
      >
        <div>
          <div style={{ fontSize: 24, fontWeight: "bold", paddingBottom: 10 }}>
            {book?.title}
          </div>
          <Card
            style={{}}
            cover={
              <img
                alt="example"
                src={book?.image}
              />
            }
          ></Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <div style={{ marginRight: "10px" }}>Pages: {book?.pages}</div>
            <div style={{ marginRight: "10px" }}>
              Published Year: {book?.publishedYear}
            </div>
            <div style={{ marginRight: "10px" }}>
              Publisher: {book?.publisher}
            </div>
          </div>

          <Card style={{}}>{book?.description}</Card>

          <div style={{ textAlign: "center", marginTop:20 }}>
            <Button
              variant="contained"
              onClick={() => window.open(book?.pdf,"_blank")}
              disableElevation
              style={{ marginRight: "10px" }} // Add spacing between buttons
            >
              READ ME
            </Button>

            <Button variant="contained" onClick={success} disableElevation>
              ADD TO CART
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetails;
