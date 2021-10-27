import React, { Fragment, useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, gql } from "@apollo/client";
import MensajeAlert from "../components/MensajeAlert";

const QUERY = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      precio
      existencia
    }
  }
`;
const NUEVA_CUENTA = gql`
  mutation nuevoUsuario($input: UsuarioInput) {
    nuevoUsuario(input: $input) {
      id
      nombre
      apellido
      email
    }
  }
`;

export default function NuevaCuenta({ props }) {
  //Obtener productos de GraphQL
  //   const { data, loading, error } = useQuery(QUERY);
  //   console.log(data);

  //Mutation para crear nuevos usuarios
  const [nuevoUsuario] = useMutation(NUEVA_CUENTA);

  //Valores para el mensaje de alerta
  const [openMensaje, setOpenMensaje] = useState(false);
  const [textMensaje, setTextMensaje] = useState("");
  const [iconName, setIconName] = useState("");
  const [crudExito, setCrudExito] = useState(false);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El Nombre es obligatorio"),
      apellido: Yup.string().required("El Apellido es obligatorio"),
      email: Yup.string()
        .email("El email es válido")
        .required("El email es obligatorio"),
      password: Yup.string()
        .required("El password es requierido")
        .min(6, "La contraseña debe contener por lo menos 6 caracteres"),
    }),
    onSubmit: async (valores) => {
      //console.log(valores);
      const { nombre, apellido, email, password } = valores;
      try {
        const { data } = await nuevoUsuario({
          variables: {
            input: {
              nombre,
              apellido,
              email,
              password,
            },
          },
        });
        let mensaje =
          "El usuario " +
          data.nombre +
          " con email: " +
          data.email +
          " fue creado Exitosamente";
        //Guardado correctamente
        setTextMensaje("El usuario fue creado exitosamente.");
        setIconName("success");
        setOpenMensaje(true);
        setCrudExito(true);
      } catch (error) {
        setIconName("error");
        setTextMensaje(error.message);
        setOpenMensaje(true);
        setCrudExito(false);
      }
    },
  });

  return (
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
      {/* Encabezado de esta pagina */}
      <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
            Nueva Cuenta
          </h1>
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
                Datos Personales
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Ingresa los datos correctos del nuevo usuario.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
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

              <div className="sm:col-span-6">
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
              <div className="sm:col-span-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-400 text-red-700 p-3">
                      <p className="font-bold">Error</p>
                      <p>{formik.errors.password}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-center">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
