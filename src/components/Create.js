import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from '../application/userService';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const Create = () => {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const store = async (e) => {
    e.preventDefault();
  if (!email.trim() || !contraseña.trim() || !categoria.trim()) {
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
      await createUser({
        email: email.trim(),
        password: contraseña.trim(),
        categoria: categoria.trim(),
      });
      MySwal.fire({
        icon: "success",
        title: "Éxito",
        text: "Usuario creado correctamente",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: "#ff6600",
      });
      navigate("/");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el usuario",
        confirmButtonColor: "#ff6600",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Crear Usuario
            </h2>

            <form onSubmit={store} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Ingrese el email"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Ingrese la contraseña"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Categoría
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={loading}
                >
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

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
