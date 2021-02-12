import React, { Component } from "react";
import Aux from "../hoc/Auxilary/Auxilary";
import Burger from "./../components/Burger/Burger";
import BuildControls from "./../components/Burger/BuildControls/BuildControls";
import Modal from "../components/UI/Modal/Modal";
import OrderSummary from "./../components/Burger/OrderSummary/OrderSummary";
import axios from "../axios-order";
import Spinner from "./../components/UI/Spinner/Spinner";
import withErrorhandler from "./../hoc/withErrorHandler/withErrorHandler";
import Checkout from "./checkout/Checkout";
import { connect } from "react-redux";
import * as actionTypes from "../store/actions";


class BurgerBuilder extends Component {
  state = {
    // ingredients: null,
    // ingredients : {
    //     salad:0,
    //     bacon:0,
    //     cheese:0,
    //     meat:0
    // },
    // totalPrice: 4,
    //  purchasable: false,
    isPurchasing: false,
    loading: false,
  };

  updatePurchaseState = (ingredients) => {
    // const ingredients = {...this.props.ings};
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

   return sum>0;
  };

  // updatePurchaseState = (ingredients) => {
  //   // const ingredients = {...this.props.ings};
  //   const sum = Object.keys(ingredients)
  //     .map((igKey) => {
  //       return ingredients[igKey];
  //     })
  //     .reduce((sum, el) => {
  //       return sum + el;
  //     }, 0);

  //   this.setState({
  //     purchasable: sum > 0,
  //   });
  // };

  // addIngredient = (type) => {
  //   const currentQuantity = this.props.ings[type];
  //   const updatedQuantity = currentQuantity + 1;
  //   const updatedIngredients = { ...this.props.ings };
  //   updatedIngredients[type] = updatedQuantity;
  //   const addedPrice = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newTotalPrice = oldPrice + addedPrice;
  //   this.setState({
  //     ingredients: updatedIngredients,
  //     totalPrice: newTotalPrice,
  //   });
  //   this.updatePurchaseState(updatedIngredients);
  // };

  // removeIngredient = (type) => {
  //   const currentQuantity = this.props.ings[type];
  //   if (currentQuantity <= 0) {
  //     return;
  //   }
  //   const updatedQuantity = currentQuantity - 1;
  //   const updatedIngredients = { ...this.props.ings };
  //   updatedIngredients[type] = updatedQuantity;
  //   const addedPrice = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newTotalPrice = oldPrice + addedPrice;
  //   this.setState({
  //     ingredients: updatedIngredients,
  //     totalPrice: newTotalPrice,
  //   });
  //   this.updatePurchaseState(updatedIngredients);
  // };

  purchaseHandler = () => {
    this.setState({ isPurchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ isPurchasing: false });
  };

  // purchaseContinueHandler = () => {
  //   const queryParams = [];
  //   for (let i in this.props.ings) {
  //     queryParams.push(
  //       encodeURIComponent(i) +
  //         "=" +
  //         encodeURIComponent(this.props.ings[i])
  //     );
  //   }
  //   queryParams.push("price=" + this.props.price);
  //   const queryString = queryParams.join("&");
  //   this.props.history.push({
  //     pathname: "/checkout",
  //     search: "?" + queryString,
  //   });
  // };

  purchaseContinueHandler = () => {
    this.props.history.push("/checkout");
  };

  componentDidMount() {
    console.log(this.props);
    axios
      .get(
        "https://burgerbuilder-dd489-default-rtdb.firebaseio.com/ingredients.json"
      )
      .then((res) => {
        this.setState({ ingredients: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    let disabledInfo = { ...this.props.ings };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let ordersummary = null;
    let burger = <Spinner />;
    if (this.props.ings) {
      burger = (
        <Aux>
          {" "}
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onAddIngredient}
            ingredientRemoved={this.props.onRemoveIngredient}
            disabled={disabledInfo}
            purchasable={this.updatePurchaseState(this.props.ings)}
            price={this.props.price}
            puchaseHandler={this.purchaseHandler}
          />
        </Aux>
      );
      ordersummary = (
        <OrderSummary
          ingredients={this.props.ings}
          cancelPurchase={this.purchaseCancelHandler}
          continuePurchse={this.purchaseContinueHandler}
          totalPrice={this.props.price}
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

const mapStateToProps = (state) => {
  return {
    ings: state.ingredients,
    price:state.totalPrice
  };
};

const mapDispatchToprops = (dispatch) => {
  return {
    onAddIngredient: (igName) =>
      dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: igName }),
    onRemoveIngredient: (igName) =>
      dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: igName }),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToprops
)(withErrorhandler(BurgerBuilder, axios));
