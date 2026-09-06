import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();

const pgp = pgPromise();

const db = pgp({
    connectionString: process.env.DB_URL
});

// Verificar la conexión
db.connect()
    .then(obj => {
        console.log("✅ Conexión exitosa a PostgreSQL");
        obj.done(); // Libera la conexión
    })
    .catch(error => {
        console.error("❌ Error al conectar a PostgreSQL");
        console.error(error.message);
    });

export default db;