import React, { useState, useEffect } from "react";
import { createProduct, updateProduct, getSuppliers } from "../../services/apiService";
import { FaSave, FaEdit, FaBarcode, FaTag, FaBox } from "react-icons/fa";

const ProductoForm = ({ onProductCreated, productToEdit, onEditComplete }) => {
  const initialState = {
    nombre: "",
    descripcion: "",
    sku: "",
    precioCompra: "",
    precioVenta: "",
    stockActual: "",
    unidadMedida: "",
    categoria: "",
    imagenUrl: "",
    supplierId: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (err) {
        setError("No se pudieron cargar los proveedores.");
      } finally {
        setLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...productToEdit,
        precioCompra: productToEdit.precioCompra?.toString() || "",
        precioVenta: productToEdit.precioVenta?.toString() || "",
        stockActual: productToEdit.stockActual?.toString() || "",
        supplierId: productToEdit.supplierId?.toString() || "",
      });
    } else {
      setFormData(initialState);
    }
    setMessage("");
    setError("");
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const dataToSend = {
      ...formData,
      precioCompra: Number(formData.precioCompra),
      precioVenta: Number(formData.precioVenta),
      stockActual: Number(formData.stockActual),
      supplierId: formData.supplierId ? Number(formData.supplierId) : null,
    };

    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, dataToSend);
        setMessage("✅ Producto actualizado con éxito");
        setTimeout(() => onEditComplete(), 1500);
      } else {
        await createProduct(dataToSend);
        setMessage("🚀 Producto creado con éxito");
        setFormData(initialState);
        onProductCreated();
      }
    } catch (err) {
      setError(err.message || "Error en la operación.");
    }
  };

  if (loadingSuppliers) return <div className="p-10 text-center animate-pulse text-blue-600 font-medium">Cargando proveedores...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header Dinámico */}
      <div className={`p-6 text-white flex items-center gap-3 ${productToEdit ? 'bg-amber-500' : 'bg-blue-600'}`}>
        {productToEdit ? <FaEdit size={24} /> : <FaSave size={24} />}
        <h2 className="text-2xl font-bold">
          {productToEdit ? "Modificar Producto" : "Registrar Nuevo Producto"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        
        {/* Sección 1: Identificación */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-blue-700 border-b pb-2">
            <FaTag /> <h3 className="font-bold uppercase tracking-wider text-sm">Información General</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Nombre del Producto *</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                placeholder="Ej: Camiseta Algodón XL" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><FaBarcode /> SKU / Código *</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} required
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                placeholder="PROD-001" />
            </div>
          </div>
        </section>

        {/* Sección 2: Precios e Inventario */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-green-700 border-b pb-2">
            <FaBox /> <h3 className="font-bold uppercase tracking-wider text-sm">Precios e Inventario</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Precio Compra ($) *</label>
              <input type="number" name="precioCompra" value={formData.precioCompra} onChange={handleChange} required step="0.01"
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 transition-all outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Precio Venta ($) *</label>
              <input type="number" name="precioVenta" value={formData.precioVenta} onChange={handleChange} required step="0.01"
                className="w-full p-3 bg-green-50 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 transition-all outline-none font-bold text-green-700" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Stock Inicial *</label>
              <input type="number" name="stockActual" value={formData.stockActual} onChange={handleChange} required min="0"
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
            </div>
          </div>
        </section>

        {/* Sección 3: Categorización */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Unidad (Kg, Unid, Par)</label>
            <input type="text" name="unidadMedida" value={formData.unidadMedida} onChange={handleChange} required
              className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Unid" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Categoría</label>
            <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} required
              className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Ropa" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Proveedor</label>
            <select name="supplierId" value={formData.supplierId} onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Ninguno</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>
        </div>

        {/* Botón de Acción */}
        <div className="pt-6">
          <button type="submit"
            className={`w-full py-4 rounded-xl text-lg font-bold shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2 ${
              productToEdit ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}>
            {productToEdit ? <><FaEdit /> Actualizar Producto</> : <><FaSave /> Guardar Producto</>}
          </button>
        </div>

        {/* Mensajes de Feedback */}
        {message && <div className="p-4 bg-green-100 text-green-700 rounded-xl text-center font-bold animate-bounce">{message}</div>}
        {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl text-center font-bold">{error}</div>}
      </form>
    </div>
  );
};

export default ProductoForm;