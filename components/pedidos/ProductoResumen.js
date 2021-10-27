import React, { useContext, useState, useEffect } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";

export default function ProductoResumen({ producto }) {
  //Context de Pedidos
  const pedidoContext = useContext(PedidoContext);
  const { cantidadProductos, actualizarTotal } = pedidoContext;

  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    actualizarCantidad();
    actualizarTotal();
  }, [cantidad]);

  const actualizarCantidad = () => {
    const nuevoProducto = { ...producto, cantidad: Number(cantidad) };
    cantidadProductos(nuevoProducto);
  };

  const { nombre, precio } = producto;
  return (
    <div className="mt-2 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
      <div className="sm:col-span-3">
        <p className="block text-sm font-medium text-gray-700">{nombre}</p>
        <div className="block text-sm font-medium text-gray-700">
          $ {precio}
        </div>
      </div>

      <div className="sm:col-span-3">
        {/* <p
          htmlFor="apellido"
          className="block text-sm font-medium text-gray-700"
        >
          Cantidad:
        </p> */}
        <div>
          <input
            type="number"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Cantidad"
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
