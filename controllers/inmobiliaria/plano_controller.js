// CAPA DE INTERFAZ
// Controlador de planos
import fs from "fs/promises";
import path from "path";
import {
  obtenerPlanosService,
  obtenerPlanoPorIdService,
  crearPlanoService,
  actualizarPlanoService,
  eliminarPlanoService,
} from "../../services/inmobiliaria/plano_service.js";
import { procesarDWG } from "../../services/cad_service/cad.service.js";
export const getPlanosController = async (req, res) => {
  try {
    const planos = await obtenerPlanosService();
    if (!planos || planos.length === 0) {
      return res.status(404).json({ error: "No se encontraron planos" });
    }
    res.status(200).json(planos);
  } catch (error) {
    console.error("Error en getPlanosController:", error);
    res.status(500).json({ error: "Error al obtener los planos" });
  }
};

export const getPlanoByIdController = async (req, res) => {
  try {
    const { id } = req.query;
    const plano = await obtenerPlanoPorIdService(id);

    if (plano) {
      res.status(200).json(plano);
    } else {
      res.status(404).json({ error: "Plano no encontrado" });
    }
  } catch (error) {
    console.error("Error en getPlanoByIdController:", error);
    res.status(500).json({ error: "Error al obtener el plano" });
  }
};
/*
export const createPlanoController = async (req, res) => {
    try {
         const plano = {
            nombre: req.body.nombre,
            archivo_svg: req.file.filename, // <-- nombre generado por multer
            fecha_registro: req.body.fecha_registro,
            proyecto_id: req.body.proyecto_id
        }     
        const nuevoPlano = await crearPlanoService(plano);
        res.status(201).json(nuevoPlano);
    } catch (error) {
        console.error("Error en createPlanoController:", error);
        res.status(500).json({ error: "Error al crear el plano" });
    }
};*/
export const createPlanoController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Debe enviar un archivo DWG",
      });
    }

    console.log("DWG recibido:");
    console.log(req.file.path);

    // Ejecutar Python:
    // DWG -> DXF -> JSON -> SVG
    const resultadoCAD = await procesarDWG(req.file.path);

    const carpetaPlanos = path.resolve("uploads/planos");

    const nombreSVG = path.basename(resultadoCAD.rutaSVG);

    const destinoSVG = path.join(carpetaPlanos, nombreSVG);

    await fs.copyFile(resultadoCAD.rutaSVG, destinoSVG);
    await fs.unlink(req.file.path);
    console.log("Procesamiento CAD terminado");
    console.log(resultadoCAD);

    const plano = {
      nombre: req.body.nombre,

      archivo_svg: nombreSVG,

      fecha_registro: req.body.fecha_registro,

      proyecto_id: req.body.proyecto_id,
    };

    const nuevoPlano = await crearPlanoService(plano);

    res.status(201).json({
      plano: nuevoPlano,
      cad: resultadoCAD,
    });
  } catch (error) {
    console.error("Error en createPlanoController:", error);

    res.status(500).json({
      error: "Error al procesar el plano",
    });
  }
};

export const updatePlanoController = async (req, res) => {
  try {
    const { id } = req.query;

    const plano = {
      nombre: req.body.nombre,
      fecha_registro: req.body.fecha_registro,
      proyecto_id: req.body.proyecto_id,
      archivo_svg: req.file ? req.file.filename : req.body.archivo_svg,
    };

    const planoActualizado = await actualizarPlanoService(id, plano);

    res.status(200).json(planoActualizado);
  } catch (error) {
    console.error("Error en updatePlanoController:", error);
    res.status(500).json({ error: "Error al actualizar el plano" });
  }
};
export const deletePlanoController = async (req, res) => {
  try {
    const { id } = req.query;
    const resultado = await eliminarPlanoService(id);
    if (resultado) {
      res.status(200).json({ message: "Plano eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Plano no encontrado" });
    }
  } catch (error) {
    console.error("Error en deletePlanoController:", error);
    res.status(500).json({ error: "Error al eliminar el plano" });
  }
};
