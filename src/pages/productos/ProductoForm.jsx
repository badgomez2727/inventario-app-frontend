// venta_inventario_app/frontend/src/pages/productos/ProductoForm.jsx

import React, { useState, useEffect } from "react";
import {
  createProduct,
  updateProduct,
  getSuppliers,
} from "../../services/apiService";

const ProductoForm = ({ onProductCreated, productToEdit, onEditComplete }) => {
  const [formData, setFormData] = useState({
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
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  // Cargar proveedores
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (err) {
        console.error("Error al cargar proveedores:", err);
        setError("No se pudieron cargar los proveedores.");
      } finally {
        setLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, []);

  // Cargar datos del producto en edición
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nombre: productToEdit.nombre || "",
        descripcion: productToEdit.descripcion || "",
        sku: productToEdit.sku || "",
        precioCompra:
          productToEdit.precioCompra != null
            ? productToEdit.precioCompra.toString()
            : "",
        precioVenta:
          productToEdit.precioVenta != null
            ? productToEdit.precioVenta.toString()
            : "",
        stockActual:
          productToEdit.stockActual != null
            ? productToEdit.stockActual.toString()
            : "",
        unidadMedida: productToEdit.unidadMedida || "",
        categoria: productToEdit.categoria || "",
        imagenUrl: productToEdit.imagenUrl || "",
        supplierId:
          productToEdit.supplierId != null
            ? productToEdit.supplierId.toString()
            : "",
      });
    } else {
      setFormData({
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
      });
    }
    setMessage("");
    setError("");
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      ["precioCompra", "precioVenta", "stockActual", "supplierId"].includes(
        name
      )
    ) {
      if (value === "" || !isNaN(Number(value))) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (
      !formData.nombre ||
      !formData.sku ||
      formData.precioCompra === "" ||
      formData.precioVenta === "" ||
      formData.stockActual === "" ||
      !formData.unidadMedida ||
      !formData.categoria
    ) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const dataToSend = {
      ...formData,
      precioCompra: Number(formData.precioCompra),
      precioVenta: Number(formData.precioVenta),
      stockActual: Number(formData.stockActual),
      supplierId:
        formData.supplierId === "" ? null : Number(formData.supplierId),
    };

    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, dataToSend);
        setMessage("Producto actualizado con éxito!");
        onEditComplete();
      } else {
        await createProduct(dataToSend);
        setMessage("Producto creado con éxito!");
        setFormData({
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
        });
        onProductCreated();
      }
    } catch (err) {
      console.error("Error durante la operación del producto:", err);
      setError(err.message || "Error en la operación del producto.");
    }
  };

  if (loadingSuppliers) return <p className="text-gray-500">Cargando proveedores...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {productToEdit ? "Editar Producto" : "Crear Nuevo Producto"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SKU *
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio Compra *
            </label>
            <input
              type="number"
              name="precioCompra"
              value={formData.precioCompra}
              onChange={handleChange}
              step="0.01"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio Venta *
            </label>
            <input
              type="number"
              name="precioVenta"
              value={formData.precioVenta}
              onChange={handleChange}
              step="0.01"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock Actual *
            </label>
            <input
              type="number"
              name="stockActual"
              value={formData.stockActual}
              onChange={handleChange}
              min="0"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unidad de Medida *
            </label>
            <input
              type="text"
              name="unidadMedida"
              value={formData.unidadMedida}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoría *
            </label>
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Proveedor
            </label>
            <select
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              <option value="">Seleccione un proveedor (Opcional)</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            URL Imagen
          </label>
          <input
            type="text"
            name="imagenUrl"
            value={formData.imagenUrl}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          {productToEdit ? "Actualizar Producto" : "Crear Producto"}
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default ProductoForm;
