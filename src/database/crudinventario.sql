-- Consultas MySQL CRUD para Base de Datos de Inventario
-- Estas son algunas de las consustas utilizadas en la parte de Inventario\models donde cara archivo DAO.js se encarga de un CRUD en su tabla correspondiente

-- =========================================================
-- CRUD para Modelos_Productos
-- =========================================================

-- CREAR
INSERT INTO Modelos_Productos (Nombre, Descripcion, Codigo, Tipo_Producto, Tipo_Unidad, Unidades_Maximas, Unidades_Minimas)
VALUES ('Reactivo X', 'Reactivo para análisis de sangre', 'RX-001', 'Reactivo', 'ml', 500, 50);

-- LEER
-- Obtener todos los modelos de productos
SELECT * FROM Modelos_Productos;

-- Obtener un modelo de producto específico por ID
SELECT * FROM Modelos_Productos WHERE Id_Producto = 1;

-- Obtener modelos de productos por tipo
SELECT * FROM Modelos_Productos WHERE Tipo_Producto = 'Reactivo';

-- Obtener modelos de productos con bajo stock (por debajo del umbral mínimo)
SELECT * FROM Modelos_Productos WHERE Unidades_Maximas <= Unidades_Minimas;

-- ACTUALIZAR
UPDATE Modelos_Productos
SET Nombre = 'Reactivo XL', 
    Descripcion = 'Reactivo mejorado para análisis de sangre', 
    Unidades_Maximas = 1000
WHERE Id_Producto = 1;

-- ELIMINAR
DELETE FROM Modelos_Productos WHERE Id_Producto = 1;

-- =========================================================
-- CRUD para almacenes_ubicaciones
-- =========================================================

-- CREAR
INSERT INTO almacenes_ubicaciones (Area, Ubicacion)
VALUES ('Laboratorio', 'Estante 3-B');

-- LEER
-- Obtener todas las ubicaciones
SELECT * FROM almacenes_ubicaciones;

-- Obtener ubicaciones de un área específica
SELECT * FROM almacenes_ubicaciones WHERE Area = 'Laboratorio';

-- Obtener una ubicación específica por ID
SELECT * FROM almacenes_ubicaciones WHERE Id_Ubicacion = 1;

-- ACTUALIZAR
UPDATE almacenes_ubicaciones
SET Area = 'Laboratorio Central', 
    Ubicacion = 'Estante 5-C'
WHERE Id_Ubicacion = 1;

-- ELIMINAR
DELETE FROM almacenes_ubicaciones WHERE Id_Ubicacion = 1;

-- =========================================================
-- CRUD para Modelos_Equipos
-- =========================================================

-- CREAR
INSERT INTO Modelos_Equipos (Modelo, Nombre, Descripcion, Codigo, Marca, Unidades)
VALUES ('CEN-3000', 'Centrífuga Industrial', 'Centrífuga de alta velocidad para laboratorio', 'CEN3000', 'LabTech', 5);

-- LEER
-- Obtener todos los modelos de equipos
SELECT * FROM Modelos_Equipos;

-- Obtener modelo de equipo por ID
SELECT * FROM Modelos_Equipos WHERE Id_Modelo = 1;

-- Obtener modelos de equipos por marca
SELECT * FROM Modelos_Equipos WHERE Marca = 'LabTech';

-- Obtener modelos de equipos con pocas unidades
SELECT * FROM Modelos_Equipos WHERE Unidades < 3;

-- ACTUALIZAR
UPDATE Modelos_Equipos
SET Modelo = 'CEN-3500', 
    Nombre = 'Centrífuga Industrial Plus', 
    Unidades = 10
WHERE Id_Modelo = 1;

-- ELIMINAR
DELETE FROM Modelos_Equipos WHERE Id_Modelo = 1;

-- =========================================================
-- CRUD para Instrumentos
-- =========================================================

