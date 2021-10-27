import {
  SELECCIONAR_CLIENTE,
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTOS,
  ACTUALIZAR_TOTAL,
  ACTUALIZAR_VALORES,
} from "../../types";

export default (state, action) => {
  switch (action.type) {
    case SELECCIONAR_CLIENTE:
      return {
        ...state,
        cliente: action.payload,
      };

    case SELECCIONAR_PRODUCTO:
      return {
        ...state,
        productos: action.payload,
      };
    case CANTIDAD_PRODUCTOS:
      return {
        ...state,
        productos: state.productos.map((producto) =>
          producto.id === action.payload.id
            ? (producto = action.payload)
            : producto
        ),
      };
    case ACTUALIZAR_TOTAL:
      return {
        ...state,
        // el metodo Reduce() itera entre todos los objetos del arreglo y de alli sacamos los torales. es como un Foreach.
        //se elige porque va a acumular y tomar un solo resultado
        total: state.productos.reduce(
          (nuevoTotal, articulo) =>
            (nuevoTotal += articulo.precio * articulo.cantidad),
          0
        ),
      };
    case ACTUALIZAR_VALORES:
      return {
        ...state,
        cliente: {},
        productos: [],
        total: 0,
      };
    default:
      return state;
  }
};
