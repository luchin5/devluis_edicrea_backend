import sys
import json
import subprocess
from pathlib import Path
import re
import ezdxf
import os

# ============================================================
# CONFIGURACIÓN
# ============================================================

#ODA_EXE = r"C:\Program Files\ODA\ODAFileConverter 27.1.0\ODAFileConverter.exe"
ODA_EXE = os.getenv("ODA_EXE","/opt/oda/ODAFileConverter")
CAPA_LOTES = "C2_LOTE"


# ============================================================
# ODA
# ============================================================

def comprobar_oda():
    ruta = Path(ODA_EXE)

    if not ruta.exists():
        raise FileNotFoundError(
            f"No se encontró ODA File Converter:\n{ODA_EXE}"
        )

    print("[OK] ODA encontrado:")
    print(ODA_EXE)


def convertir_dwg_a_dxf(ruta_dwg):
    ruta_dwg = Path(ruta_dwg)

    if not ruta_dwg.exists():
        raise FileNotFoundError(
            f"No existe el archivo DWG:\n{ruta_dwg}"
        )

    # Carpeta donde está el DWG
    carpeta_entrada = ruta_dwg.parent

    # Creamos una carpeta de salida
    carpeta_salida = carpeta_entrada / "_dxf_convertido"
    carpeta_salida.mkdir(exist_ok=True)

    print()
    print("=" * 70)
    print("CONVERSIÓN DWG -> DXF")
    print("=" * 70)

    print(f"Entrada : {ruta_dwg}")
    print(f"Salida  : {carpeta_salida}")

    comando = [
        ODA_EXE,
        str(carpeta_entrada),
        str(carpeta_salida),
        "ACAD2018",
        "DXF",
        "0",
        "1",
        ruta_dwg.name,
    ]

    print()
    print("-> Ejecutando ODA File Converter...")

    resultado = subprocess.run(
        comando,
        capture_output=True,
        text=True,
        timeout=120,
    )

    print("Código de salida:", resultado.returncode)

    if resultado.stdout:
        print("STDOUT:")
        print(resultado.stdout)

    if resultado.stderr:
        print("STDERR:")
        print(resultado.stderr)

    if resultado.returncode != 0:
        raise RuntimeError(
            "ODA File Converter terminó con error."
        )

    # ODA conserva el nombre del archivo pero cambia extensión
    ruta_dxf = carpeta_salida / f"{ruta_dwg.stem}.dxf"

    if not ruta_dxf.exists():
        # Por si ODA genera mayúsculas
        posibles = list(carpeta_salida.glob("*.dxf"))

        if not posibles:
            posibles = list(carpeta_salida.glob("*.DXF"))

        if not posibles:
            raise FileNotFoundError(
                "ODA terminó correctamente, pero no se encontró "
                "el DXF generado."
            )

        ruta_dxf = posibles[0]

    print()
    print(" DXF generado:")
    print(ruta_dxf)

    return ruta_dxf


# ============================================================
# GEOMETRÍA
# ============================================================

def obtener_vertices(entidad):

    tipo = entidad.dxftype()

    if tipo == "LWPOLYLINE":

        return [
            [float(x), float(y)]
            for x, y in entidad.vertices()
        ]

    if tipo == "POLYLINE":

        return [
            [
                float(vertex.dxf.location.x),
                float(vertex.dxf.location.y),
            ]
            for vertex in entidad.vertices
        ]

    return []

def calcular_area(vertices):
    """
    Calcula el área de un polígono usando sus vértices
    mediante la fórmula de Gauss (Shoelace).
    """
    if len(vertices) < 3:
        return 0.0

    area = 0.0

    for i in range(len(vertices)):
        x1, y1 = vertices[i]
        x2, y2 = vertices[(i + 1) % len(vertices)]

        area += (x1 * y2) - (x2 * y1)

    return abs(area) / 2

# ============================================================
# CLASIFICACIÓN DE POLÍGONOS
# ============================================================

