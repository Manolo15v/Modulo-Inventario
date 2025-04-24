// Variables globales
let productos = [];
let modelosProductos = [];
let ubicaciones = [];
let productosUbicacion = [];
let currentProductoId = null;
let currentUbicacionProductoId = null;
let currentUbicacionUbicacionId = null;

const apiUrlProducto = '/api/inventario/productos';
const apiUrlModelo = '/api/inventario/modeloProductos'; // Asumimos que existe esta API para modelos
const apiUrlUbicacion = '/api/inventario/almacen'; // Reutilizamos la API de almacén para ubicaciones
const apiUrlProductoUbicacion = '/api/inventario/productosUbicacion';

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', async function() {
    await loadModelosProductos();
    await loadProductos();
    await loadAllUbicaciones();
});

// Función para cargar los modelos de productos
async function loadModelosProductos() {
    try {
        const response = await fetch(apiUrlModelo);
        if (!response.ok) {
            throw new Error('Error al cargar los modelos de productos');
        }
        modelosProductos = await response.json();
        
        // Si la respuesta es un objeto único, convertirlo en array
        if (!Array.isArray(modelosProductos)) {
            modelosProductos = [modelosProductos];
        }
        
        populateModelosSelect();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar los modelos de productos. Usando datos de ejemplo.', 'danger');
        

        populateModelosSelect();
    }
}

// Función para cargar todas las ubicaciones
async function loadAllUbicaciones() {
    try {
        const response = await fetch(apiUrlUbicacion);
        if (!response.ok) {
            throw new Error('Error al cargar las ubicaciones');
        }
        ubicaciones = await response.json();
        
        // Si la respuesta es un objeto único, convertirlo en array
        if (!Array.isArray(ubicaciones)) {
            ubicaciones = [ubicaciones];
        }
        
        populateUbicacionesSelect();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar las ubicaciones', 'danger');
        
        populateUbicacionesSelect();
    }
}

// Función para cargar los productos desde la API
async function loadProductos() {
    try {
        const response = await fetch(apiUrlProducto);
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        productos = await response.json();
        
        // Si la respuesta es un objeto único, convertirlo en array
        if (!Array.isArray(productos)) {
            productos = [productos];
        }
        
        renderProductos(productos);
        populateProductosSelect();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar los datos. No hay productos disponibles.', 'danger');
        
        // Dejar productos como un array vacío
        productos = [];
        renderProductos(productos);
    }
}

// Función para cargar los productos por ubicación
async function loadProductosUbicacion() {
    try {
        const response = await fetch(apiUrlProductoUbicacion);
        if (!response.ok) {
            throw new Error('Error al cargar los datos de productos por ubicación');
        }
        productosUbicacion = await response.json();
        
        // Si la respuesta es un objeto único, convertirlo en array
        if (!Array.isArray(productosUbicacion)) {
            productosUbicacion = [productosUbicacion];
        }
        
        renderProductosUbicacion(productosUbicacion);
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar los datos de productos por ubicación. No hay datos disponibles.', 'danger');
        
        // Dejar productosUbicacion como un array vacío
        productosUbicacion = [];
        renderProductosUbicacion(productosUbicacion);
    }
}

// Función para llenar el select de modelos
function populateModelosSelect() {
    const select = document.getElementById('modeloSelect');
    // Limpiar opciones existentes excepto la primera
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Añadir los modelos al select
    modelosProductos.forEach(modelo => {
        const option = document.createElement('option');
        option.value = modelo.Id_modelo_productos;
        option.textContent = `${modelo.Nombre} (${modelo.Tipo_Producto})`;
        select.appendChild(option);
    });
}

// Función para llenar el select de productos
function populateProductosSelect() {
    const select = document.getElementById('productoSelect');
    // Limpiar opciones existentes excepto la primera
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Añadir los productos al select
    productos.forEach(producto => {
        const fechaVencimiento = new Date(producto.Fecha_Vencimiento);
        const fechaFormateada = fechaVencimiento.toISOString().split('T')[0];

        const option = document.createElement('option');
        option.value = producto.Id_Producto;
        option.textContent = `${producto.Nombre} (${fechaFormateada})`;
        select.appendChild(option);
    });
}

