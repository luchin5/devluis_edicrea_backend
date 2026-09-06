# ============================================================
# 1. IMAGEN BASE
# ============================================================

# Node.js 22 sobre Debian Bookworm.
# Usamos Debian en lugar de Alpine porque necesitaremos
# instalar Python y posteriormente ODA para Linux.
FROM node:22-bookworm


# ============================================================
# 2. DIRECTORIO DE TRABAJO
# ============================================================

# Todos los archivos de nuestra aplicación estarán aquí.
WORKDIR /app


# ============================================================
# 3. INSTALAR PYTHON
# ============================================================

# Instalamos Python 3 y pip.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        python3 \
        python3-pip \
    && rm -rf /var/lib/apt/lists/*


# ============================================================
# 4. DEPENDENCIAS DE NODE.JS
# ============================================================

# Copiamos primero los archivos de dependencias.
# Esto permite que Docker aproveche su caché.
COPY package*.json ./


# Instalamos exactamente las dependencias de package-lock.json.
RUN npm ci


# ============================================================
# 5. DEPENDENCIAS DE PYTHON
# ============================================================

# Copiamos el archivo de dependencias Python.
COPY python/requirements.txt ./python/requirements.txt


# Instalamos ezdxf y las demás dependencias Python.
RUN pip3 install --no-cache-dir \
    --break-system-packages \
    -r ./python/requirements.txt


# ============================================================
# 6. COPIAR EL CÓDIGO DE LA APLICACIÓN
# ============================================================

# Copiamos el resto del proyecto dentro del contenedor.
COPY . .


# ============================================================
# 7. CONFIGURACIÓN DE ODA
# ============================================================

# Ruta donde posteriormente instalaremos ODA File Converter.
ENV ODA_EXE=/opt/oda/ODAFileConverter


# ============================================================
# 8. CONFIGURACIÓN DE PYTHON
# ============================================================

# Node ejecutará Python 3 dentro del contenedor.
ENV PYTHON_COMMAND=python3


# ============================================================
# 9. PUERTO DE LA API
# ============================================================

EXPOSE 3000


# ============================================================
# 10. INICIAR BACKEND
# ============================================================

CMD ["node", "app.js"]