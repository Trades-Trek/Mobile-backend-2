export default () => ({
    DATA_ENCRYPTION_KEY:process.env.DATA_ENCRYPTION_KEY,
    DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,
    TRADES_TREK_VERSION:parseInt(process.env.TRADES_TREK_VERSION) || 2.0,
});