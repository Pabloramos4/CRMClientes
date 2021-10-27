import React, { useEffect } from "react";
import Layout from "../components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { gql, useQuery } from "@apollo/client";
import { Digital } from "react-activity";
import "react-activity/dist/Digital.css";

const MEJORES_CLIENTES = gql`
  query mejoresClientes {
    mejoresClientes {
      cliente {
        nombre
        empresa
        email
      }
      total
    }
  }
`;

export default function MejoresClientes() {
  const { data, loading, error, startPolling, stopPolling } =
    useQuery(MEJORES_CLIENTES);

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

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

  const { mejoresClientes } = data;

  const clienteGrafica = [];

  mejoresClientes.map((cliente, index) => {
    clienteGrafica[index] = {
      ...cliente.cliente[0],
      total: cliente.total,
    };
  });
  // console.log("Mejores VEndedores", mejoresVendedores);
  // console.log("buu", vendedorGrafica);
  return (
    <>
      <Layout>
        <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
              Mejores Clientes
            </h1>
          </div>
        </div>

        <ResponsiveContainer width="99%" height={550}>
          <BarChart
            className="mt-3"
            width={500}
            height={300}
            data={clienteGrafica}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Layout>
    </>
  );
}