// Función para llenar el select de ubicaciones
function populateUbicacionesSelect() {
    const select = document.getElementById('ubicacionSelect');
    // Limpiar opciones existentes excepto la primera
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Añadir las ubicaciones al select
    ubicaciones.forEach(ubicacion => {
        const option = document.createElement('option');
        option.value = ubicacion.Id_Ubicacion;
        option.textContent = `${ubicacion.Area} - ${ubicacion.Ubicacion}`;
        select.appendChild(option);
    });
}

// Función para renderizar los productos en la tabla
function renderProductos(data) {
    const tableBody = document.getElementById('productosTableBody');
    tableBody.innerHTML = '';

    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" class="empty-message">No hay productos disponibles</td>
        `;
        tableBody.appendChild(row);
        return;
    }
    
    data.forEach(producto => {
        // Encontrar el modelo correspondiente
        const modelo = modelosProductos.find(m => m.Id_modelo_productos === producto.Id_modelo_productos) || { Nombre: 'Desconocido', Tipo: 'Desconocido' };
        
        // Formatear la fecha de vencimiento
        const fechaVencimiento = new Date(producto.Fecha_Vencimiento);
        const fechaFormateada = fechaVencimiento.toISOString().split('T')[0];
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.Nombre}</td>
            <td>${producto.Tipo_Producto}</td>
            <td>${fechaFormateada}</td>
            <td>${producto.Unidades}</td>
            <td>
                <div class="action-btn view-btn" onclick="viewProducto(${producto.Id_Producto})" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="action-btn edit-btn" onclick="editProducto(${producto.Id_Producto})" title="Editar">
                    <i class="fas fa-edit"></i>
                </div>
                <div class="action-btn delete-btn" onclick="deleteProducto(${producto.Id_Producto})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para renderizar los productos por ubicación en la tabla
function renderProductosUbicacion(data) {
    const tableBody = document.getElementById('ubicacionesTableBody');
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" class="empty-message">No hay asignaciones de productos disponibles</td>
        `;
        tableBody.appendChild(row);
        return;
    }
    
    data.forEach(item => {
        
        // Encontrar el producto y su modelo correspondiente
        const producto = productos.find(p => p.Id_Producto === item.Id_Producto) || { Id_modelo_productos: null };
        const modelo = modelosProductos.find(m => m.Id_modelo_productos === producto.Id_modelo_productos) || { Nombre: 'Desconocido', Tipo: 'Desconocido' };
        
        // Encontrar la ubicación correspondiente
        const ubicacion = ubicaciones.find(u => u.Id_Ubicacion === item.Id_Ubicacion) || { Area: 'Desconocida', Ubicacion: 'Desconocida' };

        const fechaVencimiento = new Date(item.Fecha_Vencimiento);
        const fechaFormateada = fechaVencimiento.toISOString().split('T')[0];

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.Nombre_Producto}</td>
            <td>${fechaFormateada}</td>
            <td>${ubicacion.Area}</td>
            <td>${ubicacion.Ubicacion}</td>
            <td>${item.Unidades_Por_Ubicacion}</td>
            <td>
                <div class="action-btn view-btn" onclick="viewProductoUbicacion(${item.Id_Producto}, ${item.Id_Ubicacion})" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="action-btn edit-btn" onclick="editProductoUbicacion(${item.Id_Producto}, ${item.Id_Ubicacion})" title="Editar">
                    <i class="fas fa-edit"></i>
                </div>
                <div class="action-btn delete-btn" onclick="deleteProductoUbicacion(${item.Id_Producto}, ${item.Id_Ubicacion})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para buscar productos
function searchProductos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Filtrar productos basados en el modelo (nombre y tipo)
    const filteredProductos = productos.filter(producto => {

        return (
            (producto.Nombre?.toLowerCase() || '').includes(searchTerm) ||
            (producto.Fecha_Vencimiento?.toLowerCase() || '').includes(searchTerm) ||
            (producto.Tipo_Producto?.toLowerCase() || '').includes(searchTerm) ||
            (producto.Codigo?.toLowerCase() || '').includes(searchTerm)
        );
    });
    
    renderProductos(filteredProductos);
}

