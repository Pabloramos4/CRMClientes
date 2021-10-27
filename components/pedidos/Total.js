import React, { useContext } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";
export default function Total() {
  const pedidoContext = useContext(PedidoContext);
  const { total } = pedidoContext;

  return (
    <div className="flex item-center mt5 justify-between bg-gray-200 p-3 border-solid border-2 border-indigo-400 ">
      <h2 className="block text-sm font-medium text-gray-700">
        Total a Pagar:
      </h2>
      <p className="block text-sm font-medium text-gray-700">$ {total}</p>
    </div>
  );
}
