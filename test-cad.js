import { procesarDWG } from "./services/cad_service/cad.service.js";
const rutaDWG =
    "C:\\Users\\luchi\\Documents\\Luis_Unidad\\PROYECTOS_PROGRAMACION\\CONSTRUCTORA\\campoo\\repla ali.dwg";

async function main() {

    try {

        console.log("========================================");
        console.log("PRUEBA NODE -> PYTHON -> DEMO");
        console.log("========================================");

        console.log("DWG:");
        console.log(rutaDWG);

        console.log();
        console.log("Ejecutando demo.py...");

        const resultado = await procesarDWG(rutaDWG);

        console.log();
        console.log("========================================");
        console.log("PYTHON TERMINÓ CORRECTAMENTE");
        console.log("========================================");

        console.log(resultado);

    } catch (error) {

        console.error();
        console.error("========================================");
        console.error("ERROR");
        console.error("========================================");

        console.error(error.message);
    }
}

main();