import Stripe from "stripe";
import { envVars } from "../config";

const stripe = new Stripe(envVars.stripe.secret_key as string);

export default stripe;