// Función para buscar productos por ubicación
function searchProductosUbicacion() {
    const searchTerm = document.getElementById('searchUbicacionInput').value.toLowerCase();
    
    // Filtrar productos por ubicación
    const filteredProductosUbicacion = productosUbicacion.filter(producto => {
        return (
            (producto.Fecha_Vencimiento?.toLowerCase() || '').includes(searchTerm) ||
            (producto.Nombre_Producto?.toLowerCase() || '').includes(searchTerm) ||
            (producto.Area?.toLowerCase() || '').includes(searchTerm) ||
            (producto.Ubicacion?.toLowerCase() || '').includes(searchTerm)
        );
    });
    
    renderProductosUbicacion(filteredProductosUbicacion);
}

// Función para preparar el modal para un nuevo modelo producto
function prepareNewModelo() {
    document.getElementById('modeloForm').reset();
    document.getElementById('modeloId').value = '';

    document.getElementById('productoModal').addEventListener('shown.bs.modal', function () {
        document.getElementById('tipoUnidadInput').focus();
        document.getElementById('tipoProductoInput').focus();
    }, { once: true });
}


// Función para preparar el modal para un nuevo producto
function prepareNewProducto() {
    document.getElementById('productoModalLabel').textContent = 'Nuevo Producto';
    document.getElementById('productoForm').reset();
    document.getElementById('productoId').value = '';
    currentProductoId = null;
    
    // Establecer la fecha mínima como hoy
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fechaVencimientoInput').min = today;
    
    // Habilitar el select de modelo
    document.getElementById('modeloSelect').disabled = false;
    
    // Enfoca el primer campo después de que el modal se muestre
    document.getElementById('productoModal').addEventListener('shown.bs.modal', function () {
        document.getElementById('modeloSelect').focus();
    }, { once: true });
}

// Función para preparar el modal para una nueva asignación de producto por ubicación
function prepareNewProductoUbicacion() {
    document.getElementById('ubicacionModalLabel').textContent = 'Nueva Asignación de Producto';
    document.getElementById('ubicacionForm').reset();
    document.getElementById('currentProductoId').value = '';
    document.getElementById('currentUbicacionId').value = '';
    currentUbicacionProductoId = null;
    currentUbicacionUbicacionId = null;
    
    // Habilitar los selects
    document.getElementById('productoSelect').disabled = false;
    document.getElementById('ubicacionSelect').disabled = false;
    
    // Enfoca el primer campo después de que el modal se muestre
    document.getElementById('ubicacionModal').addEventListener('shown.bs.modal', function () {
        document.getElementById('productoSelect').focus();
    }, { once: true });
}

// Función para ver detalles de un producto
function viewProducto(id) {
    const producto = productos.find(p => p.Id_Producto === id);
    if (producto) {
        // Encontrar el modelo correspondiente
        const modelo = modelosProductos.find(m => m.Id_modelo_productos === producto.Id_modelo_productos) || { Nombre: 'Desconocido', Tipo: 'Desconocido' };
        
        // Formatear la fecha de vencimiento
        const fechaVencimiento = new Date(producto.Fecha_Vencimiento);
        const fechaFormateada = fechaVencimiento.toISOString().split('T')[0];
        
        document.getElementById('viewId').textContent = producto.Id_Producto;
        document.getElementById('viewNombre').textContent = modelo.Nombre;
        document.getElementById('viewModeloId').textContent = producto.Id_modelo_productos;
        document.getElementById('viewTipo').textContent = modelo.Tipo;
        document.getElementById('viewUnidades').textContent = producto.Unidades;
        document.getElementById('viewFechaVencimiento').textContent = fechaFormateada;
        
        const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
        viewModal.show();
    }
}

