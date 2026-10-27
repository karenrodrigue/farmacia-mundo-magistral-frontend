
import { useState } from 'react'
import { iniciarSesion, obtenerProductos, registrarProducto, registrarVenta, registrarCompra, obtenerKardex, obtenerMiPerfil, obtenerLotes } from './api'
import './App.css'
import GraficoInventario3D from './GraficoInventario3D'

function App() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [usuario, setUsuario] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [productos, setProductos] = useState([])
  const [mostrarProductos, setMostrarProductos] = useState(false)
  const [mostrarGrafico3D, setMostrarGrafico3D] = useState(false)
  const [errorProductos, setErrorProductos] = useState('')
  const [moduloActivo, setModuloActivo] = useState('inicio')
  const [perfilUsuario, setPerfilUsuario] = useState(null)
  const [errorPerfil, setErrorPerfil] = useState('')
  const [cargandoPerfil, setCargandoPerfil] = useState(false)
  const [lotes, setLotes] = useState([])
  const [errorLotes, setErrorLotes] = useState('')
  const [cargandoLotes, setCargandoLotes] = useState(false)
  const [movimientosKardex, setMovimientosKardex] = useState([])
  const [errorKardex, setErrorKardex] = useState('')
  const [cargandoKardex, setCargandoKardex] = useState(false)
  const [ventaProducto, setVentaProducto] = useState('')
  const [ventaCantidad, setVentaCantidad] = useState(1)
  const [mensajeVenta, setMensajeVenta] = useState('')
  const [guardandoVenta, setGuardandoVenta] = useState(false)
  const [compraProveedor, setCompraProveedor] = useState('')
  const [compraProducto, setCompraProducto] = useState('')
  const [compraCantidad, setCompraCantidad] = useState(1)
  const [compraPrecio, setCompraPrecio] = useState('')
  const [compraFactura, setCompraFactura] = useState('')
  const [mensajeCompra, setMensajeCompra] = useState('')
  const [guardandoCompra, setGuardandoCompra] = useState(false)
  
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

<div className="panel-administrativo">          
<aside className="modulos">
  <button type="button" onClick={() => setModuloActivo('inicio')}>
    🏠 Inicio
  </button>

  <button type="button" onClick={() => {
    setModuloActivo('productos')
    consultarProductos()
  }}>
    💊 Productos
  </button>

  <button type="button" onClick={() => setModuloActivo('ventas')}>
    🛒 Ventas
  </button>

  <button type="button" onClick={() => {
  setModuloActivo('compras')
  consultarProductos()
}}>
    📦 Compras
  </button>

  
<button type="button" onClick={async () => {
  setModuloActivo('inventario')
  consultarProductos()
  setMostrarGrafico3D(true)
  setErrorKardex('')
  setCargandoKardex(true)

  try {
    const datos = await obtenerKardex(usuario.token)
    setMovimientosKardex(datos.movimientos || [])
  } catch (err) {
    setErrorKardex(err.message || 'Error al consultar el Kardex')
    setMovimientosKardex([])
  } finally {
    setCargandoKardex(false)
  }
}}>

    📊 Inventario y Kardex
  </button>

  
<button type="button" onClick={async () => {
  setModuloActivo('usuarios')
  setErrorPerfil('')
  setCargandoPerfil(true)
  setPerfilUsuario(null)

  try {
    const datos = await obtenerMiPerfil(usuario.token)
    setPerfilUsuario(datos.usuario || null)
  } catch (err) {
    setErrorPerfil(err.message || 'No se pudo consultar el perfil')
  } finally {
    setCargandoPerfil(false)
  }
}}>

    👥 Usuarios
  </button>

  
<button type="button" onClick={async () => {
  setModuloActivo('lotes')
  setErrorLotes('')
  setCargandoLotes(true)
  setLotes([])

  try {
    const datos = await obtenerLotes(usuario.token)
    setLotes(Array.isArray(datos) ? datos : datos.lotes || [])
  } catch (err) {
    setErrorLotes(err.message || 'No se pudieron consultar los lotes')
  } finally {
    setCargandoLotes(false)
  }
}}>

    📅 Lotes y vencimientos
  </button>
</aside>
<div className="contenido-principal">
  
{moduloActivo === 'inicio' && (
  <section className="lista-productos">
    <h2>🏠 Panel principal</h2>
    <p>Bienvenido al sistema de Farmacia Mundo Magistral.</p>
    <p>Selecciona un módulo del menú izquierdo para comenzar.</p>
  </section>
)}

