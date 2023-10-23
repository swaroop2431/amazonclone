import React, { useState, useEffect } from 'react'
import './Payment.css'
import CheckoutProduct from './CheckoutProduct'
import { useStateValue } from './StateProvider'
import { Link, Navigate } from 'react-router-dom';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import axios from './axios'


function Payment() {

    const [{basket, user}, dispatch] = useStateValue();

    const stripe = useStripe();
    const elements = useElements()

    const [succeeded, setSucceeded] = useState(false)
    const [processing, setProcessing] = useState("")

    const [error, setError] = useState(null)
    const [disabled, setDisabled] = useState(true)
    const [clientSecret, setClientSecret] = useState(true)

    useEffect(() => {
        const getClientSecret = async () =>{
            const response = await axios({
                method: 'post',
                url: `/payment/create?total=${getBasketTotal(basket) * 100}`
            })
            setClientSecret(response.data.clientSecret)
        }
        getClientSecret()
    }, [basket])


    const handleSubmit = async (event) =>{

        event.preventDefault()
        setProcessing(true)

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent}) => {

            setSucceeded(true)
            setError(null)
            setProcessing(false)

            Navigate.replace('/orders')
        })
    }
    const handleChange = event =>{
        setDisabled(event.empty)
        setError(event.error ? event.error.message : "")
    }


  return (
    <div className='payment'>
      <div className="payment__container">

        <h1>
            Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>
        {/* Payment section - delivery address*/}
        <div className="payment__section">
            <div className="payment__title">
                <h3>Delivery Address </h3>
            </div>
            <div className="payment__address">
                <p>{user?.email}</p>
                <p>Taaza Kitchen</p>
                <p>Madhapur, Hyderabad</p>
            </div>
        </div>

        {/* Payment section - Review Items */}
        <div className="payment__section">
            <div className="payment__title">
                <h3>Review items and delivery</h3>
            </div>
            <div className="payment__items">
                {basket.map(item => (
                    <CheckoutProduct
                        id={item.id}
                        title={item.title}
                        image={item.image}
                        price={item.price}
                        rating={item.rating} 
                    />
                ))}
            </div>
        </div>

        {/* Payment section - Payment method */}
        <div className="payment__section">
            <div className="payment__title">
                <h3>Payment Method</h3>
            </div>
            <div className="payment__details">
                <form onSubmit={handleSubmit}>
                    <CardElement onChangle={handleChange} />

                    <div className="payment__priceContainer">
                        <CurrencyFormat
                        renderText={(value) =>(
                            <>
                                <h3>Order Total: {value}</h3>
                            </>
                        )}
                        decimalScale={2}
                        value={getBasketTotal(basket)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={'$'}
                        />
                        <button disabled={processing || disabled || succeeded}>
                            <span>{processing ? <p>Processing</p>: "Buy Now"}</span>
                        </button>
                    </div>
                    {error && <div>{error}</div>}
                </form>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
