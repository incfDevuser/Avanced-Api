import format from "pg-format";
import pool from "../config/db.js";
const getJewerly = async ({ limits = 10, order_by = "id_ASC", page = 1 }) => {
  try {
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits;
    const formateddQuery = format(
      "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s",
      campo,
      direccion,
      limits,
      offset
    );
    const response = await pool.query(formateddQuery);
    const cantidad = await pool.query('SELECT COUNT(*) FROM inventario')
    return{
      rows: response.rows,
      total: parseInt(cantidad.rows[0].count, 10)
    }
  } catch (error) {
    throw new Error("Hubo un error al obtener los datos");
  }
};
//Funcion HATEOAS
const HATEOAS = (inventario, total)=>{
  const resultado = inventario.map((joya)=>{
    return{
      name:joya.nombre,
      href:`/inventario/joya/${joya.id}`,
    }
  })

  const result = {
    totalJoyas:total,
    resultado
  }
  return result
}
//Funcion para obtener filtros de precio
const getJewerlyByFilter = async ({ precio_min, precio_max, categoria, metal }) => {
  let filtros = [];
  let valores = [];

  if (precio_max) {
    filtros.push(`precio <= $${filtros.length + 1}`);
    valores.push(precio_max);
  }

  if (precio_min) {
    filtros.push(`precio >= $${filtros.length + 1}`);
    valores.push(precio_min);
  }

  if (categoria) {
    filtros.push(`catagoria = $${filtros.length + 1}`);
    valores.push(categoria);
  }

  if (metal) {
    filtros.push(`metal = $${filtros.length + 1}`);
    valores.push(metal);
  }

  let consulta = "SELECT * FROM inventario"; 
  if (filtros.length > 0) {
    consulta += ` WHERE ${filtros.join(" AND ")}`;
  }

  const response = await pool.query(consulta, valores);
  return response.rows;
};
export const methods = {
  getJewerly,
  getJewerlyByFilter,
  HATEOAS
};