{moduloActivo === 'ventas' && (
  <section className="lista-productos">
    <h2>🛒 Registrar nueva venta</h2>
    <p>Selecciona un medicamento e indica la cantidad.</p>

    <form onSubmit={async (e) => {
      e.preventDefault()
      setMensajeVenta('')

      const producto = productos.find(
        p => p.id_producto === Number(ventaProducto)
      )

      if (!producto) {
        setMensajeVenta('Selecciona un medicamento válido.')
        return
      }

      if (Number(ventaCantidad) > Number(producto.stock_actual)) {
        setMensajeVenta('No hay suficiente stock disponible.')
        return
      }

      setGuardandoVenta(true)

      try {
        await registrarVenta(usuario.token, {
          id_producto: Number(ventaProducto),
          cantidad: Number(ventaCantidad),
          id_cliente: null
        })

        setMensajeVenta('Venta registrada correctamente.')
        setVentaProducto('')
        setVentaCantidad(1)

        const datos = await obtenerProductos(usuario.token)
        setProductos(
          Array.isArray(datos) ? datos : datos.productos || []
        )
      } catch (err) {
        setMensajeVenta(err.message || 'Error al registrar la venta.')
      } finally {
        setGuardandoVenta(false)
      }
    }} className="form-producto">

      <label>
        Medicamento
        <select
          value={ventaProducto}
          onChange={(e) => setVentaProducto(e.target.value)}
          required
        >
          <option value="">Seleccionar medicamento</option>
          {productos
            .filter(p => p.activo === true)
            .map(p => (
              <option key={p.id_producto} value={p.id_producto}>
                {p.nombre} — Bs {p.precio_venta} — Stock: {p.stock_actual}
              </option>
            ))}
        </select>
      </label>

      <label>
        Cantidad
        <input
          type="number"
          min="1"
          step="1"
          value={ventaCantidad}
          onChange={(e) => setVentaCantidad(e.target.value)}
          required
        />
      </label>

      <p>
        <strong>Total: Bs {
          (
            (Number(productos.find(
              p => p.id_producto === Number(ventaProducto)
            )?.precio_venta) || 0) *
            (Number(ventaCantidad) || 0)
          ).toFixed(2)
        }</strong>
      </p>

      <button type="submit" disabled={guardandoVenta}>
        {guardandoVenta ? 'Registrando...' : 'Confirmar venta'}
      </button>
    </form>

    {mensajeVenta && <p role="status">{mensajeVenta}</p>}
  </section>
)}

{moduloActivo === 'compras' && (
  <section className="lista-productos">
    <h2>📦 Registrar nueva compra</h2>
    <p>Registra el ingreso de medicamentos al inventario.</p>

    <form
      className="form-producto"
      onSubmit={async (e) => {
        e.preventDefault()
        setMensajeCompra('')

        const cantidad = Number(compraCantidad)
        const precio = Number(compraPrecio)
        const proveedor = Number(compraProveedor)
        const producto = Number(compraProducto)

        if (
          !Number.isInteger(proveedor) || proveedor <= 0 ||
          !Number.isInteger(producto) || producto <= 0 ||
          !Number.isInteger(cantidad) || cantidad <= 0 ||
          !Number.isFinite(precio) || precio < 0
        ) {
          setMensajeCompra('Revisa los datos de la compra.')
          return
        }

        setGuardandoCompra(true)

        try {
          await registrarCompra(usuario.token, {
            id_proveedor: proveedor,
            id_producto: producto,
            cantidad: cantidad,
            precio_unitario: precio,
            numero_factura: compraFactura.trim() || null
          })

          setMensajeCompra('Compra registrada correctamente.')
          setCompraProducto('')
          setCompraCantidad(1)
          setCompraPrecio('')
          setCompraFactura('')

          const datos = await obtenerProductos(usuario.token)
          setProductos(
            Array.isArray(datos) ? datos : datos.productos || []
          )
        } catch (err) {
          setMensajeCompra(err.message || 'Error al registrar la compra.')
        } finally {
          setGuardandoCompra(false)
        }
      }}
    >
      <label>
        ID del proveedor
        <input
          type="number"
          min="1"
          step="1"
          value={compraProveedor}
          onChange={(e) => setCompraProveedor(e.target.value)}
          placeholder="ID de un proveedor existente"
          required
        />
      </label>

      <label>
        Medicamento
        <select
          value={compraProducto}
          onChange={(e) => setCompraProducto(e.target.value)}
          required
        >
          <option value="">Seleccionar medicamento</option>
          {productos
            .filter(p => p.activo === true)
            .map(p => (
              <option key={p.id_producto} value={p.id_producto}>
                {p.nombre} — Stock: {p.stock_actual}
              </option>
            ))}
        </select>
      </label>

      <label>
        Cantidad
        <input
          type="number"
          min="1"
          step="1"
          value={compraCantidad}
          onChange={(e) => setCompraCantidad(e.target.value)}
          required
        />
      </label>

      <label>
        Precio unitario (Bs)
        <input
          type="number"
          min="0"
          step="0.01"
          value={compraPrecio}
          onChange={(e) => setCompraPrecio(e.target.value)}
          required
        />
      </label>

      <label>
        Número de factura (opcional)
        <input
          type="text"
          value={compraFactura}
          onChange={(e) => setCompraFactura(e.target.value)}
        />
      </label>

      <p>
        <strong>
          Total: Bs {(Number(compraCantidad) * Number(compraPrecio || 0)).toFixed(2)}
        </strong>
      </p>

      <button type="submit" disabled={guardandoCompra}>
        {guardandoCompra ? 'Registrando...' : 'Confirmar compra'}
      </button>
    </form>

    {mensajeCompra && <p role="status">{mensajeCompra}</p>}
  </section>
)}

