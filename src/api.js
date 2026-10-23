
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
