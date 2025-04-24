# Documentación de Endpoints del Sistema de Gestión de Inventario

Este documento proporciona una descripción completa de todos los endpoints disponibles en la API del sistema de gestión de inventario.

## 1. Almacenes (`/api/inventario/almacen`)

Esta ruta maneja las operaciones relacionadas con los almacenes.

*   **`GET /api/inventario/almacen`**
    *   **Descripción:** Obtiene todos los almacenes registrados.
    *   **Parámetros:** Ninguno.
    *   **Respuesta:** Retorna una lista de todos los almacenes.
    *   **Tipo de solicitud:** GET
    *   **Ejemplo de respuesta:**
    ``` json
    [
      {
        "id": 1,
        "nombre": "Almacén Principal",
        "area": "Zona A",
        "ubicacion": "Calle 1 #1-1"
      },
      {
        "id": 2,
        "nombre": "Almacén Secundario",
        "area": "Zona B",
        "ubicacion": "Calle 2 #2-2"
      }
    ]
    ```
*   **`GET /api/inventario/almacen/:id`**
    *   **Descripción:** Obtiene un almacén específico por su ID.
    *   **Parámetros:**
        *   `id` (obligatorio): ID del almacén a buscar.
    *   **Respuesta:** Retorna el almacén con el ID especificado.
    *   **Tipo de solicitud:** GET
    *   **Ejemplo de respuesta:**
    ``` json
    {
      "id": 1,
      "nombre": "Almacén Principal",
      "area": "Zona A",
      "ubicacion": "Calle 1 #1-1"
    }
    ```

*   **`GET /api/inventario/almacen/area/:area`**
    *   **Descripción:** Obtiene todos los almacenes que pertenecen a un área específica.
    *   **Parámetros:**
        *   `area` (obligatorio): Área de los almacenes a buscar.
    *   **Respuesta:** Retorna una lista de almacenes que pertenecen al área especificada.
    *   **Tipo de solicitud:** GET
    *   **Ejemplo de respuesta:**
    ``` json
    [
      {
        "id": 1,
        "nombre": "Almacén Principal",
        "area": "Zona A",
        "ubicacion": "Calle 1 #1-1"
      }
    ]
    ``` json

*   **`POST /api/inventario/almacen`**
    *   **Descripción:** Crea un nuevo almacén.
    *   **Parámetros:**
        *   `nombre` (obligatorio): Nombre del almacén.
        *   `area` (obligatorio): Área del almacén.
        * `ubicacion` (obligatorio): ubicacion del almacen
    *   **Respuesta:** Retorna el almacén creado.
    *   **Tipo de solicitud:** POST
    *   **Ejemplo de solicitud:**
    ``` json
    {
      "nombre": "Nuevo Almacén",
      "area": "Zona C",
      "ubicacion": "calle 3 #3-3"
    }
    ``` 

*   **`PUT /api/inventario/almacen/:id`**
    *   **Descripción:** Actualiza la información de un almacén existente.
    *   **Parámetros:**
        *   `id` (obligatorio): ID del almacén a actualizar.
        *   `nombre` (opcional): Nuevo nombre del almacén.
        *   `area` (opcional): Nueva área del almacén.
        * `ubicacion` (opcional): Nueva ubicacion del almacen
    *   **Respuesta:** Retorna el almacén actualizado.
    *   **Tipo de solicitud:** PUT
    *   **Ejemplo de solicitud:**
    ``` json
    {
      "nombre": "Almacén Actualizado",
      "area": "Zona D",
      "ubicacion": "calle 4 #4-4"
    }
    ``` 

*   **`DELETE /api/inventario/almacen/:id`**
    *   **Descripción:** Elimina un almacén específico por su ID.
    *   **Parámetros:**
        *   `id` (obligatorio): ID del almacén a eliminar.
    *   **Respuesta:** Retorna un mensaje de confirmación de eliminación.
    *   **Tipo de solicitud:** DELETE
    *   **Ejemplo de respuesta:**
    ``` json
    {
      "message": "Almacén eliminado correctamente"
    }
    ``` 

## 2. Equipos (`/api/inventario/equipos`)

Esta ruta maneja las operaciones relacionadas con los equipos.

*   **`GET /api/inventario/equipos`**
    *   **Descripción:** Obtiene todos los equipos registrados.
    *   **Parámetros:** Ninguno.
    *   **Respuesta:** Retorna una lista de todos los equipos.
    *   **Tipo de solicitud:** GET
    *   **Ejemplo de respuesta:**
    ``` json
    [
        {
            "id": 1,
            "modeloId": 1,
            "nSerie": "N12345"
        },
        {
            "id": 2,
            "modeloId": 2,
            "nSerie": "N67890"
        }
    ]
    ```

*   **`GET /api/inventario/equipos/:id`**
    *   **Descripción:** Obtiene un equipo específico por su ID de modelo.
    *   **Parámetros:**
        *   `id` (obligatorio): ID del modelo del equipo a buscar.
    *   **Respuesta:** Retorna el equipo con el ID de modelo especificado.
    *   **Tipo de solicitud:** GET
    *   **Ejemplo de respuesta:**
    ``` json
    {
        "id": 1,
        "modeloId": 1,
        "nSerie": "N12345"
    }
    ```