-- CREAR
INSERT INTO Instrumentos (Nombre, Descripcion, Tipo_Instrumento, Unidades, Unidades_Minimas, Unidades_Maximas)
VALUES ('Pipeta Digital', 'Pipeta de alta precisión para medición exacta', 'Medición', 20, 5, 50);

-- LEER
-- Obtener todos los instrumentos
SELECT * FROM Instrumentos;

-- Obtener un instrumento específico por ID
SELECT * FROM Instrumentos WHERE Id_Instrumento = 1;

-- Obtener instrumentos por tipo
SELECT * FROM Instrumentos WHERE Tipo_Instrumento = 'Medición';

-- Obtener instrumentos con bajo stock
SELECT * FROM Instrumentos WHERE Unidades <= Unidades_Minimas;

-- ACTUALIZAR
UPDATE Instrumentos
SET Nombre = 'Pipeta Digital Avanzada', 
    Unidades = 30, 
    Unidades_Maximas = 75
WHERE Id_Instrumento = 1;

-- ELIMINAR
DELETE FROM Instrumentos WHERE Id_Instrumento = 1;

-- =========================================================
-- CRUD para Productos
-- =========================================================

-- CREAR
INSERT INTO Productos (Id_modelo_productos, Unidades, Fecha_Vencimiento)
VALUES (1, 100, '2026-12-31');

-- LEER
-- Obtener todos los productos
SELECT * FROM Productos;

-- Obtener un producto específico por ID
SELECT * FROM Productos WHERE Id_Producto = 1;

-- Obtener productos por modelo
SELECT * FROM Productos WHERE Id_modelo_productos = 1;

-- Obtener productos próximos a vencer (dentro de 90 días)
SELECT * FROM Productos WHERE Fecha_Vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY);

-- Obtener información detallada de productos (uniendo con datos del modelo)
SELECT p.*, mp.Nombre, mp.Codigo, mp.Tipo_Producto
FROM Productos p
JOIN Modelos_Productos mp ON p.Id_modelo_productos = mp.Id_Producto;

-- ACTUALIZAR
UPDATE Productos
SET Unidades = 150, 
    Fecha_Vencimiento = '2027-06-30'
WHERE Id_Producto = 1;

-- ELIMINAR
DELETE FROM Productos WHERE Id_Producto = 1;

-- =========================================================
-- CRUD para Productos_Ubicacion
-- =========================================================

-- CREAR
INSERT INTO Productos_Ubicacion (Unidades_Por_Ubicacion, Id_Producto, Id_Ubicacion)
VALUES (50, 1, 1);

-- LEER
-- Obtener todas las asignaciones de ubicación de productos
SELECT * FROM Productos_Ubicacion;

-- Obtener asignaciones para un producto específico
SELECT * FROM Productos_Ubicacion WHERE Id_Producto = 1;

-- Obtener asignaciones para una ubicación específica
SELECT * FROM Productos_Ubicacion WHERE Id_Ubicacion = 1;

-- Obtener información detallada de ubicación de productos
SELECT pu.*, p.Fecha_Vencimiento, mp.Nombre AS Nombre_Producto, 
       a.Area, a.Ubicacion
FROM Productos_Ubicacion pu
JOIN Productos p ON pu.Id_Producto = p.Id_Producto
JOIN Modelos_Productos mp ON p.Id_modelo_productos = mp.Id_Producto
JOIN almacenes_ubicaciones a ON pu.Id_Ubicacion = a.Id_Ubicacion;

-- ACTUALIZAR
UPDATE Productos_Ubicacion
SET Unidades_Por_Ubicacion = 75
WHERE Id_Producto = 1 AND Id_Ubicacion = 1;

-- ELIMINAR
DELETE FROM Productos_Ubicacion WHERE Id_Producto = 1 AND Id_Ubicacion = 1;

-- =========================================================
-- CRUD para Instrumentos_Ubicacion
-- =========================================================

