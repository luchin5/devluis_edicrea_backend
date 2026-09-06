import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
function ejecutarPython(script, argumentos = []) {
    return new Promise((resolve, reject) => {

        const proceso = spawn(
            "python",
            [
                script,
                ...argumentos
            ],
            {
                windowsHide: true
            }
        );

        let stdout = "";
        let stderr = "";

        proceso.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        proceso.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        proceso.on("close", (codigo) => {

            if (codigo !== 0) {
                console.error("===== ERROR PYTHON =====");
                console.error("Código:", codigo);
                console.error("STDOUT:");
                console.error(stdout);
                console.error("STDERR:");
                console.error(stderr);
                        
                reject(
                    new Error(
                        `Python terminó con código ${codigo}`
                    )
                );
            
                return;
            }

            resolve(stdout);
        });
    });
}


async function procesarDWG(rutaDWG) {

    // ========================================================
    // UBICACIÓN DE LOS SCRIPTS PYTHON
    // ========================================================

    const directorioActual = path.dirname(
        fileURLToPath(import.meta.url)
    );

    const scriptDemo = path.join(
        directorioActual,
        "../../python/demo.py"
    );

    const scriptSVG = path.join(
        path.dirname(scriptDemo),
        "generar_svg_2.py"
    );


    // ========================================================
    // 1. EJECUTAR DEMO.PY
    // ========================================================

    console.log("");
    console.log("========================================");
    console.log("EJECUTANDO DEMO.PY");
    console.log("========================================");

    const resultadoDemo = await ejecutarPython(
        scriptDemo,
        [rutaDWG]
    );


    // ========================================================
// 2. UBICAR JSON GENERADO
// ========================================================

const directorioDWG = path.dirname(rutaDWG);

const nombreDWG = path.basename(
    rutaDWG,
    path.extname(rutaDWG)
);

const rutaJSON = path.join(
    directorioDWG,
    "_dxf_convertido",
    `${nombreDWG}_lotes_extraidos.json`
);
const rutaDXF = path.join(
    directorioDWG,
    "_dxf_convertido",
    `${nombreDWG}.dxf`
);

// ========================================================
// 3. EJECUTAR GENERAR_SVG.PY
// ========================================================

console.log("");
console.log("========================================");
console.log("EJECUTANDO GENERAR_SVG.PY");
console.log("========================================");

const resultadoSVG = await ejecutarPython(
    scriptSVG,
    [
        rutaJSON,
        rutaDXF
    ]
);


// ========================================================
// 4. UBICAR SVG GENERADO
// ========================================================

const rutaSVG = path.join(
    directorioDWG,
    "_dxf_convertido",
    `${nombreDWG}_lotes_extraidos.svg`
);


// ========================================================
// VALIDAR SVG
// ========================================================

try {

    await fs.access(rutaSVG);

} catch {

    throw new Error(
        `Python terminó correctamente, pero no se encontró el SVG:\n${rutaSVG}`
    );

}


// ========================================================
// RESULTADO FINAL
// ========================================================

return {
    rutaDWG,
    rutaJSON,
    rutaSVG,
    salidaDemo: resultadoDemo,
    salidaSVG: resultadoSVG
};
}


export {
    ejecutarPython,
    procesarDWG
};