import React, { useEffect, useState } from 'react'
import css from 'react-css-modules'
import styles from './styles.scss'
import { connect } from 'react-redux'
import axios from 'axios'
import { GRAPHQL } from 'components/globals'
import swal from 'sweetalert'

interface props {
    text?: string,
    name: string,
    email: string
}

const mapStateToProps = ({ system: { user } }) => ({
    name: user.name,
    email: user.email
})

function PaymentButton(props: props) {

    const [ready, setReady] = useState<boolean>(false)
    const [showCurrencyAlert, setShowCurrencyAlert] = useState<boolean>(false)

    useEffect(() => {
        if((window as any).Razorpay) {
            // Razorpay API already available
            return setReady(true)
        }

        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = function() {
            setReady(true)
        }
        document.body.appendChild(script)
    }, [])


    async function showDialog() {

        const response = await swal({
            title: 'Almost there!',
            icon: 'success',
            text: 'Choose a preferred currency you\'d like to be billed with.',
            buttons: {
                usd: {
                    text: 'USD ($)',
                    value: 'usd'
                },
                inr: {
                    text: 'INR (₹)',
                    value: 'inr'
                },
                request: {
                    text: 'Request a currency',
                    value: 'request'
                }
            },
        })

        if(!response) return

        if(response === 'request') {
            return window.open('/feedback')
        }

        const { data: { data } } = await axios.post(GRAPHQL, {
            query: `query($currency: String!) {
                createOrder(currency: $currency) {
                    result
                    id
                }
            }`,
            variables: {
                currency: response
            }
        })

        if(!data.createOrder.result) {
            return swal('Error!', 'There was some error generating an order ID. Please contact support.', 'error')
        }

        const options = {
            key: "rzp_test_r5vdWCmEeFON22",
            amount: '500',
            currency: 'INR',
            name: "codedamn",
            description: "500 damns to be redeemed for courses on codedamn.com",
            image: "https://codedamn.com/assets/images/red-logo.png",
            order_id: data.createOrder.id, // Order ID is generated as Orders API has been implemented. Refer the Checkout form table given below
            handler: async response => {
                
                const { data: { data } } = await axios.post(GRAPHQL, {
                    query: `query($razorpay_payment_id: String!, $razorpay_order_id: String!, $razorpay_signature: String!) {
                        addPurchasedDamns(paymentID: $razorpay_payment_id, orderID: $razorpay_order_id, signature: $razorpay_signature) {
                            status
                        }
                    }`,
                    variables: response
                })        
                
                console.log(data)

            },
            prefill: {
                name: props.name,
                email: props.email
            },
            notes: {
                address: "note value"
            },
            theme: {
                color: "#F37254"
            }
        }
        
        const rzp1 = new (window as any).Razorpay(options)

        rzp1.open()
    }

    return (
        <>
            <div styleName="payment-button" onClick={showDialog}>{props.text || "Pay Now"} {ready ? "" : "Loading"}</div>

        </>
    )
}

let com: any = css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })(PaymentButton)
com = connect(mapStateToProps, { })(com)

export default com