PALABRAS_ZONAS_ESPECIALES = [
    "RECREACION PUBLICA",
    "RECREACIÓN PUBLICA",
    "AREA VERDE",
    "ÁREA VERDE",
    "PARQUE",
    "RECREATIVA",
    "RECREATIVO",
    "EQUIPAMIENTO",
    "EDUCACION",
    "EDUCACIÓN",
    "COLEGIO",
    "ESCUELA",
    "SALUD",
    "POSTA",
    "COMERCIO",
    "MERCADO",
    "SERVICIO",
    "APORTE",
    "PARQUE ZONAL",
]


def limpiar_texto(texto):
    """
    Limpia códigos de formato de AutoCAD y normaliza el texto.
    """

    if not texto:
        return ""

    texto = str(texto)

    # Eliminar códigos de color de MTEXT
    texto = re.sub(r"\\C\d+;", "", texto)

    # Reemplazar saltos de línea de AutoCAD
    texto = texto.replace("^M^J", " ")
    texto = texto.replace("\\P", " ")

    # Normalizar espacios
    texto = re.sub(r"\s+", " ", texto)

    return texto.strip().upper()


def es_texto_zona_especial(texto):
    """
    Determina si un texto identifica una zona que no debe
    considerarse lote.
    """

    texto = limpiar_texto(texto)

    for palabra in PALABRAS_ZONAS_ESPECIALES:

        if palabra in texto:
            return True

    return False


def texto_indica_lote(texto):
    """
    Determina si un texto parece ser un identificador de lote.

    Ejemplos válidos:
        1
        2
        15
        108

    También acepta formatos como:
        LOTE 1
        LT 15
        MZ A LOTE 3
    """

    texto = limpiar_texto(texto)

    if not texto:
        return False

    # LOTE 15 / LT 15
    if re.search(r"\b(LOTE|LT)\s*[-:]?\s*\d+\b", texto):
        return True

    # Texto compuesto que contiene una palabra LOTE
    if "LOTE" in texto:
        return True

    # Número entero simple
    if re.fullmatch(r"\d{1,4}", texto):
        return True

    return False

def punto_dentro_poligono(x, y, vertices):
    """
    Determina si un punto está dentro de un polígono
    usando el algoritmo Ray Casting.
    """

    dentro = False

    cantidad = len(vertices)

    if cantidad < 3:
        return False

    j = cantidad - 1

    for i in range(cantidad):

        xi, yi = vertices[i]
        xj, yj = vertices[j]

        intersecta = (
            ((yi > y) != (yj > y))
            and
            (
                x
                <
                (xj - xi) * (y - yi) / (yj - yi) + xi
            )
        )

        if intersecta:
            dentro = not dentro

        j = i

    return dentro
# ============================================================
# ANALIZAR DXF
# ============================================================

