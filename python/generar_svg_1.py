import json
from pathlib import Path
import sys
import re
import ezdxf


# ============================================================
# UTILIDADES
# ============================================================

def limpiar_texto(texto):

    if not texto:
        return ""

    texto = str(texto)

    # Limpiar códigos comunes de MTEXT
    texto = re.sub(r"\\C\d+;", "", texto)
    texto = texto.replace("^M^J", " ")
    texto = texto.replace("\\P", " ")

    texto = re.sub(r"\s+", " ", texto)

    return texto.strip().upper()


def obtener_manzanas(ruta_dxf):

    print()
    print("=" * 70)
    print("BUSCANDO MANZANAS EN EL DXF")
    print("=" * 70)

    doc = ezdxf.readfile(str(ruta_dxf))
    msp = doc.modelspace()

    manzanas = []

    for entidad in msp:

        tipo = entidad.dxftype()

        texto = None

        if tipo == "TEXT":
            texto = entidad.dxf.text

        elif tipo == "MTEXT":
            texto = entidad.text

        else:
            continue

        if not texto:
            continue

        texto = limpiar_texto(texto)

        # Una sola letra:
        # A
        # B
        # G
        # H
        # etc.
        if not re.fullmatch(r"[A-Z]", texto):
            continue

        posicion = entidad.dxf.insert

        manzana = {
            "letra": texto,
            "x": float(posicion.x),
            "y": float(posicion.y),
        }

        manzanas.append(manzana)

        print(
            f"Manzana encontrada: {texto} "
            f"| X={posicion.x:.3f} "
            f"| Y={posicion.y:.3f}"
        )

    print()
    print(
        f"Total de manzanas encontradas: "
        f"{len(manzanas)}"
    )

    return manzanas


def buscar_manzana_mas_cercana(
    centro_x,
    centro_y,
    manzanas
):

    if not manzanas:
        return ""

    manzana = min(
        manzanas,
        key=lambda m: (
            (centro_x - m["x"]) ** 2
            +
            (centro_y - m["y"]) ** 2
        )
    )

    return manzana["letra"]


# ============================================================
# GENERAR SVG
# ============================================================

def generar_svg(ruta_json, ruta_dxf):

    ruta_json = Path(ruta_json)
    ruta_dxf = Path(ruta_dxf)

    if not ruta_json.exists():
        raise FileNotFoundError(
            f"No existe el JSON:\n{ruta_json}"
        )

    if not ruta_dxf.exists():
        raise FileNotFoundError(
            f"No existe el DXF:\n{ruta_dxf}"
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
    print(f"Archivo DXF : {ruta_dxf}")
    print(f"Lotes recibidos: {len(lotes)}")

    # ========================================================
    # OBTENER MANZANAS DESDE EL DXF
    # ========================================================

    manzanas = obtener_manzanas(
        ruta_dxf
    )

    # ========================================================
    # OBTENER TODOS LOS PUNTOS
    # ========================================================

    todos_los_puntos = []

    for lote in lotes:

        if lote.get("clasificacion") != "LOTE":
            continue

        vertices = lote.get(
            "vertices",
            []
        )

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

    # ========================================================
    # FONDO
    # ========================================================

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

    for indice, lote in enumerate(
        lotes,
        start=1
    ):

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

        # ====================================================
        # CENTRO DEL LOTE
        # ====================================================

        centro_x = sum(
            float(p[0])
            for p in vertices
        ) / len(vertices)

        centro_y = sum(
            float(p[1])
            for p in vertices
        ) / len(vertices)

        # ====================================================
        # MANZANA
        # ====================================================

        manzana = buscar_manzana_mas_cercana(
            centro_x,
            centro_y,
            manzanas
        )

        # ====================================================
        # CONSTRUIR PATH SVG
        # ====================================================

        comandos_path = []

        for i, punto in enumerate(vertices):

            x = float(punto[0])
            y = float(punto[1])

            x_svg = (
                x
                - min_x
                + margen
            )

            y_svg = (
                max_y
                - y
                + margen
            )

            if i == 0:

                comandos_path.append(
                    f"M {x_svg},{y_svg}"
                )

            else:

                comandos_path.append(
                    f"L {x_svg},{y_svg}"
                )

        comandos_path.append("Z")

        path_d = " ".join(
            comandos_path
        )

        # ====================================================
        # DATOS DEL LOTE
        # ====================================================

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

        # ====================================================
        # TEXTO DEL ÁREA
        # ====================================================

        if area is not None:

            try:

                area_texto = (
                    f"{float(area):.2f} m²"
                )

            except (ValueError, TypeError):

                area_texto = str(area)

        else:

            area_texto = ""

        # ====================================================
        # TAMAÑO DEL TEXTO
        # ====================================================

        tamano_texto = (
            max(ancho, alto)
            * 0.012
        )

        # ====================================================
        # PATH
        # ====================================================

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
            data-manzana="{manzana}"
            data-lote="{cantidad_generados + 1}"
        />
        '''
        )

        # ====================================================
        # NÚMERO DEL LOTE
        # ====================================================

        x_texto = (
            centro_x
            - min_x
            + margen
        )

        y_texto = (
            max_y
            - centro_y
            + margen
        )

        if identificador:

            elementos.append(
                f'''
        <text
            x="{x_texto}"
            y="{y_texto - tamano_texto * 0.5}"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#111827"
            font-family="Arial, sans-serif"
            font-size="{tamano_texto}"
            font-weight="bold"
            pointer-events="none"
        >{identificador}</text>
        '''
            )

        # ====================================================
        # ÁREA DEL LOTE
        # ====================================================

        if area_texto:

            elementos.append(
                f'''
        <text
            x="{x_texto}"
            y="{y_texto + tamano_texto * 0.8}"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#374151"
            font-family="Arial, sans-serif"
            font-size="{tamano_texto * 0.75}"
            pointer-events="none"
        >{area_texto}</text>
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

    # ========================================================
    # RESULTADO
    # ========================================================

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
        "[OK] SVG generado en:"
    )

    print(
        archivo_salida
    )

    return archivo_salida


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    if len(sys.argv) < 3:

        print(
            'Uso:\n'
            'python generar_svg.py '
            '"lotes_extraidos.json" '
            '"plano.dxf"'
        )

        sys.exit(1)

    archivo_json = sys.argv[1]
    archivo_dxf = sys.argv[2]

    try:

        generar_svg(
            archivo_json,
            archivo_dxf
        )

    except Exception as error:

        print()
        print("=" * 70)
        print("ERROR")
        print("=" * 70)

        print(error)

        sys.exit(1)