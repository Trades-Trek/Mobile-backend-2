export enum USER {
    ID = '_id',
    FIRSTNAME = 'firstName',
    LASTNAME = 'lastName',
    FULL_NAME = 'fullName',
    EMAIL = 'email',
    USERNAME = 'username',

    PASSWORD = 'password',

    REFERRAL_CODE = 'referralCode',

    SETTINGS = 'settings',

    SUBSCRIPTION = 'subscription',

    HAS_PIN = 'has_pin',

    PIN = 'pin',

    TOTAL_FOLLOWERS = 'total_followers',
    TOTAL_FOLLOWING = 'total_following',


    DEFAULT_FIELDS = `${REFERRAL_CODE} ${EMAIL}, ${USERNAME} ${EMAIL} ${USERNAME} ${FIRSTNAME} ${LASTNAME} ${FULL_NAME} ${SETTINGS} ${SUBSCRIPTION} ${HAS_PIN}, ${TOTAL_FOLLOWING}, ${TOTAL_FOLLOWERS}`,

    DEFAULT_SERVER_FIELDS = `${DEFAULT_FIELDS} ${PASSWORD} ${PIN}`


}