def analizar_dxf(ruta_dxf,ruta_dwg):
    ruta_dwg = Path(ruta_dwg)

    print()
    print("=" * 70)
    print("ANÁLISIS DEL DXF")
    print("=" * 70)

    print(f"Archivo: {ruta_dxf}")

    print()
    print("-> Abriendo DXF con ezdxf...")

    doc = ezdxf.readfile(str(ruta_dxf))

    print("DXF cargado correctamente")
    print(f"Versión DXF: {doc.dxfversion}")

    msp = doc.modelspace()
    print()
    print("=" * 70)
    print("BUSCANDO TEXTOS DE EXCLUSIÓN")
    print("=" * 70)

    textos_exclusion = []
    textos_dibujo = []

    for entidad in msp:

        tipo = entidad.dxftype()

        texto = None

        if tipo == "MTEXT":
            texto = entidad.text

        elif tipo == "TEXT":
            texto = entidad.dxf.text

        if texto:
            posicion = entidad.dxf.insert

            textos_dibujo.append({
                "texto": texto,
                "x": float(posicion.x),
                "y": float(posicion.y),
            })

        if not texto:
            continue

        texto_limpio = re.sub(
            r"\\C\d+;",
            "",
            texto
        )

        texto_limpio = texto_limpio.replace(
            "^M^J",
            " "
        )

        texto_limpio = texto_limpio.upper()

        if "RECREACION PUBLICA" in texto_limpio:

            if tipo == "MTEXT":
                posicion = entidad.dxf.insert

            else:
                posicion = entidad.dxf.insert

            textos_exclusion.append({
                "texto": texto_limpio,
                "x": float(posicion.x),
                "y": float(posicion.y),
            })

            print(
                f"Texto de exclusión encontrado: "
                f"{texto_limpio}"
            )

            print(
                f"Posición: "
                f"X={posicion.x:.3f}, "
                f"Y={posicion.y:.3f}"
            )

    print()
    print(
        f"Textos de exclusión encontrados: "
        f"{len(textos_exclusion)}"
    )

    print()
    print("=" * 70)
    print(f"BUSCANDO CAPA: {CAPA_LOTES}")
    print("=" * 70)

    lotes = []

    for entidad in msp:

        if not hasattr(entidad.dxf, "layer"):
            continue

        capa = entidad.dxf.layer

        if capa.upper() != CAPA_LOTES.upper():
            continue

        tipo = entidad.dxftype()

        if tipo not in ("LWPOLYLINE", "POLYLINE"):
            continue

        # --------------------------------------------
        # Cerrada
        # --------------------------------------------

        if tipo == "LWPOLYLINE":

            cerrada = entidad.closed

        elif tipo == "POLYLINE":

            cerrada = (
                entidad.is_2d_polyline
                and entidad.is_closed
            )
        if not cerrada:
            continue
       

        # --------------------------------------------
        # Vértices
        # --------------------------------------------

        vertices = obtener_vertices(entidad)

        # --------------------------------------------
        # --------------------------------------------
        # Área calculada desde los vértices
        # --------------------------------------------

        area = calcular_area(vertices)
        
        # ========================================================
        # CLASIFICACIÓN DEL POLÍGONO
        # ========================================================

        textos_dentro = []

        for texto in textos_dibujo:
        
            if punto_dentro_poligono(
                texto["x"],
                texto["y"],
                vertices
            ):
                textos_dentro.append(texto)


        # --------------------------------------------------------
        # Buscar zona especial
        # --------------------------------------------------------

        texto_especial = None

        for texto in textos_dentro:
        
            texto_limpio = limpiar_texto(
                texto["texto"]
            )

            if es_texto_zona_especial(texto_limpio):
            
                texto_especial = texto_limpio
                break
            
            
        # --------------------------------------------------------
        # Buscar identificación de lote
        # --------------------------------------------------------

        identificador_lote = None

        for texto in textos_dentro:
        
            texto_limpio = limpiar_texto(
                texto["texto"]
            )

            if texto_indica_lote(texto_limpio):
            
                identificador_lote = texto_limpio
                break
            
            
        # --------------------------------------------------------
        # Clasificación final
        # --------------------------------------------------------

        if texto_especial:
        
            clasificacion = "ZONA_ESPECIAL"

        elif identificador_lote:
        
            clasificacion = "LOTE"

        else:
        
            clasificacion = "SIN_IDENTIFICAR"


        es_exclusion = (
            clasificacion == "ZONA_ESPECIAL"
        )

        texto_exclusion = texto_especial
        centro_x = sum(p[0] for p in vertices) / len(vertices)
        centro_y = sum(p[1] for p in vertices) / len(vertices)

        min_x = min(p[0] for p in vertices)
        max_x = max(p[0] for p in vertices)

        min_y = min(p[1] for p in vertices)
        max_y = max(p[1] for p in vertices)

        lote = {
            "handle": entidad.dxf.handle,
            "tipo": tipo,
            "capa": capa,

            "clasificacion": clasificacion,

            "identificador": identificador_lote,

            "es_exclusion": es_exclusion,

            "texto_exclusion": texto_exclusion,

            "textos_dentro": [
                limpiar_texto(texto["texto"])
                for texto in textos_dentro
            ],

            "cerrada": cerrada,

            "cantidad_vertices": len(vertices),

            "area": area,

            "centro": {
                "x": centro_x,
                "y": centro_y,
            },

            "bounds": {
                "min_x": min_x,
                "max_x": max_x,
                "min_y": min_y,
                "max_y": max_y,
            },

            "vertices": vertices,
        }

        lotes.append(lote)
        if es_exclusion:
            print()
            print(">>> POLÍGONO ESPECIAL DETECTADO")
            print(f"Handle: {entidad.dxf.handle}")
            print(f"Área: {area:.2f}")
            print(f"Motivo: {texto_exclusion}")

    # ========================================================
    # RESULTADO
    # ========================================================

    print()
    print("=" * 70)
    print("RESULTADO")
    print("=" * 70)

    print()
    print("=" * 70)
    print("ANÁLISIS DE ÁREAS")
    print("=" * 70)

    if lotes:

        areas_ordenadas = sorted(
            lotes,
            key=lambda lote: lote["area"],
            reverse=True
        )

        print()
        print("Mayores áreas encontradas:")

        for lote in areas_ordenadas[:10]:

            print(
                f"Handle={lote['handle']} "
                f"| Área={lote['area']:.2f} "
                f"| Vértices={lote['cantidad_vertices']}"
            )

    print()
    cantidad_lotes = sum(
        1
        for lote in lotes
        if lote["clasificacion"] == "LOTE"
    )

    cantidad_especiales = sum(
        1
        for lote in lotes
        if lote["clasificacion"] == "ZONA_ESPECIAL"
    )

    cantidad_sin_identificar = sum(
        1
        for lote in lotes
        if lote["clasificacion"] == "SIN_IDENTIFICAR"
    )

    print()
    print("CLASIFICACIÓN")
    print("=" * 70)

    print(f"Lotes: {cantidad_lotes}")
    print(f"Zonas especiales: {cantidad_especiales}")
    print(f"Sin identificar: {cantidad_sin_identificar}")
    print(f"Total polígonos: {len(lotes)}")

    for indice, lote in enumerate(lotes, start=1):

        print()
        print("-" * 70)

        print(f"Lote geométrico #{indice}")

        print(f"Handle: {lote['handle']}")
        print(f"Tipo: {lote['tipo']}")
        print(f"Capa: {lote['capa']}")
        print(
            f"Clasificación: {lote['clasificacion']}"
        )

        print(
            f"Identificador: {lote['identificador']}"
        )

        print(f"Cerrada: {lote['cerrada']}")
        print(f"Vértices: {lote['cantidad_vertices']}")
        print(f"Área CAD: {lote['area']}")

        if lote["vertices"]:

            print("Primeros vértices:")

            for punto in lote["vertices"][:5]:

                print(
                    f"    X={punto[0]:.3f}, "
                    f"Y={punto[1]:.3f}"
                )

    # ========================================================
    # JSON
    # ========================================================

    archivo_salida = ruta_dxf.with_name(
        f"{ruta_dwg.stem}_lotes_extraidos.json"
    )

    with open(
        archivo_salida,
        "w",
        encoding="utf-8"
    ) as archivo:

        json.dump(
            lotes,
            archivo,
            indent=2,
            ensure_ascii=False
        )

    print()
    print("=" * 70)
    print("JSON")
    print("=" * 70)

    print()
    print(f" JSON generado en:")
    print(archivo_salida)

    return lotes


# ============================================================
# PROCESO COMPLETO
# ============================================================

def procesar_dwg(ruta_dwg):

    comprobar_oda()

    ruta_dxf = convertir_dwg_a_dxf(
        ruta_dwg
    )

    lotes = analizar_dxf(
        ruta_dxf,
        ruta_dwg
    )

    return lotes


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    if len(sys.argv) < 2:

        print(
            "Uso:\n"
            'python demo.py "archivo.dwg"'
        )

        sys.exit(1)

    archivo_dwg = sys.argv[1]

    try:

        procesar_dwg(
            archivo_dwg
        )

    except Exception as error:

        print()
        print("=" * 70)
        print(" ERROR")
        print("=" * 70)

        print(error)

        sys.exit(1)