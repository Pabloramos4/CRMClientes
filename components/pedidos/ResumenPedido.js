import React, { useEffect, useContext } from "react";
import "react-activity/dist/Digital.css";
import PedidoContext from "../../context/pedidos/PedidoContext";
import ProductoResumen from "./ProductoResumen";

export default function ResumenPedido() {
  //Context de Pedidos
  const pedidoContext = useContext(PedidoContext);
  const { productos, actualizarTotal } = pedidoContext;

  useEffect(() => {
    actualizarTotal();
  }, [productos]);

  return (
    <>
      <p className="block text-sm font-medium text-gray-700 mb-2">
        3.- Ajusta las cantidades de los Productos:
      </p>
      <div className="bg-gray-200 p-3 border-solid border-2 border-indigo-400">
        {productos.length > 0 ? (
          <>
            {productos.map((producto) => (
              <ProductoResumen key={producto.id} producto={producto} />
            ))}
          </>
        ) : (
          <div className="flex justify-center">
            <p className="mt-3 block text-sm font-medium text-gray-700">
              Aun no hay productos...
            </p>
          </div>
        )}
      </div>
    </>
  );
}