// Función para ver detalles de un producto por ubicación
function viewProductoUbicacion(productoId, ubicacionId) {
    const item = productosUbicacion.find(i => i.Id_Producto === productoId && i.Id_Ubicacion === ubicacionId);
    if (item) {
        // Encontrar el producto y su modelo correspondiente
        const producto = productos.find(p => p.Id_Producto === item.Id_Producto) || { Id_modelo_productos: null };
        const modelo = modelosProductos.find(m => m.Id_modelo_productos === producto.Id_modelo_productos) || { Nombre: 'Desconocido', Tipo: 'Desconocido' };
        
        // Encontrar la ubicación correspondiente
        const ubicacion = ubicaciones.find(u => u.Id_Ubicacion === item.Id_Ubicacion) || { Area: 'Desconocida', Ubicacion: 'Desconocida' };
        
        document.getElementById('viewUbicacionProductoId').textContent = item.Id_Producto;
        document.getElementById('viewUbicacionUbicacionId').textContent = item.Id_Ubicacion;
        document.getElementById('viewUbicacionNombre').textContent = modelo.Nombre;
        document.getElementById('viewUbicacionTipo').textContent = modelo.Tipo;
        document.getElementById('viewUbicacionArea').textContent = ubicacion.Area;
        document.getElementById('viewUbicacionNombreUbicacion').textContent = ubicacion.Ubicacion;
        document.getElementById('viewUbicacionUnidades').textContent = item.Unidades_Por_Ubicacion;
        
        const viewModal = new bootstrap.Modal(document.getElementById('viewUbicacionModal'));
        viewModal.show();
    }
}

// Función para editar un producto
function editProducto(id) {
    const producto = productos.find(p => p.Id_Producto === id);
    if (producto) {
        document.getElementById('productoModalLabel').textContent = 'Editar Producto';
        document.getElementById('productoId').value = producto.Id_Producto;
        document.getElementById('modeloSelect').value = producto.Id_modelo_productos;
        document.getElementById('unidadesInput').value = producto.Unidades;
        
        // Formatear la fecha de vencimiento para el input date
        const fechaVencimiento = new Date(producto.Fecha_Vencimiento);
        const fechaFormateada = fechaVencimiento.toISOString().split('T')[0];
        document.getElementById('fechaVencimientoInput').value = fechaFormateada;
        
        // Deshabilitar el select de modelo ya que no se puede cambiar en una edición
        document.getElementById('modeloSelect').disabled = true;
        
        currentProductoId = producto.Id_Producto;
        
        const productoModal = new bootstrap.Modal(document.getElementById('productoModal'));
        productoModal.show();
    }
}

// Función para editar un producto por ubicación
function editProductoUbicacion(productoId, ubicacionId) {
    const item = productosUbicacion.find(i => i.Id_Producto === productoId && i.Id_Ubicacion === ubicacionId);
    if (item) {
        document.getElementById('ubicacionModalLabel').textContent = 'Editar Asignación de Producto';
        document.getElementById('currentProductoId').value = item.Id_Producto;
        document.getElementById('currentUbicacionId').value = item.Id_Ubicacion;
        document.getElementById('productoSelect').value = item.Id_Producto;
        document.getElementById('ubicacionSelect').value = item.Id_Ubicacion;
        document.getElementById('unidadesPorUbicacionInput').value = item.Unidades_Por_Ubicacion;
        
        // Deshabilitar los selects ya que no se puede cambiar el producto o ubicación en una edición
        document.getElementById('productoSelect').disabled = true;
        document.getElementById('ubicacionSelect').disabled = true;
        
        currentUbicacionProductoId = item.Id_Producto;
        currentUbicacionUbicacionId = item.Id_Ubicacion;
        
        const ubicacionModal = new bootstrap.Modal(document.getElementById('ubicacionModal'));
        ubicacionModal.show();
    }
}

// Función para eliminar un producto
function deleteProducto(id) {
    const producto = productos.find(p => p.Id_Producto === id);
    if (producto) {
        // Encontrar el modelo correspondiente
        const modelo = modelosProductos.find(m => m.Id_modelo_productos === producto.Id_modelo_productos) || { Nombre: 'Desconocido' };
        
        // Formatear la fecha de vencimiento
        const fechaVencimiento = new Date(producto.Fecha_Vencimiento);
        const fechaFormateada = fechaVencimiento.toISOString().split('T')[0];
        
        document.getElementById('deleteNombre').textContent = modelo.Nombre;
        document.getElementById('deleteFechaVencimiento').textContent = fechaFormateada;
        currentProductoId = producto.Id_Producto;
        
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();
    }
}

