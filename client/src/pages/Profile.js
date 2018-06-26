import React, { Component } from 'react';
import { Row, Col } from 'react-materialize'
import NewProduct from "../components/NewProduct";
import UserProfile from  "../components/UserProfile";

class Profile extends Component {
	constructor(props){
		super(props);
		this.state = {

        }
	}

  render() {
    return (   
        <Row>
            <Col s={6}>
                <UserProfile />
                <NewProduct />
            </Col>
            <Col s={6}>
                {/* <ListOfProducts /> */}
            </Col>
        </Row>
    );
  }
}


export default Profile;