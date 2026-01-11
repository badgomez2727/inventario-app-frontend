import React, { useState, useEffect } from "react";
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../services/apiService";
import { FaEdit, FaTrashAlt, FaTruck, FaPhone, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const ProveedoresPage = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", contacto: "", telefono: "", direccion: "" });

  useEffect(() => { fetchSuppliers(); }, []);

  // Auto-ocultar mensajes
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSuppliers();
      setProveedores(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los proveedores.");
    } finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, formData);
        setMessage("✅ Proveedor actualizado con éxito.");
      } else {
        await createSupplier(formData);
        setMessage("🚀 Proveedor registrado en el sistema.");
      }
      setFormData({ nombre: "", contacto: "", telefono: "", direccion: "" });
      setEditingSupplier(null);
      fetchSuppliers();
    } catch (err) {
      setError(err.message || "Error al guardar el proveedor.");
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({ 
      nombre: supplier.nombre, 
      contacto: supplier.contacto || "", 
      telefono: supplier.telefono || "", 
      direccion: supplier.direccion || "" 
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (supplierId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
      try { 
        await deleteSupplier(supplierId); 
        setMessage("🗑️ Proveedor eliminado."); 
        fetchSuppliers(); 
      }
      catch (err) { setError(err.message || "Error al eliminar."); }
    }
  };

  if (loading) return <div className="p-10 text-center text-emerald-600 font-bold animate-pulse">Cargando aliados logísticos...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gray-900 rounded-2xl text-emerald-500 shadow-lg">
          <FaTruck size={24} />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
          Gestión de <span className="text-emerald-500">Proveedores</span>
        </h2>
      </div>

      {/* Formulario Estilizado */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all">
        <h3 className="text-lg font-bold mb-4 text-gray-700">
          {editingSupplier ? "📝 Actualizar Datos" : "➕ Agregar Nuevo Aliado"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="nombre" placeholder="Nombre de la empresa" value={formData.nombre} onChange={handleChange} required
              className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
            <input type="text" name="contacto" placeholder="Nombre del asesor" value={formData.contacto} onChange={handleChange}
              className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
            <input type="text" name="telefono" placeholder="Teléfono / WhatsApp" value={formData.telefono} onChange={handleChange}
              className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
            <input type="text" name="direccion" placeholder="Dirección de bodega" value={formData.direccion} onChange={handleChange}
              className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20">
              {editingSupplier ? "Guardar Cambios" : "Registrar Proveedor"}
            </button>
            {editingSupplier && (
              <button type="button" onClick={() => { setEditingSupplier(null); setFormData({ nombre: "", contacto: "", telefono: "", direccion: "" }); }} 
                className="px-6 bg-gray-100 text-gray-500 font-bold rounded-xl">Cancelar</button>
            )}
          </div>
        </form>
        {message && <p className="text-emerald-600 mt-3 text-center font-medium animate-bounce">{message}</p>}
      </div>

      {/* Lista de Proveedores en Cards Modernas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {proveedores.map(supplier => (
          <div key={supplier.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:border-emerald-200 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-black text-gray-800 text-lg uppercase">{supplier.nombre}</h4>
                <p className="text-xs text-gray-400 font-mono">ID: {supplier.id}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(supplier)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><FaEdit /></button>
                <button onClick={() => handleDelete(supplier.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><FaTrashAlt /></button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaUser className="text-emerald-500 w-4" /> <span>{supplier.contacto || "Sin contacto directo"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-emerald-500 w-4" /> <span>{supplier.telefono || "Sin teléfono"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-emerald-500 w-4" /> <span className="truncate">{supplier.direccion || "Sin dirección"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProveedoresPage;