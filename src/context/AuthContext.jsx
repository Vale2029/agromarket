/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Registrar nuevo usuario
  async function registrar(email, password, datosExtra) {
    const resultado = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    // Guardar datos adicionales en Firestore
    await setDoc(doc(db, "usuarios", resultado.user.uid), {
      nombre: datosExtra.nombre,
      rol: datosExtra.rol,
      whatsapp: datosExtra.whatsapp,
      vereda: datosExtra.vereda,
      email: email,
      creadoEn: new Date(),
    });
    return resultado;
  }

  // Iniciar sesión
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Cerrar sesión
  function logout() {
    return signOut(auth);
  }

  // Escuchar cambios de sesión automáticamente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUsuario(user);
      if (user) {
        const snap = await getDoc(doc(db, "usuarios", user.uid));
        if (snap.exists()) setPerfil(snap.data());
      } else {
        setPerfil(null);
      }
      setCargando(false);
    });
    return unsubscribe;
  }, []);

  const valor = {
    usuario,
    perfil,
    registrar,
    login,
    logout,
    cargando,
    setPerfil,
  };

  return (
    <AuthContext.Provider value={valor}>
      {!cargando && children}
    </AuthContext.Provider>
  );
}
