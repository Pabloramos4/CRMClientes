import React from "react";
import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router"; //este permite pasar parametros en la url
const ELIMINAR_CLIENTE = gql`
  mutation eliminarCliente($id: ID!) {
    eliminarCliente(id: $id)
  }
`;
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
export default function Cliente({ cliente, clienteIdx }) {
  const router = useRouter();

  const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
    update(cache) {
      //obtener una copia del objeto del cache
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_USUARIO,
      });

      cache.evict({ broadcast: false });

      //Reescrinir el Cache
      cache.writeQuery({
        query: OBTENER_CLIENTES_USUARIO,
        data: {
          obtenerClientesVendedor: obtenerClientesVendedor.filter(
            (clienteActual) => clienteActual.id !== id
          ),
        },
      });
    },
  });

  const { nombre, apellido, empresa, email, telefono, id } = cliente;

  const confirmEliminarCliente = () => {
    Swal.fire({
      title: "¿Deseas Eliminar este Cliente?",
      text: "La eliminación será permanente y no habrá retroceso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          //Eliminar por ID
          const { data } = await eliminarCliente({
            variables: {
              id: id,
            },
          });

          //console.log(data);

          Swal.fire("Eliminado!", data.eliminarCliente, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editarCliente = () => {
    router.push({
      pathname: "/editarcliente/[id]",
      query: { id: id },
    });
  };
  return (
    <tr className={clienteIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {nombre} {apellido}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {empresa}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {telefono}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a
          onClick={() => editarCliente()}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Editar
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a
          onClick={() => confirmEliminarCliente()}
          className="text-red-600 hover:text-indigo-900"
        >
          Eliminar
        </a>
      </td>
    </tr>
  );
}
