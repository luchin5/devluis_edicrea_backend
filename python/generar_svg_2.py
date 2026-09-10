import json
from pathlib import Path
import sys
import re
import ezdxf
import math

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


# ============================================================
# OBTENER MANZANAS DESDE EL DXF
# ============================================================

def obtener_manzanas(ruta_dxf, min_x, max_x, min_y, max_y):

    print()
    print("=" * 70)
    print("BUSCANDO MANZANAS EN EL DXF")
    print("=" * 70)

    doc = ezdxf.readfile(str(ruta_dxf))
    msp = doc.modelspace()

    manzanas_detectadas = []

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

        # Solo una letra:
        #
        # A
        # B
        # C
        # ...
        #
        if not re.fullmatch(r"[A-Z]", texto):

            continue

        posicion = entidad.dxf.insert

        x = float(posicion.x)
        y = float(posicion.y)

        manzana = {
            "letra": texto,
            "x": x,
            "y": y,
        }

        manzanas_detectadas.append(manzana)

    print()
    print(
        f"Letras detectadas inicialmente: "
        f"{len(manzanas_detectadas)}"
    )

    # ========================================================
    # FILTRAR LETRAS QUE REALMENTE PERTENECEN AL PLANO
    # ========================================================
    #
    # El DWG contiene también las letras de los cuadros
    # de resumen de AutoCAD.
    #
    # Por eso no debemos utilizar todas las letras encontradas.
    #
    # Utilizamos los límites reales de los lotes y permitimos
    # un pequeño margen alrededor del plano.
    # ========================================================

    ancho = max_x - min_x
    alto = max_y - min_y

    margen_filtro = max(ancho, alto) * 0.05

    limite_min_x = min_x - margen_filtro
    limite_max_x = max_x + margen_filtro

    limite_min_y = min_y - margen_filtro
    limite_max_y = max_y + margen_filtro

    manzanas = []

    for manzana in manzanas_detectadas:

        x = manzana["x"]
        y = manzana["y"]

        if (
            limite_min_x <= x <= limite_max_x
            and
            limite_min_y <= y <= limite_max_y
        ):

            manzanas.append(manzana)

            print(
                f"Manzana válida: {manzana['letra']} "
                f"| X={x:.3f} "
                f"| Y={y:.3f}"
            )

        else:

            print(
                f"Descartada: {manzana['letra']} "
                f"| X={x:.3f} "
                f"| Y={y:.3f} "
                f"(fuera del plano)"
            )

    # ========================================================
    # ELIMINAR DUPLICADOS POR LETRA
    # ========================================================
    #
    # Si existieran dos letras A dentro del área del plano,
    # conservamos la que esté más cerca del centro general.
    #
    # Normalmente no debería ocurrir, pero evita duplicados.
    # ========================================================

    manzanas_unicas = {}

    centro_plano_x = (min_x + max_x) / 2
    centro_plano_y = (min_y + max_y) / 2

    for manzana in manzanas:

        letra = manzana["letra"]

        distancia = (
            (manzana["x"] - centro_plano_x) ** 2
            +
            (manzana["y"] - centro_plano_y) ** 2
        )

        if letra not in manzanas_unicas:

            manzanas_unicas[letra] = (
                manzana,
                distancia
            )

        else:

            _, distancia_anterior = manzanas_unicas[letra]

            if distancia < distancia_anterior:

                manzanas_unicas[letra] = (
                    manzana,
                    distancia
                )

    manzanas = [
        valor[0]
        for valor in manzanas_unicas.values()
    ]

    # Orden alfabético
    manzanas.sort(
        key=lambda m: m["letra"]
    )

    print()
    print("=" * 70)
    print("MANZANAS UTILIZADAS")
    print("=" * 70)

    for manzana in manzanas:

        print(
            f"{manzana['letra']} "
            f"| X={manzana['x']:.3f} "
            f"| Y={manzana['y']:.3f}"
        )

    print()
    print(
        f"Total de manzanas utilizadas: "
        f"{len(manzanas)}"
    )

    return manzanas


# ============================================================
# BUSCAR MANZANA MÁS CERCANA
# ============================================================

def buscar_manzana_mas_cercana(
    centro_x,
    centro_y,
    manzanas
):
    """
    Asigna la manzana usando la posición espacial del lote.

    Las letras del plano representan referencias visuales de
    cada manzana. Se mantiene la asignación por proximidad
    como mecanismo de respaldo.
    """

    if not manzanas:
        return ""

    # --------------------------------------------------------
    # DISTANCIA AL CENTRO DE CADA MANZANA
    # --------------------------------------------------------

    candidatos = []

    for manzana in manzanas:

        distancia = math.sqrt(
            (centro_x - manzana["x"]) ** 2
            +
            (centro_y - manzana["y"]) ** 2
        )

        candidatos.append(
            (
                distancia,
                manzana["letra"]
            )
        )

    candidatos.sort(
        key=lambda x: x[0]
    )

    # --------------------------------------------------------
    # MANZANA MÁS CERCANA
    # --------------------------------------------------------

    return candidatos[0][1]