// Función para eliminar un producto por ubicación
function deleteProductoUbicacion(productoId, ubicacionId) {
    const item = productosUbicacion.find(i => i.Id_Producto === productoId && i.Id_Ubicacion === ubicacionId);
    if (item) {
        // Encontrar el producto y su modelo correspondiente
        const producto = productos.find(p => p.Id_Producto === item.Id_Producto) || { Id_modelo_productos: null };
        const modelo = modelosProductos.find(m => m.Id_modelo_productos === producto.Id_modelo_productos) || { Nombre: 'Desconocido' };
        
        // Encontrar la ubicación correspondiente
        const ubicacion = ubicaciones.find(u => u.Id_Ubicacion === item.Id_Ubicacion) || { Area: 'Desconocida', Ubicacion: 'Desconocida' };
        
        document.getElementById('deleteUbicacionNombre').textContent = modelo.Nombre;
        document.getElementById('deleteUbicacionUbicacion').textContent = `${ubicacion.Area} - ${ubicacion.Ubicacion}`;
        currentUbicacionProductoId = item.Id_Producto;
        currentUbicacionUbicacionId = item.Id_Ubicacion;
        
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteUbicacionModal'));
        deleteModal.show();
    }
}

// Función para confirmar la eliminación de un producto
async function confirmDelete() {
    if (currentProductoId) {
        try {
            const deleteUrl = `${apiUrlProducto}/${currentProductoId}`;
            console.log(`Eliminando producto con ID ${currentProductoId}. URL: ${deleteUrl}`);
            
            const response = await fetch(deleteUrl, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`Error al eliminar el producto: ${response.status} ${response.statusText}`);
            }
            
            console.log(`Producto con ID ${currentProductoId} eliminado correctamente`);
            
            // Eliminar de la lista local
            productos = productos.filter(p => p.Id_Producto !== currentProductoId);
            renderProductos(productos);
            
            // Cerrar el modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
            
            // Mostrar mensaje de éxito
            showToast('Producto eliminado con éxito', 'success');
        } catch (error) {
            console.error('Error:', error);
            showToast('Error al eliminar el producto: ' + error.message, 'danger');
            
            // Cerrar el modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
        }
    }
}

// Función para confirmar la eliminación de un producto por ubicación
async function confirmDeleteUbicacion() {
    if (currentUbicacionProductoId && currentUbicacionUbicacionId) {
        try {
            const deleteUrl = `${apiUrlProductoUbicacion}/${currentUbicacionProductoId}/${currentUbicacionUbicacionId}`;
            console.log(`Eliminando asignación de producto con ID ${currentUbicacionProductoId} y ubicación ${currentUbicacionUbicacionId}. URL: ${deleteUrl}`);
            
            const response = await fetch(deleteUrl, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`Error al eliminar la asignación: ${response.status} ${response.statusText}`);
            }
            
            console.log(`Asignación eliminada correctamente`);
            
            // Eliminar de la lista local
            productosUbicacion = productosUbicacion.filter(i => 
                !(i.Id_Producto === currentUbicacionProductoId && i.Id_Ubicacion === currentUbicacionUbicacionId)
            );
            renderProductosUbicacion(productosUbicacion);
            
            // Cerrar el modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteUbicacionModal'));
            deleteModal.hide();
            
            // Mostrar mensaje de éxito
            showToast('Asignación eliminada con éxito', 'success');
        } catch (error) {
            console.error('Error:', error);
            showToast('Error al eliminar la asignación: ' + error.message, 'danger');
            
            // Cerrar el modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteUbicacionModal'));
            deleteModal.hide();
        }
    }
}

