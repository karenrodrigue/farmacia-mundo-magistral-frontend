
export const API_URL = import.meta.env.VITE_API_URL

export async function iniciarSesion(correo, password) {
  const respuesta = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo, password }),
  })

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(datos.detail || 'No se pudo iniciar sesión')
  }

  return datos
}

export async function obtenerProductos(token) {
  const respuesta = await fetch(`${API_URL}/productos`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(datos.detail || 'No se pudieron obtener los productos')
  }

  return datos
}

export async function registrarProducto(token, producto) {
  const respuesta = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(producto),
  })

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      typeof datos.detail === 'string'
        ? datos.detail
        : 'No se pudo registrar el producto'
    )
  }

  return datos
}

export async function registrarVenta(token, venta) {
  const respuesta = await fetch(`${API_URL}/ventas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(venta),
  })

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      typeof datos.detail === 'string'
        ? datos.detail
        : 'No se pudo registrar la venta'
    )
  }

  return datos
}

export async function registrarCompra(token, compra) {
  const respuesta = await fetch(`${API_URL}/compras`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(compra),
  })

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      typeof datos.detail === 'string'
        ? datos.detail
        : 'No se pudo registrar la compra'
    )
  }

  return datos
}

export async function obtenerKardex(token) {
  const respuesta = await fetch(`${API_URL}/kardex`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      typeof datos.detail === 'string'
        ? datos.detail
        : 'No se pudo consultar el Kardex'
    )
  }

  return datos
}

export async function obtenerMiPerfil(token) {
  const respuesta = await fetch(`${API_URL}/mi-perfil`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      typeof datos.detail === 'string'
        ? datos.detail
        : 'No se pudo consultar el perfil'
    )
  }

  return datos
}

export async function obtenerLotes(token) {
  const respuesta = await fetch(`${API_URL}/lotes`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      typeof datos.detail === 'string'
        ? datos.detail
        : 'No se pudieron consultar los lotes'
    )
  }

  return datos
}