{moduloActivo === 'usuarios' && (
  <section className="lista-productos">
    <h2>👥 Gestión de usuarios</h2>
    <p>Información de la cuenta que inició sesión.</p>

    {cargandoPerfil && <p>Cargando información del usuario...</p>}

    {errorPerfil && (
      <p className="error" role="alert">{errorPerfil}</p>
    )}

    {perfilUsuario && (
      <div className="tarjeta-usuario">
        <h3>👤 Perfil del usuario</h3>

        <p>
          <strong>Nombre:</strong>{' '}
          {perfilUsuario.nombre || 'No registrado'}
        </p>

        <p>
          <strong>Correo electrónico:</strong>{' '}
          {perfilUsuario.correo || usuario.correo}
        </p>

        <p>
          <strong>Rol:</strong>{' '}
          {perfilUsuario.rol || 'No disponible'}
        </p>

        <p>
          <strong>Estado:</strong>{' '}
          {perfilUsuario.activo === false ? 'Inactivo' : 'Activo'}
        </p>
      </div>
    )}
  </section>
)}


{moduloActivo === 'lotes' && (
  <section className="lista-productos">
    <h2>📅 Lotes y vencimientos</h2>
    <p>Control de lotes y fechas de vencimiento de medicamentos.</p>

    {cargandoLotes && <p>Cargando lotes...</p>}

    {errorLotes && (
      <p className="error" role="alert">{errorLotes}</p>
    )}

    {!cargandoLotes && !errorLotes && (
      lotes.length === 0 ? (
        <p>No hay lotes registrados.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Número de lote</th>
                <th>Vencimiento</th>
                <th>Stock</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((lote) => {
                const fecha = new Date(
                  `${String(lote.fecha_vencimiento).slice(0, 10)}T00:00:00`
                )
                const hoy = new Date()
                hoy.setHours(0, 0, 0, 0)

                const dias = Math.ceil(
                  (fecha.getTime() - hoy.getTime()) / 86400000
                )

                const estado = !Number.isFinite(dias)
                  ? 'Fecha no disponible'
                  : dias < 0
                    ? 'Vencido'
                    : dias <= 30
                      ? 'Próximo a vencer'
                      : 'Vigente'

                return (
                  <tr key={lote.id_lote}>
                    <td>{lote.producto}</td>
                    <td>{lote.numero_lote}</td>
                    <td>{String(lote.fecha_vencimiento).slice(0, 10)}</td>
                    <td>{lote.stock_lote}</td>
                    <td>{estado}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    )}
  </section>
)}

            
          {moduloActivo === 'inventario' && mostrarGrafico3D && (
              <section className="lista-productos">
                <h2>📊 Inventario y Kardex — Gráfico 3D</h2>
                <GraficoInventario3D productos={productos} />
               <button
                 type="button"
                 onClick={() => setMostrarGrafico3D(false)}
               >
                 Cerrar gráfico
              </button>
            </section>
          )}
          
{moduloActivo === 'inventario' && (
  <section className="lista-productos">
    <h2>📋 Kardex — Movimientos de inventario</h2>

    {cargandoKardex && <p>Cargando movimientos...</p>}

    {errorKardex && (
      <p className="error" role="alert">{errorKardex}</p>
    )}

    {!cargandoKardex && !errorKardex && (
      movimientosKardex.length === 0 ? (
        <p>No hay movimientos registrados.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Medicamento</th>
                <th>Movimiento</th>
                <th>Cantidad</th>
                <th>Anterior</th>
                <th>Final</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              {movimientosKardex.map((movimiento) => (
                <tr key={movimiento.id_movimiento}>
                  <td>{movimiento.fecha_movimiento
                    ? new Date(movimiento.fecha_movimiento).toLocaleString('es-BO')
                    : '—'}</td>
                  <td>{movimiento.producto || '—'}</td>
                  <td>{movimiento.tipo_movimiento}</td>
                  <td>{movimiento.cantidad}</td>
                  <td>{movimiento.cantidad_previa}</td>
                  <td>{movimiento.cantidad_final}</td>
                  <td>{movimiento.responsable || 'No registrado'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    )}
  </section>
)}


            {errorProductos && (
              <p className="error" role="alert">
                {errorProductos}
              </p>
            )}
            {moduloActivo === 'productos' && (
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
            )}


            {moduloActivo === 'productos' && mostrarProductos && (
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
        </div>
      </div>
    </>
  )}
</main>
</div>
)
}
 
export default App