*   **`GET /api/inventario/equipos/modelo/:id`**
    *   **Descripción:** Obtiene un equipo específico por su ID.
    *   **Parámetros:**
        *   `id` (obligatorio): ID del equipo a buscar.
    *   **Respuesta:** Retorna el equipo con el ID especificado.
    *   **Tipo de solicitud:** GET
    *   **Ejemplo de respuesta:**
    ``` json
    {
        "id": 1,
        "modeloId": 1,
        "nSerie": "N12345"
    }
    ```

*   **`POST /api/inventario/equipos`**
    *   **Descripción:** Crea un nuevo equipo.
    *   **Parámetros:**
        *   `modeloId` (obligatorio): ID del modelo del equipo.
        *   `nSerie` (obligatorio): Numero de serie del equipo.
    *   **Respuesta:** Retorna el equipo creado.
    *   **Tipo de solicitud:** POST
    *   **Ejemplo de solicitud:**
    ``` json
    {
        "modeloId": 2,
        "nSerie": "N98765"
    }
    ```

*   **`PUT /api/inventario/equipos/:id`**
    *   **Descripción:** Actualiza la información de un equipo existente.
    *   **Parámetros:**
        *   `id` (obligatorio): ID del equipo a actualizar.
        *   `modeloId` (opcional): Nuevo ID del modelo del equipo.
        *   `nSerie` (opcional): Nuevo numero de serie del equipo.
    *   **Respuesta:** Retorna el equipo actualizado.
    *   **Tipo de solicitud:** PUT
    *   **Ejemplo de solicitud:**
    ``` json
    {
        "modeloId": 3,
        "nSerie": "N54321"
    }
    ```

*   **`DELETE /api/inventario/equipos/:id`**
    *   **Descripción:** Elimina un equipo específico por su ID.
    *   **Parámetros:**
        *   `id` (obligatorio): ID del equipo a eliminar.
    *   **Respuesta:** Retorna un mensaje de confirmación de eliminación.
    *   **Tipo de solicitud:** DELETE
    *   **Ejemplo de respuesta:**
    ``` json
    {
      "message": "Equipo eliminado correctamente"
    }
    ```

## 3. Modelos de Equipos (`/api/inventario/modeloEquipos`)

Esta ruta maneja las operaciones relacionadas con los modelos de equipos.

*   **`GET /api/inventario/modeloEquipos`**
    *   **Descripción:** Obtiene todos los modelos de equipos registrados.
    *   **Parámetros:** Ninguno.
    *   **Respuesta:** Retorna una lista de todos los modelos de equipos.
    *   **Tipo de solicitud:** GET
    *   **Ejemplo de respuesta:**
    ``` json
    [
      {
        "id": 1,
        "nombre": "Modelo A",
        "descripcion": "Modelo de equipo A"
      },
      {
        "id": 2,
        "nombre": "Modelo B",
        "descripcion": "Modelo de equipo B"
      }
    ]
    ```
*   **`GET /api/inventario/modeloEquipos/:id`**
    *   **Descripción:** Obtiene un modelo de equipo específico por su ID.
    *   **Parámetros:**
        *   `id` (obligatorio): ID del modelo de equipo a buscar.
    *   **Respuesta:** Retorna el modelo de equipo con el ID especificado.
    *   **Tipo de solicitud:** GET
    *   **Ejemplo de respuesta:**
    ``` json
    {
      "id": 1,
      "nombre": "Modelo A",
      "descripcion": "Modelo de equipo A"
    }
    ```

*   **`POST /api/inventario/modeloEquipos`**
    *   **Descripción:** Crea un nuevo modelo de equipo.
    *   **Parámetros:**
        *   `nombre` (obligatorio): Nombre del modelo de equipo.
        *   `descripcion` (obligatorio): Descripción del modelo de equipo.
    *   **Respuesta:** Retorna el modelo de equipo creado.
    *   **Tipo de solicitud:** POST
    *   **Ejemplo de solicitud:**
    ``` json
    {
      "nombre": "Modelo C",
      "descripcion": "Modelo de equipo C"
    }
    ```

*   **`PUT /api/inventario/modeloEquipos/:id`**
    *   **Descripción:** Actualiza la información de un modelo de equipo existente.
    *   **Parámetros:**
        *   `id` (obligatorio): ID del modelo de equipo a actualizar.
        *   `nombre` (opcional): Nuevo nombre del modelo de equipo.
        *   `descripcion` (opcional): Nueva descripción del modelo de equipo.
    *   **Respuesta:** Retorna el modelo de equipo actualizado.
    *   **Tipo de solicitud:** PUT
    *   **Ejemplo de solicitud:**
    ``` json
    {
      "nombre": "Modelo A Actualizado",
      "descripcion": "Modelo de equipo A con nueva descripción"
    }
    ```

