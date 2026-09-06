import json
from pathlib import Path
import sys


def generar_svg(ruta_json):

    ruta_json = Path(ruta_json)

    if not ruta_json.exists():
        raise FileNotFoundError(
            f"No existe el JSON:\n{ruta_json}"
        )

    # ========================================================
    # LEER JSON
    # ========================================================

    with open(
        ruta_json,
        "r",
        encoding="utf-8"
    ) as archivo:

        lotes = json.load(archivo)

    print("=" * 70)
    print("GENERACIÓN DE SVG")
    print("=" * 70)

    print(f"Archivo JSON: {ruta_json}")
    print(f"Lotes recibidos: {len(lotes)}")

    # ========================================================
    # OBTENER TODOS LOS PUNTOS
    # ========================================================

    todos_los_puntos = []

    for lote in lotes:
    
        # Solo considerar lotes que realmente serán dibujados
        if lote.get("clasificacion") != "LOTE":
            continue
        
        vertices = lote.get("vertices", [])
    
        for punto in vertices:
        
            if len(punto) >= 2:
            
                x = float(punto[0])
                y = float(punto[1])
    
                todos_los_puntos.append(
                    (x, y)
                )
    
    if not todos_los_puntos:

        raise ValueError(
            "El JSON no contiene vértices."
        )

    # ========================================================
    # BOUNDS
    # ========================================================

    min_x = min(
        punto[0]
        for punto in todos_los_puntos
    )

    max_x = max(
        punto[0]
        for punto in todos_los_puntos
    )

    min_y = min(
        punto[1]
        for punto in todos_los_puntos
    )

    max_y = max(
        punto[1]
        for punto in todos_los_puntos
    )

    ancho = max_x - min_x
    alto = max_y - min_y

    print()
    print("Bounds:")
    print(f"min X: {min_x}")
    print(f"max X: {max_x}")
    print(f"min Y: {min_y}")
    print(f"max Y: {max_y}")

    print()
    print(f"Ancho: {ancho}")
    print(f"Alto : {alto}")

    # ========================================================
    # MARGEN
    # ========================================================

    margen = max(ancho, alto) * 0.03

    view_min_x = 0
    view_min_y = 0

    view_width = ancho + margen * 2
    view_height = alto + margen * 2

    # ========================================================
    # SVG
    # ========================================================

    elementos = []

    elementos.append(
        f'''<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="{view_min_x} {view_min_y} {view_width} {view_height}"
preserveAspectRatio="xMidYMid meet">
'''
    )

    # Fondo

    elementos.append(
        '<rect '
        f'x="{view_min_x}" '
        f'y="{view_min_y}" '
        f'width="{view_width}" '
        f'height="{view_height}" '
        'fill="#f8fafc"/>'
    )

    # ========================================================
    # LOTES
    # ========================================================

    cantidad_generados = 0

    for indice, lote in enumerate(lotes, start=1):

        # Solo dibujar polígonos clasificados como LOTES
        if lote.get("clasificacion") != "LOTE":
            continue

        vertices = lote.get(
            "vertices",
            []
        )

        cerrada = lote.get(
            "cerrada",
            False
        )

        if not cerrada:
            continue

        if len(vertices) < 3:
            continue

        # ========================================================
        # CONSTRUIR PATH SVG
        # ========================================================

        comandos_path = []

        for i, punto in enumerate(vertices):
        
            x = float(punto[0])
            y = float(punto[1])

            # Convertir coordenadas CAD a coordenadas SVG locales
            x_svg = (x - min_x) + margen
            y_svg = (max_y - y) + margen

            if i == 0:
                comandos_path.append(
                    f"M {x_svg},{y_svg}"
                )
            else:
                comandos_path.append(
                    f"L {x_svg},{y_svg}"
                )

        # Cerrar el path
        comandos_path.append("Z")

        path_d = " ".join(comandos_path)

        handle = lote.get(
            "handle",
            ""
        )

        area = lote.get(
            "area",
            None
        )

        identificador = lote.get(
            "identificador",
            ""
        )

        elementos.append(
            f'''
        <path
            id="{handle}"
            d="{path_d}"
            fill="#dbeafe"
            stroke="#2563eb"
            stroke-width="{max(ancho, alto) * 0.001}"
            data-handle="{handle}"
            data-area="{area if area is not None else ''}"
            data-identificador="{identificador}"
            data-lote="{cantidad_generados + 1}"
        />
        '''
        )

        cantidad_generados += 1

    # ========================================================
    # CERRAR SVG
    # ========================================================

    elementos.append(
        "</svg>"
    )

    contenido_svg = "\n".join(
        elementos
    )

    # ========================================================
    # GUARDAR
    # ========================================================

    archivo_salida = ruta_json.with_name(
        ruta_json.stem + ".svg"
    )

    with open(
        archivo_salida,
        "w",
        encoding="utf-8"
    ) as archivo:

        archivo.write(
            contenido_svg
        )

    print()
    print("=" * 70)
    print("RESULTADO")
    print("=" * 70)

    print()
    print(
        f"Lotes convertidos a SVG: "
        f"{cantidad_generados}"
    )

    print()
    print(
        f"[OK] SVG generado en:"
    )

    print(
        archivo_salida
    )

    return archivo_salida


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    if len(sys.argv) < 2:

        print(
            'Uso:\n'
            'python generar_svg.py "lotes_extraidos.json"'
        )

        sys.exit(1)

    archivo_json = sys.argv[1]

    try:

        generar_svg(
            archivo_json
        )

    except Exception as error:

        print()
        print("=" * 70)
        print("ERROR")
        print("=" * 70)

        print(error)

        sys.exit(1)