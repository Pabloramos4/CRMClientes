import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function Redirect() {
  // Instanciamos la Ruta
  //const router = useRouter();
  useEffect(() => {
    //usamos este en vez de Router porque necesitamos que la pagina recargue y limpie la data de usuario
    var result = window.location.origin;
    window.location.href = result + "/login";
  }, []);
  return <></>;
}
