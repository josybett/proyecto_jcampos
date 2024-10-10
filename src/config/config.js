import dotenv from 'dotenv'

dotenv.config(
    {
        override: true,
        path:"./.env"
    }
)

export const config={
    PORT:process.env.PORT||8080,
    MONGO_URL:process.env.MONGO_URL, 
    DBNAME:process.env.DBNAME
}