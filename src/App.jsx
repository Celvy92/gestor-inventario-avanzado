// src/App.jsx
import { useReducer, useRef, useCallback, useEffect, useMemo } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./App.css";

const initialState = JSON.parse(localStorage.getItem("inventario")) || [];

function reducer(state, action) {
  switch (action.type) {
    case "AGREGAR":
      return [...state, action.payload];
    case "ELIMINAR":
      return state.filter((_, index) => index !== action.payload);
    case "VACIAR":
      return [];
    default:
      return state;
  }
}

function App() {
  const [inventario, dispatch] = useReducer(reducer, initialState);
  const inputRef = useRef(null);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("inventario", JSON.stringify(inventario));
  }, [inventario]);

  const agregarProducto = useCallback(() => {
    const nombre = inputRef.current.value.trim();
    if (nombre) {
      dispatch({ type: "AGREGAR", payload: nombre });
      inputRef.current.value = "";
      alert("¡Producto agregado!");
    }
  }, []);

  const eliminarProducto = useCallback((index) => {
    dispatch({ type: "ELIMINAR", payload: index });
  }, []);

  const vaciarLista = () => {
    dispatch({ type: "VACIAR" });
  };

  // Memoizar total de productos
  const totalProductos = useMemo(() => inventario.length, [inventario]);

  // Estilo dinámico
  const fondoClase = totalProductos === 0
    ? "sin-productos"
    : totalProductos > 5
    ? "muchos-productos"
    : "pocos-productos";

  return (
    <div className={`contenedor ${fondoClase}`}>
      <h1>🛒 Inventario de Productos</h1>
      <div className="formulario">
        <input ref={inputRef} type="text" placeholder="Ej. Café, Pan..." />
        <button onClick={agregarProducto}>
          <FaPlus /> Agregar
        </button>
      </div>

      {inventario.length === 0 ? (
        <p className="mensaje">🎉 Lista vacía</p>
      ) : (
        <ul className="lista">
          {inventario.map((item, index) => (
            <li key={index}>
              {item}
              <button onClick={() => eliminarProducto(index)}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}

      {inventario.length > 0 && (
        <button className="vaciar" onClick={vaciarLista}>
          Vaciar lista
        </button>
      )}
    </div>
  );
}

export default App;
