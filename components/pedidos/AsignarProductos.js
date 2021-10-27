import React, { useState, useEffect, useContext } from "react";
import Layout from "../Layout";
import Select from "react-select";
import { useMutation, gql, useQuery } from "@apollo/client";
import { Digital } from "react-activity";
import "react-activity/dist/Digital.css";
import PedidoContext from "../../context/pedidos/PedidoContext";

//obtener productos
const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      precio
      existencia
    }
  }
`;

export default function AsignarProductos() {
  const [producto, setProducto] = useState([]);

  //Context de Pedidos
  const pedidoContext = useContext(PedidoContext);
  const { agregarProductos } = pedidoContext;

  //Consultar la BD
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  useEffect(() => {
    //Funcion para pasar a PedidoState.js
    agregarProductos(producto);
  }, [producto]);

  const seleccionarProducto = (producto) => {
    setProducto(producto);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-screen">
          <div className="m-auto text-indigo-600">
            <Digital />
          </div>
        </div>
      </Layout>
    );
  }

  const { obtenerProductos } = data;

  return (
    <>
      <p className="block text-sm font-medium text-gray-700">
        2.- Asignar Productos:
      </p>
      <Select
        className="mt-3"
        options={obtenerProductos}
        isMulti={true}
        onChange={(opcion) => seleccionarProducto(opcion)}
        getOptionValue={(opciones) => opciones.id}
        getOptionLabel={(opciones) =>
          `${opciones.nombre} - ${opciones.existencia}`
        }
        placeholder="Busque o Seleccione un Producto"
        noOptionsMessage={() => "No hay resultados"}
      />
    </>
  );
}
