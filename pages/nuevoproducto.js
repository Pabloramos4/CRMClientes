import React, { useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import MensajeAlert from "../components/MensajeAlert";
import { Digital } from "react-activity";
import "react-activity/dist/Digital.css";

const NUEVO_PRODUCTO = gql`
  mutation nuevoProducto($input: ProductoInput) {
    nuevoProducto(input: $input) {
      id
      nombre
      existencia
      precio
      creado
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

export default function NuevoProducto() {
  const router = useRouter();

  //Valores para el mensaje de alerta
  const [openMensaje, setOpenMensaje] = useState(false);
  const [textMensaje, setTextMensaje] = useState("");
  const [iconName, setIconName] = useState("");
  const [crudExito, setCrudExito] = useState(false);

  //State para icon Login btn
  const [loadingBtn, setLoadingBtn] = useState(false);

  //Mutation para crear nuevo cliente
  const [nuevoProducto] = useMutation(
    NUEVO_PRODUCTO,
    //Actualizamos el Cache del listado de Clientes para que se figure el dato que se acaba de insertar
    {
      update(cache, { data: { nuevoProducto } }) {
        //obtener el objeto del cache que deseamos actualizar, tomamos una copia
        const { obtenerProductos } = cache.readQuery({
          query: OBTENER_PRODUCTOS,
        });

        //reescribimos el cache ( El cache nunca se debe de modificas, solo reescrinir). NO mutarlo porque es inmutable, solo reescribir.
        cache.writeQuery({
          query: OBTENER_PRODUCTOS,
          data: {
            obtenerProductos: [...obtenerProductos, nuevoProducto],
          },
        });
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      nombre: "",
      existencia: 1,
      precio: 1,
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El Nombre es obligatorio."),
      existencia: Yup.number()
        .required("El numero de Existencia es obligatorio.")
        .positive("No se aceptan números negativos.")
        .integer("La existencia debe de ser números enteros."),
      precio: Yup.number()
        .required("El Precio es obligatorio.")
        .positive("No se aceptan números negativos"),
    }),
    onSubmit: async (valores) => {
      const { nombre, existencia, precio } = valores;

      try {
        const { data } = await nuevoProducto({
          variables: {
            input: {
              nombre,
              precio,
              existencia,
            },
          },
        });
        //console.log(data.nuevoCliente);
        setTextMensaje("El Producto fue creado exitosamente.");
        setIconName("success");
        setOpenMensaje(true);
        setCrudExito(true);

        //router.push("/clientes");
      } catch (error) {
        setLoadingBtn(false);
        setIconName("error");
        setTextMensaje(error.message);
        setOpenMensaje(true);
        setCrudExito(false);
      }
    },
  });

  return (
    <>
      <Layout>
        {/* Mensaje de alerta para controlar el guardado de los datos */}
        <MensajeAlert
          OpenMensaje={openMensaje}
          SetOpenMensaje={setOpenMensaje}
          TextMensaje={textMensaje}
          IconName={iconName}
          Redirect="/productos"
          Crud={crudExito}
        />
        <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
              Nuevo Producto
            </h1>
          </div>
          <div className="mt-4 flex sm:mt-0 sm:ml-4">
            <Link href="/productos">
              <a className="flex justify-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <ChevronLeftIcon className="h-5 w-5 text-white" />

                <p>Regresar</p>
              </a>
            </Link>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <form
            className="space-y-8 divide-y divide-gray-200"
            onSubmit={formik.handleSubmit}
          >
            <div className="pt-8">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Datos del Producto
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ingresa los datos correctos del nuevo producto.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 ">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      autoComplete="given-name"
                      //   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formik.values.nombre}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  {formik.touched.nombre && formik.errors.nombre ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-400 text-red-700 p-3">
                      <p className="font-bold">Error</p>
                      <p>{formik.errors.nombre}</p>
                    </div>
                  ) : null}
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="existencia"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Existencia
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="existencia"
                      id="existencia"
                      autoComplete="family-name"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formik.values.existencia}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      //   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  {formik.touched.existencia && formik.errors.existencia ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-400 text-red-700 p-3">
                      <p className="font-bold">Error</p>
                      <p>{formik.errors.existencia}</p>
                    </div>
                  ) : null}
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="precio"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Precio
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="precio"
                      id="precio"
                      autoComplete="family-name"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formik.values.precio}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      //   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  {formik.touched.precio && formik.errors.precio ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-400 text-red-700 p-3">
                      <p className="font-bold">Error</p>
                      <p>{formik.errors.precio}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-center">
                <button
                  type="submit"
                  onClick={() => {
                    setLoadingBtn(formik.isValid);
                  }}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loadingBtn === true ? <Digital /> : "Registrar"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}