def cargar_poligonos_manzana(doc):
    """
    Obtiene los polígonos reales de las manzanas
    desde la capa C2_MANZANA.
    """

    poligonos = []

    for entity in doc.modelspace():

        if entity.dxftype() != "LWPOLYLINE":
            continue

        if entity.dxf.layer.upper() != "C2_MANZANA":
            continue

        puntos = [
            (p[0], p[1])
            for p in entity.get_points()
        ]

        if len(puntos) < 3:
            continue

        if puntos[0] != puntos[-1]:
            puntos.append(puntos[0])

        poligonos.append({
            "handle": entity.dxf.handle,
            "puntos": puntos
        })

    return poligonos

def punto_en_poligono(x, y, puntos):
    """
    Ray Casting.
    Determina si el punto está dentro del polígono.
    """

    dentro = False

    j = len(puntos) - 1

    for i in range(len(puntos)):

        xi, yi = puntos[i]
        xj, yj = puntos[j]

        intersecta = (
            ((yi > y) != (yj > y))
            and
            (
                x <
                (xj - xi) * (y - yi) /
                ((yj - yi) or 1e-12)
                + xi
            )
        )

        if intersecta:
            dentro = not dentro

        j = i

    return dentro

def asociar_manzanas(poligonos, manzanas):
    """
    Asocia cada polígono C2_MANZANA con la letra
    cuya etiqueta se encuentra dentro del polígono.
    """

    resultado = []

    for poligono in poligonos:

        letra_encontrada = None

        for manzana in manzanas:

            if punto_en_poligono(
                manzana["x"],
                manzana["y"],
                poligono["puntos"]
            ):
                letra_encontrada = manzana["letra"]
                break

        if letra_encontrada:

            resultado.append({
                "letra": letra_encontrada,
                "handle": poligono["handle"],
                "puntos": poligono["puntos"]
            })

    return resultado

def obtener_manzanas_geometricas(ruta_dxf, min_x, max_x, min_y, max_y):
    """
    Obtiene las letras de las manzanas y las asocia
    con los polígonos reales de C2_MANZANA.
    """

    doc = ezdxf.readfile(str(ruta_dxf))

    manzanas = obtener_manzanas(
        ruta_dxf,
        min_x,
        max_x,
        min_y,
        max_y
    )

    poligonos = cargar_poligonos_manzana(doc)

    print()
    print("=" * 70)
    print("ASOCIANDO POLÍGONOS DE MANZANA")
    print("=" * 70)

    resultado = asociar_manzanas(
        poligonos,
        manzanas
    )

    for m in resultado:
        print(
            f"Manzana {m['letra']} "
            f"| Handle={m['handle']} "
            f"| Vértices={len(m['puntos']) - 1}"
        )

    print()
    print(
        f"Polígonos de manzana asociados: "
        f"{len(resultado)}"
    )

    return resultado

