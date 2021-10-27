import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  CalendarIcon,
  LocationMarkerIcon,
  UsersIcon,
  InboxIcon,
  PhoneIcon,
} from "@heroicons/react/solid";
import { gql, useMutation } from "@apollo/client";

const ACTUALIZAR_PEDIDO = gql`
  mutation actualizarPedido($id: ID!, $input: PedidoInput) {
    actualizarPedido(id: $id, input: $input) {
      estado
    }
  }
`;
const ELIMINAR_PEDIDO = gql`
  mutation eliminarPedido($id: ID!) {
    eliminarPedido(id: $id)
  }
`;
const OBTENER_PEDIDOS = gql`
  query obtenerPedidosByVendedor {
    obtenerPedidosByVendedor {
      id
      pedido {
        id
        cantidad
        nombre
      }
      total
      cliente {
        id
        nombre
        apellido
        email
        telefono
      }
      vendedor
      estado
    }
  }
`;

export default function Pedido({ pedido_unic }) {
  const {
    id,
    total,
    cliente: { nombre, apellido, email, telefono },
    estado,
    cliente,
  } = pedido_unic;

  //Mutation para cambiar el estado
  const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);

  //Mutation para eliminar pedidos
  const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
    update(cache) {
      const { obtenerPedidosByVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS,
      });

      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosByVendedor: obtenerPedidosByVendedor.filter(
            (pedido) => pedido.id !== id
          ),
        },
      });
    },
  });

  const [estadoPedido, setEstadoPedido] = useState(estado);
  const [clase, setClase] = useState("");

  useEffect(() => {
    if (estadoPedido) {
      setEstadoPedido(estadoPedido);
    }
    clasePedido();
  }, [estadoPedido]);

  //Funcion que modific el pedido de acuerdo a su estado
  const clasePedido = () => {
    if (estadoPedido === "PENDIENTE") {
      setClase("border-yellow-500");
    } else if (estadoPedido === "COMPLETADO") {
      setClase("border-green-500");
    } else {
      setClase("border-red-800");
    }
  };

  const cambiarEstadoPedido = async (nuevoEstado) => {
    try {
      const { data } = await actualizarPedido({
        variables: {
          id,
          input: {
            estado: nuevoEstado,
            cliente: cliente.id,
          },
        },
      });
      setEstadoPedido(data.actualizarPedido.estado);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmarEliminarPedido = () => {
    Swal.fire({
      title: "¿Deseas Eliminar este Pedido?",
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
          const { data } = await eliminarPedido({
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

  return (
    <>
      <div
        className={` ${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}
      >
        <div>
          <p className="text-xl font-medium text-indigo-600 truncate">
            {nombre} {apellido}
          </p>
          {email && (
            <p className="flex text-sm text-gray-500 items-center my-2">
              <InboxIcon className="h-5 w-5" />
              {email}
            </p>
          )}
          {telefono && (
            <p className="flex text-sm text-gray-500 items-center my-2">
              <PhoneIcon className="h-5 w-5" />
              {telefono}
            </p>
          )}
          <p className="text-gray-600 font-bold mt-4">Estado Pedido: </p>
          <select
            value={estadoPedido}
            onChange={(e) => cambiarEstadoPedido(e.target.value)}
            className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:online-none focus:bg-blue-600 focus:border-blue-500 uppercase text-sm font-bold"
          >
            <option value="COMPLETADO">COMPLETADO</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>
        <div>
          <h2 className="text-gray-800 mt-2 font-bold">Resumen del Pedido</h2>
          {pedido_unic.pedido.map((articulo) => (
            <div key={articulo.id} className="mt-1">
              <p className="text-sm text-gray-600">
                Producto: {articulo.nombre}
              </p>
              <p className="text-sm text-gray-600">
                Cantidad: {articulo.cantidad}
              </p>
            </div>
          ))}
          <p className="text-gray-800 mt-3 font-bold">
            Total a pagar: <span className="font-light"> ${total} </span>
          </p>
          <div className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <a
              onClick={() => confirmarEliminarPedido()}
              className="text-red-600 hover:text-indigo-900"
            >
              Eliminar
            </a>
          </div>
        </div>
      </div>
    </>

    // <div className="bg-white shadow overflow-hidden sm:rounded-md">
    //   <ul role="list" className="divide-y divide-gray-200">
    //     <li>
    //       <a href="#" className="block hover:bg-gray-50">
    //         <div className="px-4 py-4 sm:px-6">
    //           <div className="flex items-center justify-between">
    //             <p className="text-sm font-medium text-indigo-600 truncate">
    //               {pedido.cliente}
    //             </p>
    //             <div className="ml-2 flex-shrink-0 flex">
    //               <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
    //                 para fecha
    //               </p>
    //             </div>
    //           </div>
    //           <div className="mt-2 sm:flex sm:justify-between">
    //             <div className="sm:flex">
    //               <p className="flex items-center text-sm text-gray-500">
    //                 <UsersIcon
    //                   className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
    //                   aria-hidden="true"
    //                 />
    //                 usuario
    //               </p>
    //               <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
    //                 <LocationMarkerIcon
    //                   className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
    //                   aria-hidden="true"
    //                 />
    //                 localizacion
    //               </p>
    //             </div>
    //             <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
    //               <CalendarIcon
    //                 className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
    //                 aria-hidden="true"
    //               />
    //               <p>
    //                 Closing on{" "}
    //                 {/* <time dateTime={position.closeDate}>
    //                     {position.closeDateFull}
    //                   </time> */}
    //               </p>
    //             </div>
    //           </div>
    //         </div>
    //       </a>
    //     </li>
    //   </ul>
    // </div>
  );
}
