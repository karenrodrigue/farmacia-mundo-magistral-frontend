
import { useEffect, useRef } from 'react'
import Plotly from 'plotly.js-dist-min'

export default function GraficoInventario3D({ productos = [] }) {
  const contenedor = useRef(null)

  useEffect(() => {
    const elemento = contenedor.current
    if (!elemento) return

    const lista = productos.filter((p) => p.activo !== false)

    const nombres = lista.map((p) => p.nombre)
    const precios = lista.map((p) => Number(p.precio_venta) || 0)
    const cantidades = lista.map((p) => Number(p.stock_actual) || 0)

    Plotly.react(
      elemento,
      [{
        type: 'scatter3d',
        mode: 'markers+text',
        x: nombres.map((_, i) => i),
        y: precios,
        z: cantidades,
        text: nombres,
        textposition: 'top center',
        marker: {
          size: 8,
          color: cantidades,
          colorscale: 'Viridis',
          opacity: 0.9
        },
        hovertemplate:
          '%{text}<br>Precio: Bs %{y}<br>Stock: %{z} unidades<extra></extra>'
      }],
      {
        title: 'Inventario 3D — Farmacia Mundo Magistral',
        autosize: true,
        margin: { l: 0, r: 0, b: 0, t: 60 },
        scene: {
          xaxis: {
            title: 'Medicamento',
            tickvals: nombres.map((_, i) => i),
            ticktext: nombres
          },
          yaxis: { title: 'Precio de venta (Bs)' },
          zaxis: { title: 'Stock (unidades)', rangemode: 'tozero' }
        }
      },
      { responsive: true, displaylogo: false }
    )

    return () => {
      Plotly.purge(elemento)
    }
  }, [productos])

  if (productos.length === 0) {
    return <p>No hay medicamentos para mostrar en el gráfico.</p>
  }

  return (
    <div
      ref={contenedor}
      style={{ width: '100%', height: '600px' }}
    />
  )
}