-- CREAR
INSERT INTO Instrumentos_Ubicacion (Unidades_Por_Ubicacion, Id_Instrumento, Id_Ubicacion)
VALUES (5, 1, 1);

-- LEER
-- Obtener todas las asignaciones de ubicación de instrumentos
SELECT * FROM Instrumentos_Ubicacion;

-- Obtener asignaciones para un instrumento específico
SELECT * FROM Instrumentos_Ubicacion WHERE Id_Instrumento = 1;

-- Obtener asignaciones para una ubicación específica
SELECT * FROM Instrumentos_Ubicacion WHERE Id_Ubicacion = 1;

-- Obtener información detallada de ubicación de instrumentos
SELECT iu.*, i.Nombre AS Nombre_Instrumento, i.Tipo_Instrumento,
       a.Area, a.Ubicacion
FROM Instrumentos_Ubicacion iu
JOIN Instrumentos i ON iu.Id_Instrumento = i.Id_Instrumento
JOIN almacenes_ubicaciones a ON iu.Id_Ubicacion = a.Id_Ubicacion;

-- ACTUALIZAR
UPDATE Instrumentos_Ubicacion
SET Unidades_Por_Ubicacion = 8
WHERE Id_Instrumento = 1 AND Id_Ubicacion = 1;

-- ELIMINAR
DELETE FROM Instrumentos_Ubicacion WHERE Id_Instrumento = 1 AND Id_Ubicacion = 1;

-- =========================================================
-- CRUD para Equipos
-- =========================================================

-- CREAR
INSERT INTO Equipos (Fecha_Instalacion, Estado, Frecuencia_mantenimiento, Numero_de_serie, Id_Modelo, Id_Ubicacion)
VALUES ('2025-03-15', 'Operativo', 'Trimestral', 'SN-CEN3000-12345', 1, 1);

-- LEER
-- Obtener todos los equipos
SELECT * FROM Equipos;

-- Obtener equipo por ID
SELECT * FROM Equipos WHERE Id_Equipo = 1;

-- Obtener equipos por estado
SELECT * FROM Equipos WHERE Estado = 'Operativo';

-- Obtener equipos por modelo
SELECT * FROM Equipos WHERE Id_Modelo = 1;

-- Obtener equipos por ubicación
SELECT * FROM Equipos WHERE Id_Ubicacion = 1;

-- Obtener información detallada de equipos
SELECT e.*, me.Modelo, me.Nombre AS Nombre_Modelo, me.Marca,
       a.Area, a.Ubicacion
FROM Equipos e
JOIN Modelos_Equipos me ON e.Id_Modelo = me.Id_Modelo
JOIN almacenes_ubicaciones a ON e.Id_Ubicacion = a.Id_Ubicacion;

-- Obtener equipos que requieren mantenimiento (suponiendo que el mantenimiento se almacena como representación de texto)
SELECT * FROM Equipos 
WHERE Frecuencia_mantenimiento = 'Mensual' 
AND DATEDIFF(CURDATE(), Fecha_Instalacion) % 30 < 7;

-- ACTUALIZAR
UPDATE Equipos
SET Estado = 'En mantenimiento', 
    Frecuencia_mantenimiento = 'Mensual'
WHERE Id_Equipo = 1;

-- ELIMINAR
DELETE FROM Equipos WHERE Id_Equipo = 1;

-- =========================================================
-- CRUD para Repuestos
-- =========================================================

-- CREAR
INSERT INTO Repuestos (Nombre, Descripcion, Numero_de_Pieza, Unidades, Unidades_Minimas, Unidades_Maximas, Id_Ubicacion)
VALUES ('Motor centrífuga', 'Motor de repuesto para centrífuga', 'MCF-123', 5, 2, 10, 1);

-- LEER
-- Obtener todos los repuestos
SELECT * FROM Repuestos;

-- Obtener un repuesto específico por ID
SELECT * FROM Repuestos WHERE Id_Repuesto = 1;

