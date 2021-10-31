import React from "react";
import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router"; //este permite pasar parametros en la url
import Moment from "react-moment";
const ELIMINAR_PRODUCTO = gql`
  mutation eliminarProducto($id: ID!) {
    eliminarProducto(id: $id) {
      eliminado
      mensaje
    }
  }
`;
const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      precio
      existencia
      creado
    }
  }
`;

export default function Producto({ producto, productoIdx }) {
  const router = useRouter();
  const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
    update(cache, { data: { eliminarProducto } }) {
      //Solo si el cliente es eliminado
      if (eliminarProducto.eliminado === 1) {
        //obtener una copia del objeto del cache
        const { obtenerProductos } = cache.readQuery({
          query: OBTENER_PRODUCTOS,
        });

        //Reescrinir el Cache
        cache.writeQuery({
          query: OBTENER_PRODUCTOS,
          data: {
            obtenerProductos: obtenerProductos.filter(
              (productoActual) => productoActual.id !== id
            ),
          },
        });
      }
    },
  });

  const { nombre, precio, existencia, creado, id } = producto;

  const confirmEliminarProducto = () => {
    Swal.fire({
      title: "¿Deseas Eliminar este Producto?",
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
          const { data } = await eliminarProducto({
            variables: {
              id: id,
            },
          });

          Swal.fire(
            data.eliminarProducto.eliminado === 1
              ? "Eliminado!"
              : "Información!",
            data.eliminarProducto.mensaje,
            data.eliminarProducto.eliminado === 1 ? "success" : "info"
          );
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editarProducto = () => {
    router.push({
      pathname: "/editarproducto/[id]",
      query: { id: id },
    });
  };
  return (
    <tr className={productoIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {nombre}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        $ {precio}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {existencia} Piezas
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <Moment format="DD/MM/YYYY">{new Date(parseInt(creado))}</Moment>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a
          onClick={() => editarProducto()}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Editar
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a
          onClick={() => confirmEliminarProducto()}
          className="text-red-600 hover:text-indigo-900"
        >
          Eliminar
        </a>
      </td>
    </tr>
  );
}
