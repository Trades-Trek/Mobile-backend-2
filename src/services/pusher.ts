const Pusher = require("pusher");

const usePusherServices = () => {
    const config = {
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: 'eu',
        useTLS: true
    }
    const pusher = new Pusher(config);

    const dispatchEvent = async (channel, event, payload) => {
        //  await pusher.trigger(channel, event, payload)
        return true;
    }
    return {dispatchEvent}
};

export default usePusherServices()
