import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const Edit = () => {
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  const getUserById = async (id) => {
    try {
      setLoadingData(true);
      const userDoc = doc(db, "users", id);
      const userData = await getDoc(userDoc);
      if (userData.exists()) {
        const data = userData.data();
        setNombre(data.Nombre || "");
        setContraseña(data.Contraseña || "");
        setCategoria(data.Categoria || "");
      } else {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Usuario no encontrado",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar el usuario",
      });
      navigate("/");
    } finally {
      setLoadingData(false);
    }
  };

  const update = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !contraseña.trim() || !categoria.trim()) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Todos los campos son obligatorios",
        confirmButtonColor: "#ff6600",
      });
      return;
    }
    try {
      setLoading(true);
      const userDoc = doc(db, "users", id);
      await updateDoc(userDoc, {
        Nombre: nombre.trim(),
        Contraseña: contraseña.trim(),
        Categoria: categoria.trim(),
      });
      MySwal.fire({
        icon: "success",
        title: "Éxito",
        text: "Usuario actualizado correctamente",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#ff6600",
      });
      navigate("/");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el usuario",
        confirmButtonColor: "#ff6600",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserById(id);
  }, [id]);

  if (loadingData) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" />
          <p className="muted" style={{ marginTop: 12 }}>Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page p-3 sm:p-6">
      <div className="center-container max-w-lg mx-auto">
        <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="title text-xl sm:text-2xl font-semibold text-center mb-6">Editar Usuario</h2>
          <form onSubmit={update}>
            <div className="form-row">
              <label className="label">Nombre</label>
              <input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" placeholder="Ingrese el nombre" disabled={loading} />
            </div>
            <div className="form-row">
              <label className="label">Contraseña</label>
              <input className="input" value={contraseña} onChange={(e) => setContraseña(e.target.value)} type="password" placeholder="Ingrese la contraseña" disabled={loading} />
            </div>
            <div className="form-row">
              <label className="label">Categoría</label>
              <select className="input" value={categoria} onChange={(e) => setCategoria(e.target.value)} disabled={loading}>
                <option value="">Seleccione una categoría</option>
                <option value="oro">Oro</option>
                <option value="plata">Plata</option>
                <option value="bronce">Bronce</option>
                <option value="A">Categoría A</option>
                <option value="B">Categoría B</option>
                <option value="Z">Categoría Z</option>
                <option value="Normal">Normal</option>
              </select>
            </div>

            <div className="actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate("/")} disabled={loading}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Actualizando..." : "Actualizar"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;
