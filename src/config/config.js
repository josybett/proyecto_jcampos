import dotenv from 'dotenv'

dotenv.config(
    {
        override: true,
        path:"./.env"
    }
)

export const config={
    PORT: process.env.PORT||8080,
    MONGO_URL: process.env.MONGO_URL, 
    DBNAME: process.env.DBNAME,
    MAILER: process.env.MAILER,
    MAILER_PASS: process.env.MAILER_PASS,
}