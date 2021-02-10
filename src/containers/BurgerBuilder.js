import React, { Component } from "react";
import Aux from "../hoc/Auxilary/Auxilary";
import Burger from "./../components/Burger/Burger";
import BuildControls from "./../components/Burger/BuildControls/BuildControls";
import Modal from "../components/UI/Modal/Modal";
import OrderSummary from "./../components/Burger/OrderSummary/OrderSummary";
import axios from "../axios-order";
import Spinner from "./../components/UI/Spinner/Spinner";
import withErrorhandler from "./../hoc/withErrorHandler/withErrorHandler";
import Checkout from './checkout/Checkout';

const INGREDIENT_PRICES = {
  salad: 0.99,
  cheese: 1.99,
  meat: 3.99,
  bacon: 2.99,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    // ingredients : {
    //     salad:0,
    //     bacon:0,
    //     cheese:0,
    //     meat:0
    // },
    totalPrice: 4,
    purchasable: false,
    isPurchasing: false,
    loading: false,
  };

  updatePurchaseState = (ingredients) => {
    // const ingredients = {...this.state.ingredients};
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

    this.setState({
      purchasable: sum > 0,
    });
  };

  addIngredient = (type) => {
    const currentQuantity = this.state.ingredients[type];
    const updatedQuantity = currentQuantity + 1;
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = updatedQuantity;
    const addedPrice = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newTotalPrice = oldPrice + addedPrice;
    this.setState({
      ingredients: updatedIngredients,
      totalPrice: newTotalPrice,
    });
    this.updatePurchaseState(updatedIngredients);
  };

  removeIngredient = (type) => {
    const currentQuantity = this.state.ingredients[type];
    if (currentQuantity <= 0) {
      return;
    }
    const updatedQuantity = currentQuantity - 1;
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = updatedQuantity;
    const addedPrice = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newTotalPrice = oldPrice + addedPrice;
    this.setState({
      ingredients: updatedIngredients,
      totalPrice: newTotalPrice,
    });
    this.updatePurchaseState(updatedIngredients);
  };

  purchaseHandler = () => {
    this.setState({ isPurchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ isPurchasing: false });
  };

  purchaseContinueHandler = () => {
      const queryParams = [];
      for(let i in this.state.ingredients){
        queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
      }
      queryParams.push('price=' + this.state.totalPrice);
      const queryString = queryParams.join('&');
      this.props.history.push({
        pathname:"/checkout",
        search:"?" + queryString
      });
  };

  componentDidMount() {
    console.log(this.props);
    axios
      .get(
        "https://burgerbuilder-dd489-default-rtdb.firebaseio.com/ingredients.json"
      )
      .then((res) => {
        this.setState({ ingredients: res.data });
      }).catch(error => {
          console.log(error);
      });
  }

  render() {
    let disabledInfo = { ...this.state.ingredients };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let ordersummary = null;
    let burger = <Spinner />;
    if (this.state.ingredients) {
      burger = (
        <Aux>
          {" "}
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            ingredientAdded={this.addIngredient}
            ingredientRemoved={this.removeIngredient}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            price={this.state.totalPrice}
            puchaseHandler={this.purchaseHandler}
          />
        </Aux>
      );
      ordersummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          cancelPurchase={this.purchaseCancelHandler}
          continuePurchse={this.purchaseContinueHandler}
          totalPrice={this.state.totalPrice}
        />
      );
    }

    if (this.state.loading) {
        ordersummary = <Spinner />;
      }
  

    return (
      <Aux>
        <Modal
          show={this.state.isPurchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {ordersummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorhandler(BurgerBuilder, axios);
