import development from "./development";
import production from "./production";
import staging from "./staging";

export default () => ({
    NODE_ENV: process.env.NODE_ENV,
    PORT: parseInt(process.env.PORT, 10) || 3000,
    ...process.env.NODE_ENV === 'development' ? development() : process.env.NODE_ENV === 'staging' ? staging() : production()
});


