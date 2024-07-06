import express from "express";
import { methods } from "../controllers/jewerlyController.js";

const router = express.Router();

//Ruta para las consultas con ordenamiento
router.get('/joyas', async(req, res)=>{
    try {
        const queryStrings = req.query;
        const {rows, total} = await methods.getJewerly(queryStrings)
        const HATEOASresponse = await methods.HATEOAS(rows, total)
        res.json(HATEOASresponse)
    } catch (error) {
        res.status(500).json({message: "Error interno del servidor"})
        console.error(error)
    }
});
//Ruta para obtener las joyas mediante filtros
router.get('/joyas/filtros', async (req, res) => {
  try {
    const queryStrings = req.query;
    const jewerlys = await methods.getJewerlyByFilter(queryStrings);
    res.json(jewerlys);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" })
    console.error(error);
  }
});
export default router