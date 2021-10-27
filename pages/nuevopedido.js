import React, { useContext, useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import MensajeAlert from "../components/MensajeAlert";
import { Digital } from "react-activity";
import "react-activity/dist/Digital.css";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";

//context de pedidos
import PedidoContext from "../context/pedidos/PedidoContext";

const NUEVO_PEDIDO = gql`
  mutation nuevoPedido($input: PedidoInput) {
    nuevoPedido(input: $input) {
      id
      pedido {
        id
        cantidad
        nombre
      }
      cliente {
        id
        nombre
        apellido
        email
        telefono
      }
      total
      vendedor
      estado
    }
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

export default function NuevoPedido() {
  //Valores para el mensaje de alerta
  const [openMensaje, setOpenMensaje] = useState(false);
  const [textMensaje, setTextMensaje] = useState("");
  const [iconName, setIconName] = useState("");
  const [crudExito, setCrudExito] = useState(false);
  //State para icon Login btn
  const [loadingBtn, setLoadingBtn] = useState(false);

  //Utilizar context y extraer sus funciones y valores
  const pedidoContext = useContext(PedidoContext);
  const { cliente, productos, total, actualizarValores } = pedidoContext;

  //Mutation para crear un nuevo pedido
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update(cache, { data: { nuevoPedido } }) {
      // console.log(
      //   "Este es la estructura antes de reescribir el pedido",
      //   nuevoPedido
      // );
      const { obtenerPedidosByVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS,
      });
      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosByVendedor: [...obtenerPedidosByVendedor, nuevoPedido],
        },
      });
    },
  });

  const validarPedido = () => {
    //El metodo Every() hace una iteracion de todo el arreglo de objeto con la condicion de que todos los elementos cumplan una misma condicion.
    return !productos.every((producto) => producto.cantidad > 0) ||
      total === 0 ||
      cliente.length === 0
      ? " opacity-50 cursor-not-allowed"
      : "";
  };

  const crearNuevoPedido = async () => {
    const { id } = cliente;

    //console.log("estes el id cliente antes", id);

    //Remover lo no deseado de productos
    const pedido = productos.map(
      ({ __typename, existencia, ...producto }) => producto
    );

    try {
      const { data } = await nuevoPedido({
        variables: {
          input: {
            cliente: id,
            total: total,
            pedido: pedido,
          },
        },
      });

      //console.log("este es el resultado de la insercion", data);

      setTextMensaje("El Pedido fue creado exitosamente.");
      setIconName("success");
      setOpenMensaje(true);
      setCrudExito(true);

      //regresamos los valores del State de pedido a valores iniciales
      //actualizarValores();
    } catch (error) {
      //console.log(error);
      setLoadingBtn(false);
      setIconName("error");
      setTextMensaje(error.message);
      setOpenMensaje(true);
      setCrudExito(false);
    }
  };
  return (
    <>
      <Layout>
        {/* Mensaje de alerta para controlar el guardado de los datos */}
        <MensajeAlert
          OpenMensaje={openMensaje}
          SetOpenMensaje={setOpenMensaje}
          TextMensaje={textMensaje}
          IconName={iconName}
          Redirect="/pedidos"
          Crud={crudExito}
        />

        <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
              Nuevo Pedido
            </h1>
          </div>
          <div className="mt-4 flex sm:mt-0 sm:ml-4">
            <Link href="/pedidos">
              <a className="flex justify-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <ChevronLeftIcon className="h-5 w-5 text-white" />

                <p>Regresar</p>
              </a>
            </Link>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Datos del Pedido
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Ingresa los datos correctos del nuevo pedido.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 ">
              <div className="sm:col-span-3">
                <AsignarCliente />
              </div>
              <div className="sm:col-span-3">
                <AsignarProductos />
              </div>
              <div className="sm:col-span-3">
                <ResumenPedido />
              </div>
              <div className="sm:col-span-3">
                <Total />
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  //setLoadingBtn(formik.isValid);
                  crearNuevoPedido();
                }}
                // className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${validarPedido()}`}
              >
                {loadingBtn === true ? <Digital /> : "Registrar"}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
