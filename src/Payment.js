import React, { useState, useEffect } from 'react'
import './Payment.css'
import CheckoutProduct from './CheckoutProduct'
import { useStateValue } from './StateProvider'
import { Link, useNavigate } from 'react-router-dom';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import axios from './axios'
import { db } from './BaseFire';
import { collection, doc, setDoc} from 'firebase/firestore';




function Payment() {

    const navigate = useNavigate()

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
            // try{
            //     const response = await axios({
            //         method: 'post',
            //         url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
            //     })
            // }
            // catch(error){
            //     console.log('ErrorFecting:', error)
            // }
            const response = await axios({
                method: 'post',
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
            })
            setClientSecret(response.data.clientSecret)
        }
        getClientSecret()
    }, [basket])
    console.log('The secret is', clientSecret)
    console.log('user id', user)


    const handleSubmit = async (event) =>{

        event.preventDefault()
        setProcessing(true)

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            //     billing_details: {
            //         name: 'Name',
            //         description: 'Software Development services'
            //     },
             },
            // receipt_email: 'saiswaroop5521@gmail.com',

        })

        // if(payload.error){
        //     setError(`Payment failed: ${payload.error.message}`);
        //     setProcessing(false)
        // } else {
        //     const paymentIntent = payload.paymentIntent;
        //     const docRef = doc(collection(db, 'users', user?.uid, 'orders'),paymentIntent.id);
        //     await setDoc(docRef, {
        //         basket: basket,
        //         amount: paymentIntent.amount,
        //         created: paymentIntent.created,
        //     })
        //         setSucceeded(true)
        //         setError(null)
        //         setProcessing(false)

        //         dispatch({
        //             type: 'EMPTY_BASKET',
        //         })
        //         navigate('/orders')
        // }
        .then(({ paymentIntent}) => {
            console.log("Error:",paymentIntent)

            // db.collection('users')
            //     .doc(user?.id)
            //     .collection('orders')
            //     .doc(paymentIntent.id)
            //     .set({
            //         basket: basket,
            //         amount: paymentIntent.amount,
            //         created: paymentIntent.created
            //     })

            // setSucceeded(true)
            // setError(null)
            // setProcessing(false)

            // dispatch({
            //     type: 'EMPTY_BASKET'
            // })

            // navigate('/orders')
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
                    <CardElement onChange={handleChange} />

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
