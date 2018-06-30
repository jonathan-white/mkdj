import React from "react";
// import { Link } from "react-router-dom";
import { Slide, Slider } from 'react-materialize'
import "./Favorites.css";

const Favorites = props => (
    <Slider className="slider">
      <Slide
        src="./Images/OfficeRoom.jpg"
      title="Office Furniture">
        Tables, desks, chairs, and more...
      </Slide>
      <Slide
        src="./Images/projector.jpg"
        title="Electronics"
      placement="left">
        Projectors and more!
      </Slide>
      <Slide
        src="./Images/pens.jpg"
        title="Office Supplies"
      placement="right">
        Ballpoint Pens, Gel Pens, Fountain Pens and more...
        </Slide>
    </Slider>
);

export default Favorites;