def buscar_manzana_geometrica(
    centro_x,
    centro_y,
    manzanas_geometricas
):
    """
    Determina la manzana usando el polígono real
    de C2_MANZANA.
    """

    for manzana in manzanas_geometricas:

        if punto_en_poligono(
            centro_x,
            centro_y,
            manzana["puntos"]
        ):
            return manzana["letra"]

    return ""

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

    print(
        f"Archivo JSON: {ruta_json}"
    )

    print(
        f"Archivo DXF : {ruta_dxf}"
    )

    print(
        f"Lotes recibidos: {len(lotes)}"
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
    # OBTENER MANZANAS
    # ========================================================

    manzanas = obtener_manzanas(
        ruta_dxf,
        min_x,
        max_x,
        min_y,
        max_y
    )

    manzanas_geometricas = obtener_manzanas_geometricas(
        ruta_dxf,
        min_x,
        max_x,
        min_y,
        max_y
    )

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

        manzana = buscar_manzana_geometrica(
            centro_x,
            centro_y,
            manzanas_geometricas
        )


        # ====================================================
        # CONSTRUIR PATH SVG
        # ====================================================

        comandos_path = []

        for i, punto in enumerate(vertices):

            x = float(punto[0])
            y = float(punto[1])

            # CAD → SVG
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
        # PERÍMETRO DEL LOTE
        # ====================================================

        perimetro = 0.0

        for i in range(len(vertices)):
        
            p1 = vertices[i]
            p2 = vertices[(i + 1) % len(vertices)]

            x1 = float(p1[0])
            y1 = float(p1[1])

            x2 = float(p2[0])
            y2 = float(p2[1])

            distancia = (
                (x2 - x1) ** 2 +
                (y2 - y1) ** 2
            ) ** 0.5

            perimetro += distancia

        # ====================================================
        # TEXTO DEL ÁREA
        # ====================================================

        if area is not None:

            try:

                area_texto = (
                    f"{float(area):.2f} m²"
                )

            except (
                ValueError,
                TypeError
            ):

                area_texto = str(area)

        else:

            area_texto = ""

        # ====================================================
        # TAMAÑO DEL TEXTO DEL LOTE
        # ====================================================

        tamano_texto = (
            max(ancho, alto)
            * 0.012
        )

        # ====================================================
        # PATH DEL LOTE
        # ====================================================

        elementos.append(
            f'''
        <path
            id="{handle}"
            d="{path_d}"
            fill="#dbeafe"
            stroke="#2563eb"
            stroke-width="{max(ancho, alto) * 0.0015}"
            data-handle="{handle}"
            data-area="{area if area is not None else ''}"
            data-identificador="{identificador}"
            data-manzana="{manzana}"
            data-lote="{identificador}"
            data-perimetro="{perimetro:.2f}"
        />
        '''
        )

        # ====================================================
        # CENTRO DEL TEXTO
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

        # ====================================================
        # NÚMERO DEL LOTE
        # ====================================================

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

        ### aqui
        # ====================================================
        # MEDIDAS DE LOS LADOS DEL LOTE
        # ====================================================

        tamano_cota = max(ancho, alto) * 0.008
        
        for i in range(len(vertices)):

            p1 = vertices[i]
            p2 = vertices[(i + 1) % len(vertices)]

            x1 = float(p1[0])
            y1 = float(p1[1])

            x2 = float(p2[0])
            y2 = float(p2[1])

            # Distancia real del lado
            distancia = (
                (x2 - x1) ** 2 +
                (y2 - y1) ** 2
            ) ** 0.5
           
            texto_distancia = f"{distancia:.2f}"

            # Convertir puntos CAD -> SVG
            x1_svg = x1 - min_x + margen
            y1_svg = max_y - y1 + margen

            x2_svg = x2 - min_x + margen
            y2_svg = max_y - y2 + margen

            # Punto medio
            xm = (x1_svg + x2_svg) / 2
            ym = (y1_svg + y2_svg) / 2

            # Ángulo del lado
            

            angulo = math.degrees(
                math.atan2(
                    y2_svg - y1_svg,
                    x2_svg - x1_svg
                )
            )

            # Evitar texto completamente invertido
            if angulo > 90:
                angulo -= 180

            if angulo < -90:
                angulo += 180

            elementos.append(
                f'''
        <text
            x="{xm}"
            y="{ym}"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#111827"
            font-family="Arial, sans-serif"
            font-size="{tamano_cota}"
            transform="rotate({angulo} {xm} {ym})"
            pointer-events="none"
        >{texto_distancia}</text>
        '''
            )
        ###
        cantidad_generados += 1

    # ========================================================
    # LETRAS DE MANZANAS
    # ========================================================
    #
    # Se agregan DESPUÉS de los lotes para que sean visibles
    # sobre el plano, como referencia visual.
    #
    # No reciben eventos del mouse para no interferir con
    # la selección de lotes.
    # ========================================================

    print()
    print("=" * 70)
    print("DIBUJANDO LETRAS DE MANZANAS")
    print("=" * 70)

    # Más pequeño que antes.
    # 0.035 = 3.5% del tamaño mayor del plano.
    tamano_manzana = (
        max(ancho, alto)
        * 0.035
    )

    for manzana in manzanas:

        letra = manzana["letra"]

        x = manzana["x"]
        y = manzana["y"]

        # CAD → SVG
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

        elementos.append(
            f'''
        <text
            x="{x_svg}"
            y="{y_svg}"
            text-anchor="middle"
            dominant-baseline="middle"
            font-family="Arial, sans-serif"
            font-size="{tamano_manzana}"
            font-weight="bold"
            fill="#dc2626"
            fill-opacity="0.35"
            stroke="none"
            pointer-events="none"
            data-manzana="{letra}"
        >{letra}</text>
        '''
        )

        print(
            f"Manzana dibujada: {letra} "
            f"| X={x_svg:.2f} "
            f"| Y={y_svg:.2f}"
        )

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
            'python generar_svg_2.py '
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