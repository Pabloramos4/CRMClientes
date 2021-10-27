import React, { useState, useEffect, useContext } from "react";
import Layout from "../Layout";
import Select from "react-select";
import { useMutation, gql, useQuery } from "@apollo/client";
import { Digital } from "react-activity";
import "react-activity/dist/Digital.css";
import PedidoContext from "../../context/pedidos/PedidoContext";

//obtener clientes
const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
      telefono
      vendedor
    }
  }
`;

export default function AsignarCliente() {
  const [cliente, setCliente] = useState([]);

  //Context de Pedidos
  const pedidoContext = useContext(PedidoContext);
  const { agregarCliente } = pedidoContext;

  //Consultar la BD
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

  useEffect(() => {
    agregarCliente(cliente);
  }, [cliente]);

  const seleccionarCliente = (cliente) => {
    setCliente(cliente);
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

  const { obtenerClientesVendedor } = data;

  return (
    <>
      <p className="block text-sm font-medium text-gray-700">
        1.- Asignar Cliente al Pedido:
      </p>
      <Select
        className="mt-3"
        options={obtenerClientesVendedor}
        //isMulti={true}
        onChange={(opcion) => seleccionarCliente(opcion)}
        getOptionValue={(opciones) => opciones.id}
        getOptionLabel={(opciones) => opciones.nombre}
        placeholder="Busque o Seleccione el Cliente"
        noOptionsMessage={() => "No hay resultados"}
      />
    </>
  );
}
