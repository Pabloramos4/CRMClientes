import React, { useReducer } from "react";
import PedidoContext from "./PedidoContext";
import PedidoReducer from "./PedidoReducer";
import {
  SELECCIONAR_CLIENTE,
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTOS,
  ACTUALIZAR_TOTAL,
  ACTUALIZAR_VALORES,
} from "../../types";

const PedidoState = ({ children }) => {
  //Crear el State de Pedidos
  const initialState = {
    cliente: {},
    productos: [],
    total: 0,
  };

  const [state, dispatch] = useReducer(PedidoReducer, initialState);

  //modificar datos del estado del cliente
  const agregarCliente = (cliente) => {
    dispatch({
      type: SELECCIONAR_CLIENTE,
      payload: cliente,
    });
  };
  //modificar datos del estado de productos
  const agregarProductos = (productosSeleccionados) => {
    let nuevoState;

    if (state.productos.length > 0) {
      //Tomar del segundo arreglo, una copia para asignarlo al primero
      //esto para presetar el dato de "cantidad", que no es un campo/atributo del objeto general de Productos
      //sino lo estamos añadiendo a la estructura
      nuevoState = productosSeleccionados.map((producto) => {
        const nuevoObjeto = state.productos.find(
          (productoState) => productoState.id === producto.id
        );
        return { ...producto, ...nuevoObjeto };
      });
    } else {
      nuevoState = productosSeleccionados;
    }
    dispatch({
      type: SELECCIONAR_PRODUCTO,
      payload: nuevoState,
    });
  };

  //Modificar las cantidades de los productos
  const cantidadProductos = (nuevoProducto) => {
    dispatch({
      type: CANTIDAD_PRODUCTOS,
      payload: nuevoProducto,
    });
  };

  //Para actualizar el total
  const actualizarTotal = () => {
    dispatch({
      type: ACTUALIZAR_TOTAL,
    });
  };

  const actualizarValores = () => {
    dispatch({
      type: ACTUALIZAR_VALORES,
    });
  };

  return (
    <PedidoContext.Provider
      value={{
        cliente: state.cliente,
        productos: state.productos,
        total: state.total,
        agregarCliente,
        agregarProductos,
        cantidadProductos,
        actualizarTotal,
        actualizarValores,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};
export default PedidoState;
