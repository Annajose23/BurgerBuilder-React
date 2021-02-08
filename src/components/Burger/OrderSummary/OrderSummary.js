import React,{Component} from 'react';
import Aux from '../../../hoc/Auxilary/Auxilary';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
    componentDidUpdate(){
        console.log("order summary will update");
    }
    render() { 
        const ingredientSummary = (Object.keys(this.props.ingredients).map(igKey=>{
            return <li key={igKey}><span style={{textTransform:'capitalize'}}>{igKey}</span>: {this.props.ingredients[igKey]}</li>
        }) );
        return ( 
            <Aux>
            <h3>Your Order</h3>
            <p>Delicious Burger with following ingredients</p>
            <ul>{ingredientSummary}</ul>
            <p><strong>Total Price: {this.props.totalPrice.toFixed(2)}</strong></p>
            <p>Continue to checkout?</p>
            <Button clicked={this.props.cancelPurchase} btnType='Danger'>CANCEL</Button>
            <Button clicked={this.props.continuePurchse} btnType='Success'>CONTINUE</Button>
        </Aux>
         );
    }
}
 
export default OrderSummary;