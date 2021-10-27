import React from "react";
import Layout from "../components/Layout";
import { gql, useQuery, useMutation } from "@apollo/client";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { Digital } from "react-activity";
import "react-activity/dist/Digital.css";
import Link from "next/link";
import Producto from "../components/Producto";

//obtener productos
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

export default function Productos() {
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);
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
  let mostrarElementos;

  if (data && data.obtenerProductos !== null) {
    if (data.obtenerProductos.length === 0) {
      mostrarElementos = (
        <tr className="bg-white">
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 items-center w-full">
            No existen datos para mostrar...
          </td>
        </tr>
      );
    } else {
      mostrarElementos = data.obtenerProductos.map((producto, productoIdx) => (
        <Producto
          key={producto.id}
          producto={producto}
          productoIdx={productoIdx}
        />
      ));
    }
  }

  return (
    <>
      <Layout>
        <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
              Productos
            </h1>
          </div>
        </div>

        <div className="px-4 mt-6 sm:px-6 lg:px-8">
          <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
            Relación de Productos
          </h2>
        </div>
        <div className="px-4 mt-6 sm:px-6 lg:px-8">
          <div className="grid justify-items-end">
            <Link href="/nuevoproducto">
              <a className="flex justify-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <PlusCircleIcon className="h-5 w-5 text-white" />

                <p>Nuevo</p>
              </a>
            </Link>
          </div>
        </div>

        <div className="px-4 mt-6 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Nombre
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Precio
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Existencia
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Creado
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only"></span>
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only"></span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>{mostrarElementos}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
