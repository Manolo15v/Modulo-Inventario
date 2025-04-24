# Sistema de Gestión de Inventario - Documentación para Windows

Este documento proporciona una guía completa para instalar, configurar y ejecutar el Sistema de Gestión de Inventario en un entorno Windows. También detalla la estructura de la aplicación, los endpoints de la API y el flujo de datos.

## Tabla de Contenidos

1.  [Requisitos del Sistema](#requisitos-del-sistema)
2.  [Instalación](#instalación)
    *   [Clonar el Repositorio](#clonar-el-repositorio)
    *   [Instalar Dependencias](#instalar-dependencias)
3.  [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
    *   [Crear la Base de Datos](#crear-la-base-de-datos)
    *   [Configurar las Credenciales](#configurar-las-credenciales)
    *   [Ejecutar Scripts SQL](#ejecutar-scripts-sql)
4.  [Ejecución del Proyecto](#ejecución-del-proyecto)
5.  [Estructura de Carpetas](#estructura-de-carpetas)
6.  [Endpoints de la API](#endpoints-de-la-api)
    *   [Almacenes](#almacenes)
    *   [Equipos](#equipos)
    *   [Modelos de Equipos](#modelos-de-equipos)
    *   [Instrumentos](#instrumentos)
    *   [Ubicaciones de Instrumentos](#ubicaciones-de-instrumentos)
    *   [Productos](#productos)
    *   [Modelos de Productos](#modelos-de-productos)
    *   [Ubicaciones de Productos](#ubicaciones-de-productos)
    *   [Repuestos](#repuestos)
7.  [Flujo de Datos y Gestión](#flujo-de-datos-y-gestión)
    * [Rutas](#rutas)
    * [Controladores](#controladores)
8. [Contribuciones](#contribuciones)

## Requisitos del Sistema

*   **Sistema Operativo:** Windows 10 o superior.
*   **Node.js:** Versión 16.x o superior.
*   **npm:** (Incluido con Node.js).
*   **MySQL:** Servidor de base de datos MySQL instalado y en ejecución.
* **Git:** Para clonar el repositorio.

## Instalación

### Clonar el Repositorio

1.  Abre la terminal o PowerShell en Windows.
2.  Navega al directorio donde deseas instalar el proyecto.
3.  Clona el repositorio usando Git:

<CODE_BLOCK>
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_REPOSITORIO>
</CODE_BLOCK>

### Instalar Dependencias

1.  Asegúrate de que estás en el directorio del proyecto (`<NOMBRE_DEL_REPOSITORIO>`).
2.  Ejecuta el siguiente comando para instalar las dependencias:

<CODE_BLOCK>
npm install
</CODE_BLOCK>

## Configuración de la Base de Datos

### Crear la Base de Datos

1.  Inicia el cliente de MySQL (por ejemplo, MySQL Workbench o la línea de comandos).
2.  Crea una nueva base de datos. Por defecto, el nombre configurado es `inventario_db`, pero puedes modificarlo si es necesario.

<CODE_BLOCK>
CREATE DATABASE inventario_db;
</CODE_BLOCK>

### Configurar las Credenciales

1.  Abre el archivo `src/config.js` en un editor de texto.
2.  Modifica las siguientes variables de entorno con los datos de tu base de datos:

<CODE_BLOCK>
export const PORT = process.env.PORT || 3000;
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
export const DB_DATABASE = process.env.DB_DATABASE || "inventario_db";
export const DB_PORT = process.env.DB_PORT || 3306;
</CODE_BLOCK>

*   **PORT:** Puerto en el que se ejecutará el servidor (por defecto, 3000).
*   **DB_HOST:** Dirección del servidor de la base de datos (por defecto, localhost).
*   **DB_USER:** Usuario de la base de datos (por defecto, root).
*   **DB_PASSWORD:** Contraseña del usuario de la base de datos.
*   **DB_DATABASE:** Nombre de la base de datos (por defecto, inventario_db).
*   **DB_PORT:** Puerto del servidor de base de datos (por defecto, 3306).
* Asegurate de tener un archivo .env en la raiz del proyecto con estas variables.

### Ejecutar Scripts SQL

1.  En la carpeta `src/database/` encontrarás los archivos `inventario.sql` y `crudinventario.sql`.
2.  Ejecuta estos scripts en la base de datos creada (`inventario_db`) para crear las tablas necesarias:

<CODE_BLOCK>
mysql -u <DB_USER> -p <DB_DATABASE> < src/database/inventario.sql
mysql -u <DB_USER> -p <DB_DATABASE> < src/database/crudinventario.sql
</CODE_BLOCK>

Reemplaza `<DB_USER>` y `<DB_DATABASE>` con tus credenciales.

## Ejecución del Proyecto

1.  Abre la terminal o PowerShell.
2.  Navega al directorio del proyecto.
3.  Ejecuta el siguiente comando:

<CODE_BLOCK>
npm start
</CODE_BLOCK>

O, para modo desarrollo y que se reinicie automaticamente con cada cambio en los archivos:
<CODE_BLOCK>
npm run dev
</CODE_BLOCK>

El servidor se iniciará en el puerto especificado en `src/config.js` (por defecto, `http://localhost:3000`).

## Estructura de Carpetas

La estructura de carpetas del proyecto es la siguiente:

<CODE_BLOCK>
./
├── public/             # Archivos estáticos (HTML, CSS)
│   ├── css/
│   ├── index.html
│   └── pages/          # Páginas HTML para diferentes secciones
├── src/                # Código fuente del backend
│   ├── Inventario/     # Módulo principal de inventario
│   │   ├── controllers/  # Lógica de negocio y manejo de solicitudes
│   │   └── routes/       # Definiciones de los endpoints de la API
│   ├── database/       # Scripts SQL para la configuración de la base de datos
│   ├── app.js          # Configuración de la aplicación Express
│   ├── config.js       # Configuraciones del proyecto
│   └── db.js           # Configuración de la base de datos
├── .vscode/            # Configuraciones de VS Code
├── package.json        # Metadatos del proyecto y dependencias
├── package-lock.json   # Versiones exactas de las dependencias
├── readme.md           # Documentación del proyecto (este archivo)
└── server.js         # Punto de entrada principal del servidor
</CODE_BLOCK>

## Endpoints de la API

La API está organizada bajo el prefijo `/api/inventario/`.

### Almacenes

*   **`GET /api/inventario/almacen`**
    *   Descripción: Obtiene todos los almacenes.
    *   Respuesta: Un array de objetos de almacén.
*   **`GET /api/inventario/almacen/:id`**
    *   Descripción: Obtiene un almacén por su ID.
    *   Parámetros:
        *   `id` (path param): ID del almacén.
    *   Respuesta: Un objeto de almacén.
*   **`GET /api/inventario/almacen/area/:area`**
    *   Descripción: Obtiene todos los almacenes en un área específica.
    *   Parámetros:
        *   `area` (path param): Área de los almacenes.
    *   Respuesta: Un array de objetos de almacén.
*   **`POST /api/inventario/almacen`**
    *   Descripción: Crea un nuevo almacén.
    *   Cuerpo de la petición: Un objeto de almacén.
    *   Respuesta: El objeto de almacén creado.
*   **`PUT /api/inventario/almacen/:id`**
    *   Descripción: Actualiza un almacén por su ID.
    *   Parámetros:
        *   `id` (path param): ID del almacén.
    *   Cuerpo de la petición: Un objeto de almacén.
    *   Respuesta: El objeto de almacén actualizado.
*   **`DELETE /api/inventario/almacen/:id`**
    *   Descripción: Elimina un almacén por su ID.
    *   Parámetros:
        *   `id` (path param): ID del almacén.
    *   Respuesta: Un mensaje de confirmación.

### Equipos

*   **`GET /api/inventario/equipos`**
    *   Descripción: Obtiene todos los equipos.
    *   Respuesta: Un array de objetos de equipo.
*   **`GET /api/inventario/equipos/:id`**
    *   Descripción: Obtiene un equipo por su ID de modelo.
    *   Parámetros:
        *   `id` (path param): ID del modelo.
    *   Respuesta: Un array de objetos equipo.
*   **`GET /api/inventario/equipos/modelo/:id`**
    *   Descripción: Obtiene un equipo por su ID.
    *   Parámetros:
        *   `id` (path param): ID del equipo.
    *   Respuesta: Un array de objetos equipo.
*   **`POST /api/inventario/equipos`**
    *   Descripción: Crea un nuevo equipo.
    *   Cuerpo de la petición: Un objeto de equipo.
    *   Respuesta: El objeto de equipo creado.
*   **`PUT /api/inventario/equipos/:id`**
    *   Descripción: Actualiza un equipo por su ID.
    *   Parámetros:
        *   `id` (path param): ID del equipo.
    *   Cuerpo de la petición: Un objeto de equipo.
    *   Respuesta: El objeto de equipo actualizado.
*   **`DELETE /api/inventario/equipos/:id`**
    *   Descripción: Elimina un equipo por su ID.
    *   Parámetros:
        *   `id` (path param): ID del equipo.
    *   Respuesta: Un mensaje de confirmación.

### Modelos de Equipos

*   **`GET /api/inventario/modeloEquipos`**
    *   Descripción: Obtiene todos los modelos de equipos.
    *   Respuesta: Un array de objetos de modelo de equipo.
*   **`GET /api/inventario/modeloEquipos/:id`**
    *   Descripción: Obtiene un modelo de equipo por su ID.
    *   Parámetros:
        *   `id` (path param): ID del modelo de equipo.
    *   Respuesta: Un objeto de modelo de equipo.
*   **`POST /api/inventario/modeloEquipos`**
    *   Descripción: Crea un nuevo modelo de equipo.
    *   Cuerpo de la petición: Un objeto de modelo de equipo.
    *   Respuesta: El objeto de modelo de equipo creado.
*   **`PUT /api/inventario/modeloEquipos/:id`**
    *   Descripción: Actualiza un modelo de equipo por su ID.
    *   Parámetros:
        *   `id` (path param): ID del modelo de equipo.
    *   Cuerpo de la petición: Un objeto de modelo de equipo.
    *   Respuesta: El objeto de modelo de equipo actualizado.
*   **`DELETE /api/inventario/modeloEquipos/:id`**
    *   Descripción: Elimina un modelo de equipo por su ID.
    *   Parámetros:
        *   `id` (path param): ID del modelo de equipo.
    *   Respuesta: Un mensaje de confirmación.

### Instrumentos

*   **`GET /api/inventario/instrumento`**
    *   Descripción: Obtiene todos los instrumentos.
*   **`GET /api/inventario/instrumento/:id`**
    *   Descripción: Obtiene un instrumento por ID.
*   **`POST /api/inventario/instrumento`**
    *   Descripción: Crea un nuevo instrumento.
*   **`PUT /api/inventario/instrumento/:id`**
    *   Descripción: Actualiza un instrumento por su ID.
*   **`DELETE /api/inventario/instrumento/:id`**
    *   Descripción: Elimina un instrumento por ID.

### Ubicaciones de Instrumentos

*   **`GET /api/inventario/instrumentoUbicacion`**
    *   Descripción: Obtiene todas las ubicaciones de instrumentos.
*   **`GET /api/inventario/instrumentoUbicacion/:id`**
    *   Descripción: Obtiene una ubicación de instrumento por ID.
*   **`POST /api/inventario/instrumentoUbicacion`**
    *   Descripción: Crea una nueva ubicación de instrumento.
*   **`PUT /api/inventario/instrumentoUbicacion/:id`**
    *   Descripción: Actualiza una ubicación de instrumento por su ID.
*   **`DELETE /api/inventario/instrumentoUbicacion/:id`**
    *   Descripción: Elimina una ubicación de instrumento por ID.

### Productos

*   **`GET /api/inventario/productos`**
    *   Descripción: Obtiene todos los productos.
*   **`GET /api/inventario/productos/:id`**
    *   Descripción: Obtiene un producto por ID.
*   **`POST /api/inventario/productos`**
    *   Descripción: Crea un nuevo producto.
*   **`PUT /api/inventario/productos/:id`**
    *   Descripción: Actualiza un producto por su ID.
*   **`DELETE /api/inventario/productos/:id`**
    *   Descripción: Elimina un producto por ID.

### Modelos de Productos

*   **`GET /api/inventario/modeloProductos`**
    *   Descripción: Obtiene todos los modelos de productos.
*   **`GET /api/inventario/modeloProductos/:id`**
    *   Descripción: Obtiene un modelo de producto por ID.
*   **`POST /api/inventario/modeloProductos`**
    *   Descripción: Crea un nuevo modelo de producto.
*   **`PUT /api/inventario/modeloProductos/:id`**
    *   Descripción: Actualiza un modelo de producto por su ID.
*   **`DELETE /api/inventario/modeloProductos/:id`**
    *   Descripción: Elimina un modelo de producto por ID.

### Ubicaciones de Productos

*   **`GET /api/inventario/productosUbicacion`**
    *   Descripción: Obtiene todas las ubicaciones de productos.
*   **`GET /api/inventario/productosUbicacion/:id`**
    *   Descripción: Obtiene una ubicación de producto por ID.
*   **`POST /api/inventario/productosUbicacion`**
    *   Descripción: Crea una nueva ubicación de producto.
*   **`PUT /api/inventario/productosUbicacion/:id`**
    *   Descripción: Actualiza una ubicación de producto por su ID.
*   **`DELETE /api/inventario/productosUbicacion/:id`**
    *   Descripción: Elimina una ubicación de producto por ID.

### Repuestos

*   **`GET /api/inventario/repuestos`**
    *   Descripción: Obtiene todos los repuestos.
*   **`GET /api/inventario/repuestos/:id`**
    *   Descripción: Obtiene un repuesto por ID.
*   **`POST /api/inventario/repuestos`**
    *   Descripción: Crea un nuevo repuesto.
*   **`PUT /api/inventario/repuestos/:id`**
    *   Descripción: Actualiza un repuesto por su ID.
*   **`DELETE /api/inventario/repuestos/:id`**
    *   Descripción: Elimina un repuesto por ID.

## Flujo de Datos y Gestión

### Rutas

Las rutas (`src/Inventario/routes/`) definen los endpoints de la API y se encargan de recibir las peticiones HTTP (GET, POST, PUT, DELETE). Cada archivo de ruta define un conjunto de endpoints para una entidad específica (almacenes, equipos, etc.).

Las rutas importan las funciones controladoras desde el directorio `src/Inventario/controllers/`.

### Controladores

Los controladores (`src/Inventario/controllers/`) contienen la lógica de negocio de la aplicación. Son responsables de:

1.  **Recibir la petición** desde la ruta.
2.  **Procesar la petición**: Validar datos, realizar operaciones.
3.  **Interactuar con la base de datos:** Realizar consultas y modificaciones a la base de datos.
4.  **Generar la respuesta**: Devolver la información solicitada o un mensaje de confirmación.

La comunicación entre las rutas y los controladores es directa: las rutas llaman a las funciones controladoras, y estas funciones ejecutan la lógica necesaria y responden a la solicitud.

## Contribuciones
Si deseas contribuir a este proyecto, sigue estos pasos:
1. Haz un fork del repositorio.
2. Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
3. Realiza los cambios necesarios y haz commit de ellos (git commit -m 'Agrega nueva funcionalidad').
4. Haz push a la rama (git push origin feature/nueva-funcionalidad).
5. Abre un pull request.

Este proyecto es de codigo abierto y las contribuciones son bienvenidas.