*   **`DELETE /api/inventario/modeloEquipos/:id`**
    *   **Descripción:** Elimina un modelo de equipo específico por su ID.
    *   **Parámetros:**
        *   `id` (obligatorio): ID del modelo de equipo a eliminar.
    *   **Respuesta:** Retorna un mensaje de confirmación de eliminación.
    *   **Tipo de solicitud:** DELETE
    *   **Ejemplo de respuesta:**
    ``` json
    {
      "message": "Modelo de equipo eliminado correctamente"
    }
    ```

## 4. Instrumentos (`/api/inventario/instrumento`)

*   **`GET /api/inventario/instrumento`**
*   **`GET /api/inventario/instrumento/:id`**
*   **`POST /api/inventario/instrumento`**
*   **`PUT /api/inventario/instrumento/:id`**
*   **`DELETE /api/inventario/instrumento/:id`**

## 5. Ubicaciones de Instrumentos (`/api/inventario/instrumentoUbicacion`)

*   **`GET /api/inventario/instrumentoUbicacion`**
*   **`GET /api/inventario/instrumentoUbicacion/:id`**
*   **`POST /api/inventario/instrumentoUbicacion`**
*   **`PUT /api/inventario/instrumentoUbicacion/:id`**
*   **`DELETE /api/inventario/instrumentoUbicacion/:id`**

## 6. Productos (`/api/inventario/productos`)

*   **`GET /api/inventario/productos`**
*   **`GET /api/inventario/productos/:id`**
*   **`POST /api/inventario/productos`**
*   **`PUT /api/inventario/productos/:id`**
*   **`DELETE /api/inventario/productos/:id`**

## 7. Modelos de Productos (`/api/inventario/modeloProductos`)

*   **`GET /api/inventario/modeloProductos`**
*   **`GET /api/inventario/modeloProductos/:id`**
*   **`POST /api/inventario/modeloProductos`**
*   **`PUT /api/inventario/modeloProductos/:id`**
*   **`DELETE /api/inventario/modeloProductos/:id`**

## 8. Ubicaciones de Productos (`/api/inventario/productosUbicacion`)

*   **`GET /api/inventario/productosUbicacion`**
*   **`GET /api/inventario/productosUbicacion/:id`**
*   **`POST /api/inventario/productosUbicacion`**
*   **`PUT /api/inventario/productosUbicacion/:id`**
*   **`DELETE /api/inventario/productosUbicacion/:id`**

## 9. Repuestos (`/api/inventario/repuestos`)

*   **`GET /api/inventario/repuestos`**
*   **`GET /api/inventario/repuestos/:id`**
*   **`POST /api/inventario/repuestos`**
*   **`PUT /api/inventario/repuestos/:id`**
*   **`DELETE /api/inventario/repuestos/:id`**

## Como funciona el proyecto

1.  **Solicitud del Cliente:** El cliente (frontend o cualquier otra aplicación) realiza una solicitud HTTP a un endpoint específico de la API.
2.  **Ruta (Routes):** La solicitud llega a la ruta correspondiente en `src/Inventario/routes/`.
3.  **Controlador (Controller):** La ruta llama a la función controladora adecuada en `src/Inventario/controllers/`.
4.  **Lógica de Negocio:** El controlador procesa la solicitud, interactúa con la base de datos a través de consultas SQL (en `src/database/`), y realiza la lógica de negocio necesaria.
5.  **Respuesta:** El controlador genera una respuesta (datos o mensajes) y la envía de vuelta al cliente a través de la ruta.

## Flujo de Datos

#### Ejemplos

*   **Crear un Almacén:**
    1.  El cliente envía una solicitud `POST` a `/api/inventario/almacen` con los datos del nuevo almacén.
    2.  La ruta `/api/inventario/almacen` recibe la solicitud y llama a la función `create` en `almacen.controller.js`.
    3.  `create` en `almacen.controller.js` realiza una consulta `INSERT` en la base de datos para crear el nuevo almacén.
    4.  El controlador recibe el resultado de la consulta y envía una respuesta al cliente con el nuevo almacén creado.

*   **Obtener Todos los Equipos:**
    1.  El cliente envía una solicitud `GET` a `/api/inventario/equipos`.
    2.  La ruta `/api/inventario/equipos` recibe la solicitud y llama a la función `getAllEquipos` en `equipos.controller.js`.
    3.  `getAllEquipos` en `equipos.controller.js` realiza una consulta `SELECT` en la base de datos para obtener todos los equipos.
    4.  El controlador recibe el resultado de la consulta y envía una lista de todos los equipos al cliente.

## Notas Adicionales

*   Los endpoints para `/instrumento`, `/instrumentoUbicacion`, `/productos`, `/modeloProductos`, `/productosUbicacion`, y `/repuestos` siguen una estructura similar a los endpoints de Almacenes, Equipos y ModeloEquipos, con operaciones `GET`, `POST`, `PUT`, y `DELETE`.
*   El archivo `server.js` inicia el servidor y configura la aplicación Express.
*   El archivo `src/app.js` configura los middlewares (CORS, Morgan, JSON) y define las rutas principales.
*   El archivo `src/config.js` maneja las variables de entorno (puerto, credenciales de la base de datos).