// Función para guardar un modelo (crear o actualizar)
async function saveModelo() {
    const nombre = document.getElementById('nombreInput').value;
    const codigo = document.getElementById('codigoInput').value;
    const descripcion = document.getElementById('descripcionInput').value;
    const tipoProducto = document.getElementById('tipoProductoInput').value;
    const tipoUnidad = document.getElementById('tipoUnidadInput').value;
    const unidadesMin = parseInt(document.getElementById('unidadesMinInput').value);
    const unidadesMax = parseInt(document.getElementById('unidadesMaxInput').value);
    
    if (!nombre || !codigo || !descripcion || !tipoProducto || !tipoUnidad || isNaN(unidadesMin) || isNaN(unidadesMax)) {
        showToast('Por favor complete todos los campos correctamente', 'warning');
        return;
    }
    
    if (unidadesMin <= 0 ||  unidadesMax <= 0 ) {
        showToast('Las unidades deben ser mayores que cero', 'warning');
        return;
    }
    
    // Crear el objeto de datos según si es creación o actualización
    let modeloData;
    
    if (currentProductoId) {
        // Para actualización (PUT), solo enviamos los campos que se pueden actualizar
        modeloData = {
            Nombre: nombre,
            Descripcion: descripcion,
            Codigo: codigo, 
            Tipo_Producto: tipoProducto,
            Tipo_Unidad: tipoUnidad,
            Unidades_Maximas: unidadesMax,
            Unidades_Minimas: unidadesMin
        };
    } else {
        // Para creación (POST), enviamos todos los campos requeridos
        modeloData = {
            Nombre: nombre,
            Descripcion: descripcion,
            Codigo: codigo, 
            Tipo_Producto: tipoProducto,
            Tipo_Unidad: tipoUnidad,
            Unidades_Maximas: unidadesMax,
            Unidades_Minimas: unidadesMin
        };
    }
    
    try {
        let url = apiUrlModelo;
        let method = 'POST';
        
        // Si es una edición, usamos PUT y la URL con ID
        if (currentProductoId) {
            url = `${apiUrlProducto}/${currentProductoId}`;
            method = 'PUT';
        }
        
        console.log(`Enviando datos a ${url} con método ${method}:`, modeloData);
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modeloData)
        });
        
        if (!response.ok) {
            throw new Error(`Error al guardar el producto: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);
        
        // Recargar los datos
        await loadModelosProductos();
        
        // Cerrar el modal
        const modeloModal = bootstrap.Modal.getInstance(document.getElementById('modeloModal'));
        modeloModal.hide();
        
        // Habilitar el select de modelo para futuras operaciones
        document.getElementById('modeloSelect').disabled = false;
        
        // Mostrar mensaje de éxito
        showToast(currentProductoId ? 'Modelo actualizado con éxito' : 'Mroducto creado con éxito', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al guardar el modelo: ' + error.message, 'danger');
        
        // Cerrar el modal
        const modeloModal = bootstrap.Modal.getInstance(document.getElementById('modeloModal'));
        modeloModal.hide();
        
        // Habilitar el select de modelo para futuras operaciones
        document.getElementById('modeloSelect').disabled = false;
    }
}

async function saveProducto() {
    const modeloId = parseInt(document.getElementById('modeloSelect').value);
    const unidades = parseInt(document.getElementById('unidadesInput').value);
    const fechaVencimiento = document.getElementById('fechaVencimientoInput').value;
    
    if (isNaN(modeloId) || isNaN(unidades) || !fechaVencimiento) {
        showToast('Por favor complete todos los campos correctamente', 'warning');
        return;
    }
    
    if (unidades <= 0) {
        showToast('Las unidades deben ser mayores que cero', 'warning');
        return;
    }
    
    // Crear el objeto de datos según si es creación o actualización
    let productoData;
    
    if (currentProductoId) {
        // Para actualización (PUT), solo enviamos los campos que se pueden actualizar
        productoData = {
            Unidades: unidades,
            Fecha_Vencimiento: fechaVencimiento
        };
    } else {
        // Para creación (POST), enviamos todos los campos requeridos
        productoData = {
            Id_modelo_productos: modeloId,
            Unidades: unidades,
            Fecha_Vencimiento: fechaVencimiento
        };
    }
    
    try {
        let url = apiUrlProducto;
        let method = 'POST';
        
        // Si es una edición, usamos PUT y la URL con ID
        if (currentProductoId) {
            url = `${apiUrlProducto}/${currentProductoId}`;
            method = 'PUT';
        }
        
        console.log(`Enviando datos a ${url} con método ${method}:`, productoData);
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoData)
        });
        
        if (!response.ok) {
            throw new Error(`Error al guardar el producto: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);
        
        // Recargar los datos
        await loadProductos();
        
        // Cerrar el modal
        const productoModal = bootstrap.Modal.getInstance(document.getElementById('productoModal'));
        productoModal.hide();
        
        // Habilitar el select de modelo para futuras operaciones
        document.getElementById('modeloSelect').disabled = false;
        
        // Mostrar mensaje de éxito
        showToast(currentProductoId ? 'Producto actualizado con éxito' : 'Producto creado con éxito', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al guardar el producto: ' + error.message, 'danger');
        
        // Cerrar el modal
        const productoModal = bootstrap.Modal.getInstance(document.getElementById('productoModal'));
        productoModal.hide();
        
        // Habilitar el select de modelo para futuras operaciones
        document.getElementById('modeloSelect').disabled = false;
    }
}

