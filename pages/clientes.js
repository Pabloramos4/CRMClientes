import React from "react";
import Layout from "../components/Layout";
import { gql, useQuery, useMutation } from "@apollo/client";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { Digital } from "react-activity";
import "react-activity/dist/Digital.css";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/outline";

import Cliente from "../components/Cliente";
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

export default function Clientes() {
  // function classNames(...classes) {
  //   return classes.filter(Boolean).join(" ");
  // }
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);
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

  // if (data.obtenerClientesVendedor === null) {
  //   mostrarElementos = (
  //     <tr className="bg-white">
  //       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 items-center w-full">
  //         Hubo un error al cargar los registros. Actualice la página.
  //       </td>
  //     </tr>
  //   );
  // }

  if (data && data.obtenerClientesVendedor !== null) {
    if (data.obtenerClientesVendedor.length === 0) {
      mostrarElementos = (
        <tr className="bg-white">
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 items-center w-full">
            No existen datos para mostrar...
          </td>
        </tr>
      );
    } else {
      mostrarElementos = data.obtenerClientesVendedor.map(
        (cliente, clienteIdx) => (
          <Cliente key={cliente.id} cliente={cliente} clienteIdx={clienteIdx} />
        )
      );
    }
  }

  return (
    <>
      <Layout>
        <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
              Clientes
            </h1>
          </div>
        </div>

        <div className="px-4 mt-4 sm:px-6 lg:px-8">
          <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
            Relación de Clientes
          </h2>
        </div>

        <div className="px-4 mt-6 sm:px-6 lg:px-8">
          <div className="grid justify-items-end">
            <Link href="/nuevocliente">
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
                          Empresa
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Telefono
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

                  <nav className="border-t border-gray-200 px-4 m-4 flex items-center justify-between sm:px-0">
                    <div className="-mt-px w-0 flex-1 flex">
                      <a
                        href="#"
                        className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      >
                        <ArrowNarrowLeftIcon
                          className="mr-3 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        Anterior
                      </a>
                    </div>
                    <div className="hidden md:-mt-px md:flex">
                      <a
                        href="#"
                        className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
                      >
                        1
                      </a>
                      {/* Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" */}
                      <a
                        href="#"
                        className="border-indigo-500 text-indigo-600 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
                        aria-current="page"
                      >
                        2
                      </a>
                      <a
                        href="#"
                        className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
                      >
                        3
                      </a>
                      <span className="border-transparent text-gray-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">
                        ...
                      </span>
                      <a
                        href="#"
                        className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
                      >
                        8
                      </a>
                      <a
                        href="#"
                        className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
                      >
                        9
                      </a>
                      <a
                        href="#"
                        className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
                      >
                        10
                      </a>
                    </div>
                    <div className="-mt-px w-0 flex-1 flex justify-end">
                      <a
                        href="#"
                        className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      >
                        Siguiente
                        <ArrowNarrowRightIcon
                          className="ml-3 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  </nav>
                  {/* <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <a
                        href="#"
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Previous
                      </a>
                      <a
                        href="#"
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Next
                      </a>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">1</span> to{" "}
                          <span className="font-medium">10</span> of{" "}
                          <span className="font-medium">97</span> results
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <a
                            href="#"
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </a>
                           <a
                            href="#"
                            aria-current="page"
                            className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                          >
                            1
                          </a>
                          <a
                            href="#"
                            className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                          >
                            2
                          </a>
                          <a
                            href="#"
                            className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
                          >
                            3
                          </a>
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                          <a
                            href="#"
                            className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
                          >
                            8
                          </a>
                          <a
                            href="#"
                            className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                          >
                            9
                          </a>
                          <a
                            href="#"
                            className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                          >
                            10
                          </a>
                          <a
                            href="#"
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </a>
                        </nav>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
