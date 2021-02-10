import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-order';
import Spinner from './../../../components/UI/Spinner/Spinner';

class ContactData extends Component {
    state = { 
        name:'',
        email:'',
        address:{
            street:'',
            postalCode:''
        },
        loading:false
     }

     orderHandler = (event) =>{
        event.preventDefault();
        console.log("here----------",this.props.ingredients);
        this.setState({ loading: true });

    const order = {
      ingredient: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: "anna",
        address: {
          street: "12 firefly lane",
          town: "stars hollow",
          state: "conneticut",
          country: "America",
        },
        email: "test@test.com",
      },
      deliveryMethod: "expedited 2 days",
    };
    axios
      .post("/orders.json", order)
      .then((res) => {
        console.log(res);
        this.setState({ loading: false });
        this.props.history.push('/');
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });

     }

    render() { 
        let form = (
            <form>
            <input className={classes.Input} type="text" name="name" placeholder="enter name"></input>
            <input className={classes.Input}  type="email" name="email" placeholder="enter email"></input>
            <input className={classes.Input} type="text" name="street" placeholder="street"></input>
            <input className={classes.Input} type="text" name="postalcode" placeholder="postal code"></input>
            <Button btnType="Success" clicked={this.orderHandler}>Order</Button>
        </form>
        );
        if(this.state.loading){
            form = <Spinner/>
        }
        return ( 
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
               {form}
            </div>
         );
    }
}
 
export default ContactData;