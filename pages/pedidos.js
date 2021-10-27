import React, { useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { PlusCircleIcon } from "@heroicons/react/outline";
import MensajeAlert from "../components/MensajeAlert";
import { Digital } from "react-activity";
import "react-activity/dist/Digital.css";
import Pedido from "../components/Pedido";

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

export default function Pedidos() {
  const { data, loading, error } = useQuery(OBTENER_PEDIDOS);

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

  const { obtenerPedidosByVendedor } = data;
  console.log(obtenerPedidosByVendedor);
  return (
    <>
      <Layout>
        <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
              Pedidos
            </h1>
          </div>
        </div>

        <div className="px-4 mt-6 sm:px-6 lg:px-8">
          <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
            Relación de pedidos
          </h2>
        </div>
        <div className="px-4 mt-6 sm:px-6 lg:px-8">
          <div className="grid justify-items-end">
            <Link href="/nuevopedido">
              <a className="flex justify-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <PlusCircleIcon className="h-5 w-5 text-white" />

                <p>Nuevo</p>
              </a>
            </Link>
          </div>
        </div>
        <div className="px-4 mt-6 sm:px-6 lg:px-8">
          {obtenerPedidosByVendedor.length === 0 ? (
            <h2 className="text-gray-500 text-xs text-center font-medium tracking-wide">
              No existen pedidos aún...
            </h2>
          ) : (
            obtenerPedidosByVendedor.map((pedido) => (
              <Pedido key={pedido.id} pedido_unic={pedido} />
            ))
          )}
        </div>
      </Layout>
    </>
  );
}
