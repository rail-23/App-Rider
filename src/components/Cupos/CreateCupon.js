import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import cupoService from '../../application/cupoService';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const CreateCupon = ({ onSuccess }) => {
  const [fecha, setFecha] = useState("");
  const [manana, setManana] = useState("");
  const [tarde, setTarde] = useState("");
  const [noche, setNoche] = useState("");
  const [loading, setLoading] = useState(false);
  const [modo, setModo] = useState("dia"); // "dia" o "semana"

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fecha || manana === "" || tarde === "" || noche === "") {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Debes seleccionar una fecha y ingresar la cantidad de cupos para cada horario.",
        confirmButtonColor: "#ff6600",
      });
      return;
    }

    // Convertir a números y validar
    const m = Number(manana);
    const t = Number(tarde);
    const n = Number(noche);
    if (Number.isNaN(m) || Number.isNaN(t) || Number.isNaN(n)) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Los cupos deben ser números válidos",
        confirmButtonColor: "#ff6600",
      });
      return;
    }

    setLoading(true);
    try {
      if (modo === "dia") {
        // Crear cupo para un día específico
        await cupoService.createCupo({ 
          fecha: new Date(fecha), 
          Manana: m, 
          Tarde: t, 
          Noche: n 
        });
      } else {
        // Crear cupos para toda la semana
        const fechaInicio = new Date(fecha);
        for (let i = 0; i < 7; i++) {
          const fechaDia = new Date(fechaInicio);
          fechaDia.setDate(fechaDia.getDate() + i);
          await cupoService.createCupo({ 
            fecha: fechaDia, 
            Manana: m, 
            Tarde: t, 
            Noche: n 
          });
        }
      }

      setLoading(false);
      MySwal.fire({
        icon: "success",
        title: "¡Cupos creados!",
        text: modo === "dia" 
          ? `Cupos asignados para el día ${new Date(fecha).toLocaleDateString()}`
          : `Cupos asignados para la semana del ${new Date(fecha).toLocaleDateString()}`,
        confirmButtonColor: "#ff6600",
      });
      if (onSuccess) {
        onSuccess();
      }
      navigate("/cupos");
    } catch (error) {
      console.error("Error al crear cupos:", error);
      setLoading(false);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron crear los cupos. Intenta de nuevo.",
        confirmButtonColor: "#ff6600",
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Poner Cupos disponibles</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Modo de asignación</label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  modo === "dia"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setModo("dia")}
                disabled={loading}
              >
                <span className="material-symbols-outlined mr-1">today</span>
                Por día
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  modo === "semana"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setModo("semana")}
                disabled={loading}
              >
                <span className="material-symbols-outlined mr-1">date_range</span>
                Por semana
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {modo === "dia" ? "Fecha del día" : "Fecha de inicio de semana"}
              {modo === "semana" && (
                <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                  Se crearán cupos para 7 días a partir de la fecha seleccionada
                </span>
              )}
            </label>
            <div className="relative">
              <input 
                type="date" 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                disabled={loading}
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                calendar_month
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cupos Mañana
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(6:00 AM - 2:00 PM)</span>
            </label>
            <div className="relative">
              <input 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                value={manana} 
                onChange={(e) => setManana(e.target.value)} 
                type="number" 
                min="0"
                step="1"
                placeholder="Cantidad de cupos para la mañana" 
                disabled={loading}
                required 
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                wb_sunny
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cupos Tarde
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(2:00 PM - 10:00 PM)</span>
            </label>
            <div className="relative">
              <input 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                value={tarde} 
                onChange={(e) => setTarde(e.target.value)} 
                type="number" 
                min="0"
                step="1"
                placeholder="Cantidad de cupos para la tarde" 
                disabled={loading}
                required 
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                wb_twilight
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cupos Noche
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(10:00 PM - 6:00 AM)</span>
            </label>
            <div className="relative">
              <input 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                value={noche} 
                onChange={(e) => setNoche(e.target.value)} 
                type="number" 
                min="0"
                step="1"
                placeholder="Cantidad de cupos para la noche" 
                disabled={loading}
                required 
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                dark_mode
              </span>
            </div>
          </div>

        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {modo === "dia" ? (
                <span className="flex items-center">
                  <span className="material-symbols-outlined mr-1">info</span>
                  Se crearán cupos para el día seleccionado
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="material-symbols-outlined mr-1">info</span>
                  Se crearán cupos para 7 días consecutivos
                </span>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button 
                type="button" 
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors" 
                onClick={() => navigate("/cupos")} 
                disabled={loading}
              >
                <span className="material-symbols-outlined mr-1">close</span>
                Cancelar
              </button>
              <button 
                type="submit" 
                className="w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors flex items-center justify-center" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin material-symbols-outlined mr-2">progress_activity</span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2">save</span>
                    {modo === "dia" ? "Guardar Cupos del Día" : "Guardar Cupos de la Semana"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCupon;