-- Obtener repuestos por ubicación
SELECT * FROM Repuestos WHERE Id_Ubicacion = 1;

-- Obtener repuestos con bajo stock
SELECT * FROM Repuestos WHERE Unidades <= Unidades_Minimas;

-- Obtener información detallada de repuestos
SELECT r.*, a.Area, a.Ubicacion
FROM Repuestos r
JOIN almacenes_ubicaciones a ON r.Id_Ubicacion = a.Id_Ubicacion;

-- ACTUALIZAR
UPDATE Repuestos
SET Nombre = 'Motor centrífuga avanzado', 
    Unidades = 8, 
    Unidades_Maximas = 15
WHERE Id_Repuesto = 1;

-- ELIMINAR
DELETE FROM Repuestos WHERE Id_Repuesto = 1;

-- =========================================================
-- Consultas Adicionales Útiles
-- =========================================================

-- Informe de Estado de Inventario (Artículos con Bajo Stock)
SELECT 'Modelo Producto' AS Tipo, mp.Id_Producto AS ID, mp.Nombre, mp.Codigo, 
       SUM(p.Unidades) AS Unidades_Totales, mp.Unidades_Minimas, mp.Unidades_Maximas
FROM Modelos_Productos mp
LEFT JOIN Productos p ON mp.Id_Producto = p.Id_modelo_productos
GROUP BY mp.Id_Producto
HAVING Unidades_Totales <= mp.Unidades_Minimas OR Unidades_Totales IS NULL

UNION

SELECT 'Instrumento' AS Tipo, i.Id_Instrumento AS ID, i.Nombre, '' AS Codigo, 
       i.Unidades AS Unidades_Totales, i.Unidades_Minimas, i.Unidades_Maximas
FROM Instrumentos i
WHERE i.Unidades <= i.Unidades_Minimas

UNION

SELECT 'Repuesto' AS Tipo, r.Id_Repuesto AS ID, r.Nombre, r.Numero_de_Pieza AS Codigo, 
       r.Unidades AS Unidades_Totales, r.Unidades_Minimas, r.Unidades_Maximas
FROM Repuestos r
WHERE r.Unidades <= r.Unidades_Minimas;

-- Informe de Inventario por Ubicación
SELECT a.Id_Ubicacion, a.Area, a.Ubicacion,
       COUNT(DISTINCT pu.Id_Producto) AS Productos,
       COUNT(DISTINCT iu.Id_Instrumento) AS Instrumentos,
       COUNT(DISTINCT e.Id_Equipo) AS Equipos,
       COUNT(DISTINCT r.Id_Repuesto) AS Repuestos
FROM almacenes_ubicaciones a
LEFT JOIN Productos_Ubicacion pu ON a.Id_Ubicacion = pu.Id_Ubicacion
LEFT JOIN Instrumentos_Ubicacion iu ON a.Id_Ubicacion = iu.Id_Ubicacion
LEFT JOIN Equipos e ON a.Id_Ubicacion = e.Id_Ubicacion
LEFT JOIN Repuestos r ON a.Id_Ubicacion = r.Id_Ubicacion
GROUP BY a.Id_Ubicacion;

-- Informe de Vencimientos
SELECT mp.Nombre AS Nombre_Producto, mp.Codigo, p.Unidades, 
       p.Fecha_Vencimiento, DATEDIFF(p.Fecha_Vencimiento, CURDATE()) AS Dias_Restantes,
       a.Area, a.Ubicacion
FROM Productos p
JOIN Modelos_Productos mp ON p.Id_modelo_productos = mp.Id_Producto
JOIN Productos_Ubicacion pu ON p.Id_Producto = pu.Id_Producto
JOIN almacenes_ubicaciones a ON pu.Id_Ubicacion = a.Id_Ubicacion
WHERE p.Fecha_Vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY)
ORDER BY p.Fecha_Vencimiento;