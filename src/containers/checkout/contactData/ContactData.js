import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.css";
import axios from "../../../axios-order";
import Spinner from "./../../../components/UI/Spinner/Spinner";
import Input from "./../../../components/UI/Input/Input";
import {connect} from 'react-redux';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType:'input',
        elementConfig:{
          type:'text',
          placeholder:'Your name'
        },
        value:''
      },
      street: {
        elementType:'input',
        elementConfig:{
          type:'text',
          placeholder:'Street'
        },
        value:''
      },
      country: {
        elementType:'input',
        elementConfig:{
          type:'text',
          placeholder:'Country'
        },
        value:''
      },
      zipcode: {
        elementType:'input',
        elementConfig:{
          type:'text',
          placeholder:'ZIP Code'
        },
        value:''
      },
      email: {
        elementType:'input',
        elementConfig:{
          type:'text',
          placeholder:'Email'
        },
        value:''
      },
      deliveryMethod: {
        elementType:'select',
        elementConfig:{
          options:[{value:'fastest', displayValue:'fastest'},
          {value:'cheapest', displayValue:'cheapest'}
        ]
        },
        value:''
      },
    },
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();
    console.log("here----------", this.props.ings);
    const formData = {};
    this.setState({ loading: true });

    for(let formElementIdentifier in this.state.orderForm){
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }

    const order = {
      ingredient: this.props.ings,
      price: this.props.price,
      customer:formData};
      
    axios
      .post("/orders.json", order)
      .then((res) => {
        console.log(res);
        this.setState({ loading: false });
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm ={
      ...this.state.orderForm
    }
    const updatedFormElement = {...updatedOrderForm[inputIdentifier]};
    updatedFormElement.value = event.target.value;
    updatedOrderForm[inputIdentifier] = updatedFormElement;

    this.setState({orderForm:updatedOrderForm});
  }

  render() {
    const formElementsArray = [];
    for(let key in this.state.orderForm){
      formElementsArray.push({
        id:key,
        config:this.state.orderForm[key]
      });
    }
    console.log("formElelmentArray",formElementsArray);
    let form = (
      <form>
        {formElementsArray.map(formElement =>{
          <Input
          key={formElement.id}
          elementType = {formElement.config.elementType}
          elementConfig = {formElement.config.elementConfig}
          value = {formElement.config.value}
          changed={(event)=>this.inputChangedHandler(event,formElement.id)}
        />
        })}
        <Button btnType="Success" clicked={this.orderHandler}>
          Order
        </Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return{
    ings:state.ingredients,
    price:state.totalPrice
  }
};
export default connect(mapStateToProps)(ContactData);
