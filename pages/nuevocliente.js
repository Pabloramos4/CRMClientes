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

const NUEVO_CLIENTE = gql`
  mutation nuevoCliente($input: ClienteInput) {
    nuevoCliente(input: $input) {
      nombre
      apellido
      empresa
      empresa
      telefono
    }
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
export default function NuevoCliente() {
  const router = useRouter();

  //Valores para el mensaje de alerta
  const [openMensaje, setOpenMensaje] = useState(false);
  const [textMensaje, setTextMensaje] = useState("");
  const [iconName, setIconName] = useState("");
  const [crudExito, setCrudExito] = useState(false);

  //State para icon Login btn
  const [loadingBtn, setLoadingBtn] = useState(false);

  //Mutation para crear nuevo cliente
  const [nuevoCliente] = useMutation(
    NUEVO_CLIENTE,
    //Actualizamos el Cache del listado de Clientes para que se figure el dato que se acaba de insertar
    {
      update(cache, { data: { nuevoCliente } }) {
        //obtener el objeto del cache que deseamos actualizar, tomamos una copia
        const { obtenerClientesVendedor } = cache.readQuery({
          query: OBTENER_CLIENTES_USUARIO,
        });

        //reescribimos el cache ( El cache nunca se debe de modificas, solo reescrinir). NO mutarlo porque es inmutable, solo reescribir.
        cache.writeQuery({
          query: OBTENER_CLIENTES_USUARIO,
          data: {
            obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente],
          },
        });
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      empresa: "",
      email: "",
      telefono: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El Nombre es obligatorio."),
      apellido: Yup.string().required("El Apellido es obligatorio."),
      empresa: Yup.string().required("El nombre de la Empresa es obligatorio."),
      email: Yup.string()
        .email("Email no válido.")
        .required("El Email es obligatorio."),
    }),
    onSubmit: async (valores) => {
      const { nombre, apellido, email, empresa, telefono } = valores;

      try {
        const { data } = await nuevoCliente({
          variables: {
            input: {
              nombre,
              apellido,
              empresa,
              email,
              telefono,
            },
          },
        });
        //console.log(data.nuevoCliente);
        setTextMensaje("El Cliente fue creado exitosamente.");
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
          Redirect="/clientes"
          Crud={crudExito}
        />
        <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
              Nuevo Cliente
            </h1>
          </div>
          <div className="mt-4 flex sm:mt-0 sm:ml-4">
            <Link href="/clientes">
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
                  Datos del Cliente
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ingresa los datos correctos del nuevo cliente.
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
                    htmlFor="apellido"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apellidos
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="apellido"
                      id="apellido"
                      autoComplete="family-name"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formik.values.apellido}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      //   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  {formik.touched.apellido && formik.errors.apellido ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-400 text-red-700 p-3">
                      <p className="font-bold">Error</p>
                      <p>{formik.errors.apellido}</p>
                    </div>
                  ) : null}
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="empresa"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Empresa
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="empresa"
                      id="empresa"
                      autoComplete="family-name"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formik.values.empresa}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      //   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  {formik.touched.empresa && formik.errors.empresa ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-400 text-red-700 p-3">
                      <p className="font-bold">Error</p>
                      <p>{formik.errors.empresa}</p>
                    </div>
                  ) : null}
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      //   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-400 text-red-700 p-3">
                        <p className="font-bold">Error</p>
                        <p>{formik.errors.email}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Telefono
                  </label>
                  <div className="mt-1">
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formik.values.telefono}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
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
