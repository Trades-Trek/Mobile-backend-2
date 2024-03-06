export enum USER {
    ID = '_id',
    FIRSTNAME = 'firstName',
    LASTNAME = 'lastName',
    FULL_NAME = 'fullName',
    EMAIL = 'email',
    USERNAME = 'username',
    VERIFIED = 'verified',
    PASSWORD = 'password',

    REFERRAL_CODE = 'referral_code',

    SETTINGS = 'settings',

    SUBSCRIPTION = 'subscription',

    HAS_PIN = 'has_pin',

    HAS_SUBSCRIBED = 'has_subscribed',

    PIN = 'pin',

    TOTAL_FOLLOWERS = 'total_followers',

    WALLET = 'wallet',

    REFERRER = 'referer_code',

    TREK_COIN_BALANCE = 'trek_coin_balance',

    IN_ACTIVE_TREK_COIN_BALANCE = 'in_active_trek_coin_balance',
    TOTAL_FOLLOWING = 'total_following',


    DEFAULT_FIELDS = `${REFERRAL_CODE} ${EMAIL}, ${USERNAME} ${EMAIL} ${USERNAME} ${FIRSTNAME} ${LASTNAME} ${FULL_NAME} ${SETTINGS} ${SUBSCRIPTION} ${HAS_PIN}, ${TOTAL_FOLLOWING}, ${TOTAL_FOLLOWERS} ${TREK_COIN_BALANCE} ${WALLET} ${VERIFIED} ${HAS_SUBSCRIBED} ${REFERRER} ${IN_ACTIVE_TREK_COIN_BALANCE}`,

    DEFAULT_SERVER_FIELDS = `${DEFAULT_FIELDS} ${PASSWORD} ${PIN}`


}