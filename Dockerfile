# Imagen base: Node.js 22 + Debian Bookworm
FROM node:22-bookworm

# Directorio de trabajo de la aplicación
WORKDIR /app

# Instalar Python 3 y pip
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        python3 \
        python3-pip \
        libgl1 \
        libxkbcommon0 \
        libxkbcommon-x11-0 \
        libxcb-xinerama0 \
        libxcb-icccm4 \
        libxcb-image0 \
        libxcb-keysyms1 \
        libxcb-render-util0 \
        libxcb-shape0 \
        libxcb-xkb1 \
        xvfb \
    && rm -rf /var/lib/apt/lists/*

# Copiar dependencias de Node
COPY package*.json ./

# Instalar dependencias de Node
RUN npm ci

# Copiar dependencias de Python
COPY python/requirements.txt ./python/requirements.txt

# Instalar dependencias Python
RUN pip3 install \
    --no-cache-dir \
    --break-system-packages \
    -r ./python/requirements.txt

# Crear directorio para ODA
RUN mkdir -p /opt/oda

# Copiar instalador ODA
COPY ODAFileConverter_QT6_lnxX64_8.3dll_27.1.deb /tmp/oda.deb

# Instalar ODA y limpiar instalador
RUN apt-get update \
    && apt-get install -y /tmp/oda.deb \
    && rm /tmp/oda.deb \
    && rm -rf /var/lib/apt/lists/*

# Copiar el código del backend
COPY . .

# Ruta del ejecutable ODA
ENV ODA_EXE=/usr/bin/ODAFileConverter
ENV PYTHON_COMMAND=python3
ENV DISPLAY=:99
ENV XDG_RUNTIME_DIR=/tmp/runtime-root

RUN mkdir -p /tmp/runtime-root \
    && chmod 700 /tmp/runtime-root

EXPOSE 3000

CMD ["sh", "-c", "Xvfb :99 -screen 0 1024x768x24 >/tmp/xvfb.log 2>&1 & sleep 1; exec node app.js"]