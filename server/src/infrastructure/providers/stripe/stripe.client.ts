import { env } from '@presentation/express/utils/constants/env.constants';
import Stripe from 'stripe';

const stripe = new Stripe(env.STRIPE_SCERET_KEY);

export default stripe;