// Función para guardar un producto por ubicación (crear o actualizar)
async function saveProductoUbicacion() {
    const productoId = currentUbicacionProductoId || parseInt(document.getElementById('productoSelect').value);
    const ubicacionId = currentUbicacionUbicacionId || parseInt(document.getElementById('ubicacionSelect').value);
    const unidades = parseInt(document.getElementById('unidadesPorUbicacionInput').value);
    
    if (isNaN(productoId) || isNaN(ubicacionId) || isNaN(unidades) || unidades <= 0) {
        showToast('Por favor complete todos los campos correctamente', 'warning');
        return;
    }
    
    let ubicacionData;
    
    if (currentUbicacionProductoId && currentUbicacionUbicacionId) {
        // Para actualización (PUT), solo enviamos las unidades
        ubicacionData = {
            Unidades_Por_Ubicacion: unidades
        };
    } else {
        // Para creación (POST), enviamos todos los campos requeridos
        ubicacionData = {
            Unidades_Por_Ubicacion: unidades,
            Id_Producto: productoId,
            Id_Ubicacion: ubicacionId
        };
    }
    
    try {
        let url = apiUrlProductoUbicacion;
        let method = 'POST';
        
        // Si es una edición, usamos PUT y la URL con IDs
        if (currentUbicacionProductoId && currentUbicacionUbicacionId) {
            url = `${apiUrlProductoUbicacion}/${currentUbicacionProductoId}/${currentUbicacionUbicacionId}`;
            method = 'PUT';
        }
        
        console.log(`Enviando datos a ${url} con método ${method}:`, ubicacionData);
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ubicacionData)
        });
        
        if (!response.ok) {
            throw new Error(`Error al guardar la asignación: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);
        
        // Recargar los datos
        await loadProductosUbicacion();
        
        // Cerrar el modal
        const ubicacionModal = bootstrap.Modal.getInstance(document.getElementById('ubicacionModal'));
        ubicacionModal.hide();
        
        // Habilitar los selects para futuras operaciones
        document.getElementById('productoSelect').disabled = false;
        document.getElementById('ubicacionSelect').disabled = false;
        
        // Mostrar mensaje de éxito
        showToast(currentUbicacionProductoId && currentUbicacionUbicacionId ? 'Asignación actualizada con éxito' : 'Asignación creada con éxito', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al guardar la asignación: ' + error.message, 'danger');
        
        // Cerrar el modal
        const ubicacionModal = bootstrap.Modal.getInstance(document.getElementById('ubicacionModal'));
        ubicacionModal.hide();
        
        // Habilitar los selects para futuras operaciones
        document.getElementById('productoSelect').disabled = false;
        document.getElementById('ubicacionSelect').disabled = false;
    }
}

// Función para mostrar notificaciones toast
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    
    // Crear el elemento toast
    const toastElement = document.createElement('div');
    toastElement.className = `toast custom-toast align-items-center text-white bg-${type} border-0`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    
    // Crear el contenido del toast
    const toastContent = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastElement.innerHTML = toastContent;
    toastContainer.appendChild(toastElement);
    
    // Inicializar y mostrar el toast
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 5000
    });
    
    toast.show();
    
    // Eliminar el toast del DOM después de ocultarse
    toastElement.addEventListener('hidden.bs.toast', function () {
        toastElement.remove();
    });
}