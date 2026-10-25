
import { useState } from 'react'
import { iniciarSesion, obtenerProductos, registrarProducto } from './api'
import './App.css'

function App() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [usuario, setUsuario] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [productos, setProductos] = useState([])
  const [mostrarProductos, setMostrarProductos] = useState(false)
  const [errorProductos, setErrorProductos] = useState('')
  
  const [nuevoProducto, setNuevoProducto] = useState({
    codigo: '',
    nombre: '',
    precio_compra: '',
    precio_venta: '',
    stock_minimo: '',
  })

  const [mensajeProducto, setMensajeProducto] = useState('')
  const [guardandoProducto, setGuardandoProducto] = useState(false)

  
  async function guardarNuevoProducto(evento) {
    evento.preventDefault()
    setMensajeProducto('')
    setErrorProductos('')
    setGuardandoProducto(true)

    try {
      const producto = {
        codigo: nuevoProducto.codigo.trim(),
        nombre: nuevoProducto.nombre.trim(),
        precio_compra: Number(nuevoProducto.precio_compra),
        precio_venta: Number(nuevoProducto.precio_venta),
        stock_minimo: Number(nuevoProducto.stock_minimo),
      }

      await registrarProducto(usuario.token, producto)

      setMensajeProducto('Medicamento registrado correctamente')

      setNuevoProducto({
        codigo: '',
        nombre: '',
        precio_compra: '',
        precio_venta: '',
        stock_minimo: '',
      })

      const datos = await obtenerProductos(usuario.token)
      setProductos((Array.isArray(datos) ? datos : datos.productos || []).filter(producto => producto.activo === true))
      setMostrarProductos(true)
    } catch (err) {
      setErrorProductos(err.message || 'Error al registrar medicamento')
    } finally {
      setGuardandoProducto(false)
    }
  }

  async function consultarProductos() {
    setErrorProductos('')

    try {
      const datos = await obtenerProductos(usuario.token)

      setProductos((Array.isArray(datos) ? datos : datos.productos || []).filter(producto => producto.activo === true))
      setMostrarProductos(true)
    } catch (err) {
      setErrorProductos(err.message || 'Error al consultar productos')
    }
  }




  async function entrar(evento) {
    evento.preventDefault()
    setError('')
    setCargando(true)

    try {
      const datos = await iniciarSesion(correo, password)

      if (!datos.access_token) {
        throw new Error('No se recibió el token de acceso')
      }

      setUsuario({ correo, token: datos.access_token })
      setPassword('')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  function salir() {
    setUsuario(null)
    setCorreo('')
    setPassword('')
    setError('')
  }

  return (
    <div className="farmacia">
      <header>
        <h1>Farmacia Mundo Magistral</h1>
        <p>Sistema Web de Compras, Ventas e Inventario</p>
      </header>

      <main>
        {!usuario ? (
          <section className="login">
            <h2>Iniciar sesión</h2>
            <p>Ingresa con tu cuenta autorizada de la farmacia.</p>

            <form onSubmit={entrar}>
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />

              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && <p role="alert" className="error">{error}</p>}

              <button type="submit" disabled={cargando}>
                {cargando ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </section>
        ) : (
          <>
            <h2>Bienvenido al sistema</h2>
            <p>Sesión iniciada como: {usuario.correo}</p>

            <button type="button" onClick={salir}>
              Cerrar sesión
            </button>

            <section className="modulos">
              <div
                role="button"
                tabIndex={0}
                onClick={consultarProductos}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') consultarProductos()
                  }}
                 style={{ cursor: 'pointer' }}
              >
                  💊 Productos
              </div>

              <div>🛒 Ventas</div>
              <div>📦 Compras</div>
              <div>📊 Inventario y Kardex</div>
              <div>👥 Usuarios</div>
              <div>📅 Lotes y vencimientos</div>
            </section>
            
            {errorProductos && (
              <p className="error" role="alert">
                {errorProductos}
              </p>
            )}
            
            <section className="lista-productos">
              <h2>Registrar nuevo medicamento</h2>

              <form onSubmit={guardarNuevoProducto} className="form-producto">
                <label>
                  Código
                  <input
                    type="text"
                    value={nuevoProducto.codigo}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        codigo: e.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  Nombre del medicamento
                  <input
                    type="text"
                    value={nuevoProducto.nombre}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        nombre: e.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  Precio de compra (Bs)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={nuevoProducto.precio_compra}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        precio_compra: e.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  Precio de venta (Bs)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={nuevoProducto.precio_venta}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        precio_venta: e.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  Stock mínimo
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={nuevoProducto.stock_minimo}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        stock_minimo: e.target.value,
                      })
                    }
                    required
                  />
                </label>

                <button type="submit" disabled={guardandoProducto}>
                  {guardandoProducto ? 'Guardando...' : 'Registrar medicamento'}
                </button>
              </form>

              {mensajeProducto && <p>{mensajeProducto}</p>}
            </section>


            {mostrarProductos && (
              <section className="lista-productos">
                <h2>💊 Productos registrados</h2>

                {productos.length === 0 ? (
                  <p>No hay productos registrados.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Medicamento</th>
                        <th>Precio de venta</th>
                        <th>Stock actual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((producto) => (
                        <tr key={producto.id_producto}>
                          <td>{producto.codigo}</td>
                          <td>{producto.nombre}</td>
                          <td>Bs {producto.precio_venta}</td>
                          <td>{producto.stock_actual}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            )}

          </>
        )}
      </main>
    </div>
  )
}

export default App
