export default () => ({
    DB_URL:process.env.DB_URL_DEVELOPMENT,
    DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,
});