import React from "react";
import Head from "next/head";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import Redirect from "../pages/redirect";

const GET_USER = gql`
  query obtenerUsuario {
    obtenerUsuario {
      id
      nombre
      apellido
      email
    }
  }
`;
export default function Layout({ children }) {
  //Hook de routing
  const router = useRouter();

  //Obtenemos datos del usuario
  const { data, loading, error } = useQuery(GET_USER);

  return (
    <>
      <Head>
        <title>CRM Clientes</title>
      </Head>
      {router.pathname === "/login" ? (
        { children }
      ) : (
        <Sidebar
          children={children}
          dataUser={data}
          loadingUser={loading}
          errorUser={error}
        />
      )}
    </>
  );
}
