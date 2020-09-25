import axios from "axios";
import getSymbolFromCurrency from "currency-symbol-map";
import shortid from "shortid";
import Stripe from "stripe";
import emailValidator from "email-validator";

import { clientUrl, ipdata, stripe as stripeConfig } from "../../config";
import prices from "../prices.json";
import { ApplicationError, RequestValidationError } from "../middlewares/Errors";
import Code from "../models/Code";

const DEFAULT_CURRENCY_CODE = "USD"
const MAX_CODES_PER_EMAIL = 1
const MAX_USE_COUNT = 1

const stripe = new Stripe(stripeConfig.sk);

function getPrice(req, res, next) {
    const ip = req.ip;

    var price = {
        currency: {
            code: DEFAULT_CURRENCY_CODE,
            symbol: getSymbolFromCurrency(DEFAULT_CURRENCY_CODE)
        },
        amount: prices[DEFAULT_CURRENCY_CODE]
    };

    axios.get(`${ipdata.baseUrl}/${ip}?api-key=${ipdata.apiKey}`)
        .then(response => {
            const currencyCode = response.data.currency.code;
            const amount = prices[currencyCode];

            if (!amount) return; // Currency not defined

            price = {
                currency: {
                    code: currencyCode,
                    symbol: getSymbolFromCurrency(currencyCode)
                },
                amount
            }
        })
        .catch(err => {
            next(err);
        })
        .finally(() => {
            res.status(200).send(price);
        })
}

async function validateEmail(emailAddress) {    
    if (!emailAddress || !emailValidator.validate(emailAddress)) {
        throw new RequestValidationError("Invalid email address.");
    }
    
    try {
        const query = await Code.scan("emailAddress").contains(emailAddress).count().exec();
        return (query.count < MAX_CODES_PER_EMAIL)
    } catch (err) {
        throw new ApplicationError("Could not query email address from database.");
    }
}

async function joinList(req, res, next) {
    const { emailAddress } = req.body;

    try {
        if (!await validateEmail(emailAddress)) {
            throw new RequestValidationError("You cannot join with the email address provided. It may have already been used.");
        }

        await new Code({
            "id": shortid.generate(),
            emailAddress
        }).save();

        res.status(200).json({
            success: true
        });
    } catch(err) {
        next(err);
    }
}

async function validateCode(code) {
    if (!shortid.isValid(code)) throw new RequestValidationError("Code not valid.");

    try {
        const result = await Code.get(code);
        return (result !== undefined) ? result.useCount < MAX_USE_COUNT : false;
    } catch (err) {
        throw new ApplicationError("Could not query code from database.")
    }
}

async function buy(req, res, next) {
    const { code } = req.body;
    var { currencyCode } = req.body;

    if (!currencyCode) currencyCode = DEFAULT_CURRENCY_CODE;

    try {    
        if (!await validateCode(code)) {
            throw new RequestValidationError("You can't place an order with the code provided.");
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currencyCode,
                        product_data: { name: 'Pencil' },
                        unit_amount: prices[currencyCode] * 100
                    },
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: `https://${clientUrl}/order-placed`,
            cancel_url: `https://${clientUrl}`
        });

        res.status(200).json({
            success: true,
            stripeSession: session.id
        });
    } catch(err) {
        next(err);
    }
}

function sendFuckYou(req, res) {

}

export { getPrice, joinList, buy, sendFuckYou };