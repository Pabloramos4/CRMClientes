import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { gql, useQuery, useMutation } from "@apollo/client";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { Digital } from "react-activity";
import "react-activity/dist/Digital.css";
import Link from "next/link";
import Producto from "../components/Producto";

import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/outline";

import ReactPaginate from "react-paginate";

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
  const [offset, setOffset] = useState(0);
  const [dataPagination, setDataPagination] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  const getData = (data) => {
    if (data && data.obtenerProductos !== null) {
      let postData;

      if (data.obtenerProductos.length === 0) {
        postData = (
          <tr className="bg-white">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 items-center w-full">
              No existen productos para mostrar...
            </td>
          </tr>
        );
        setPageCount(0);
      } else {
        //Existen Datos
        const slice = data.obtenerProductos.slice(offset, offset + perPage);

        postData = slice.map((producto, productoIdx) => (
          <Producto
            key={producto.id}
            producto={producto}
            productoIdx={productoIdx}
          />
        ));

        setPageCount(Math.ceil(data.obtenerProductos.length / perPage));
      }
      setDataPagination(postData);
    }
  };

  useEffect(() => {
    getData(data);
  }, [offset, loading, data]);

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

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage * perPage);
  };

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
                    <tbody>{dataPagination}</tbody>
                  </table>
                  {pageCount === 0 || pageCount === 1 ? (
                    <></>
                  ) : (
                    <ReactPaginate
                      previousLabel={
                        <>
                          <ArrowNarrowLeftIcon
                            className="mr-3 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          Anterior
                        </>
                      }
                      nextLabel={
                        <>
                          Siguiente
                          <ArrowNarrowRightIcon
                            className="ml-3 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </>
                      }
                      breakLabel={"..."}
                      // breakClassName={"break-me"}
                      pageCount={pageCount}
                      marginPagesDisplayed={4}
                      pageRangeDisplayed={3}
                      onPageChange={handlePageClick}
                      containerClassName={
                        "border-t border-gray-200 px-4 m-4 flex items-center justify-between sm:px-0"
                      }
                      previousClassName={"-mt-px w-0 flex-1 flex"}
                      previousLinkClassName={
                        "border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                      pageClassName={"hidden md:-mt-px md:flex"}
                      pageLinkClassName={
                        "border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
                      }
                      nextClassName={"-mt-px w-0 flex-1 flex justify-end"}
                      nextLinkClassName={
                        "border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                      activeLinkClassName={
                        "border-indigo-500 text-indigo-700 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
