import development from "./development";
import production from "./production";
import staging from "./staging";

export default () => ({
    JWT_SECRET: process.env.JWT_SECRET,
    STARTING_CASH: process.env.STARTING_CASH,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    TREK_COINS_CONVERSION_RATE_IN_NAIRA: parseInt(process.env.TREK_COINS_CONVERSION_RATE_IN_NAIRA),
    REFERRAL_REWARD:process.env.REFERRAL_REWARD,
    RATING_REWARD:process.env.RATING_REWARD,
    REWARD_USERS_RATING:process.env.REWARD_USERS_RATING,
    MIN_STARTING_CASH:process.env.MIN_STARTING_CASH,
    MAX_STARTING_CASH:process.env.MAX_STARTING_CASH,
    CAPACITY_FEE:process.env.CAPACITY_FEE,
    PORT: parseInt(process.env.PORT, 10) || 3000,
    ...process.env.NODE_ENV === 'development' ? development() : process.env.NODE_ENV === 'staging' ? staging() : production()
});


