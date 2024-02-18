const Pusher = require("pusher");

export const usePusher = () => {
    const config = {
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: 'eu',
        useTLS: true
    }
    return new Pusher(config);
};