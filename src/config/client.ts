export default () => ({
    ENCRYPTION_KEY:'dsdsdsdekl323oidsk@d',
    ENCRYPTION_IV:process.env.ENCRYPTION_IV,
    DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,
    TRADES_TREK_VERSION:parseInt(process.env.TRADES_TREK_VERSION) || 2.0,
});