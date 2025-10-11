import React, { useState, useEffect } from "react";
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../services/apiService";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ProveedoresPage = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", contacto: "", telefono: "", direccion: "" });

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSuppliers();
      setProveedores(data);
    } catch (err) {
      console.error("Error al cargar proveedores:", err);
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
        setMessage("Proveedor actualizado con éxito.");
      } else {
        await createSupplier(formData);
        setMessage("Proveedor creado con éxito.");
      }
      setFormData({ nombre: "", contacto: "", telefono: "", direccion: "" });
      setEditingSupplier(null);
      fetchSuppliers();
    } catch (err) {
      console.error("Error al guardar proveedor:", err);
      setError(err.message || "Error al guardar el proveedor.");
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({ nombre: supplier.nombre, contacto: supplier.contacto || "", telefono: supplier.telefono || "", direccion: supplier.direccion || "" });
    setMessage(""); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (supplierId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
      setMessage(""); setError("");
      try { await deleteSupplier(supplierId); setMessage("Proveedor eliminado con éxito."); fetchSuppliers(); }
      catch (err) { console.error("Error al eliminar proveedor:", err); setError(err.message || "Error al eliminar el proveedor."); }
    }
  };

  const handleCancelEdit = () => {
    setEditingSupplier(null);
    setFormData({ nombre: "", contacto: "", telefono: "", direccion: "" });
    setMessage(""); setError("");
  };

  if (loading) return <p className="text-gray-600">Cargando proveedores...</p>;
  if (error) return <p className="text-red-500 font-semibold">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Gestión de Proveedores</h2>

      {/* Formulario */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <h3 className="text-xl md:text-2xl font-semibold mb-4">{editingSupplier ? "Editar Proveedor" : "Crear Nuevo Proveedor"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Nombre:</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block font-medium mb-1">Contacto:</label>
              <input type="text" name="contacto" value={formData.contacto} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block font-medium mb-1">Teléfono:</label>
              <input type="text" name="telefono" value={formData.telefono} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300" />
            </div>
            <div>
              <label className="block font-medium mb-1">Dirección:</label>
              <textarea name="direccion" value={formData.direccion} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-indigo-300"></textarea>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <button type="submit" className="flex-1 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition">{editingSupplier ? "Actualizar Proveedor" : "Crear Proveedor"}</button>
            {editingSupplier && <button type="button" onClick={handleCancelEdit} className="flex-1 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition">Cancelar</button>}
          </div>
        </form>
        {message && <p className="text-green-600 mt-3">{message}</p>}
        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>

      {/* Lista de proveedores responsive (cards en móvil) */}
      <div className="space-y-4">
        {proveedores.length === 0 ? (
          <p className="text-gray-600">No hay proveedores registrados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {proveedores.map(supplier => (
              <div key={supplier.id} className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex flex-col md:flex-row md:gap-4">
                  <p><span className="font-semibold">ID:</span> {supplier.id}</p>
                  <p><span className="font-semibold">Nombre:</span> {supplier.nombre}</p>
                  <p><span className="font-semibold">Contacto:</span> {supplier.contacto || "N/A"}</p>
                  <p><span className="font-semibold">Teléfono:</span> {supplier.telefono || "N/A"}</p>
                  <p><span className="font-semibold">Dirección:</span> {supplier.direccion || "N/A"}</p>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button onClick={() => handleEdit(supplier)} className="text-blue-600 hover:text-blue-800" title="Editar"><FaEdit /></button>
                  <button onClick={() => handleDelete(supplier.id)} className="text-red-600 hover:text-red-800" title="Eliminar"><FaTrashAlt /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProveedoresPage;
