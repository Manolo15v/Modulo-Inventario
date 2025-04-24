// Variables globales
let repuestos = [];
let ubicaciones = [];
let currentRepuestoId = null;
const apiUrl = '/api/inventario/repuestos';
const apiUrlUbicaciones = '/api/inventario/almacen';

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', async function() {
    await loadUbicaciones();
    await loadRepuestos();
});

// Función para cargar las ubicaciones desde la API
async function loadUbicaciones() {
    try {
        const response = await fetch(apiUrlUbicaciones);
        if (!response.ok) {
            throw new Error('Error al cargar las ubicaciones');
        }
        ubicaciones = await response.json();
        populateUbicacionesSelect();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar las ubicaciones. No hay datos disponibles.', 'danger');
        
        // Dejar ubicaciones como un array vacío
        ubicaciones = [];
        populateUbicacionesSelect();
    }
}

// Función para llenar el select de ubicaciones
function populateUbicacionesSelect() {
    const select = document.getElementById('ubicacionInput');
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

// Función para cargar los repuestos desde la API
async function loadRepuestos() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        repuestos = await response.json();
        renderRepuestos(repuestos);
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar los datos. No hay repuestos disponibles.', 'danger');
        
        // Dejar repuestos como un array vacío
        repuestos = [];
        renderRepuestos(repuestos);
    }
}

// Función para renderizar los repuestos en la tabla
function renderRepuestos(data) {
    const tableBody = document.getElementById('repuestosTableBody');
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" class="empty-message">No hay repuestos disponibles</td>
        `;
        tableBody.appendChild(row);
        return;
    }
    
    data.forEach(repuesto => {
        // Encontrar la ubicación correspondiente
        const ubicacion = ubicaciones.find(u => u.Id_Ubicacion === repuesto.Id_Ubicacion) || { Area: 'No disponible', Ubicacion: 'No disponible' };
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${repuesto.Nombre}</td>
            <td>${repuesto.Descripcion}</td>
            <td>${repuesto.Unidades}</td>
            <td>${ubicacion.Area}</td>
            <td>${ubicacion.Ubicacion}</td>
            <td>
                <div class="action-btn view-btn" onclick="viewRepuesto(${repuesto.Id_Repuesto})" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="action-btn edit-btn" onclick="editRepuesto(${repuesto.Id_Repuesto})" title="Editar">
                    <i class="fas fa-edit"></i>
                </div>
                <div class="action-btn delete-btn" onclick="deleteRepuesto(${repuesto.Id_Repuesto})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para buscar repuestos
function searchRepuestos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredRepuestos = repuestos.filter(repuesto => 
        repuesto.Nombre.toLowerCase().includes(searchTerm) || 
        repuesto.Descripcion.toLowerCase().includes(searchTerm) ||
        repuesto.Numero_de_Pieza.toLowerCase().includes(searchTerm)
    );
    renderRepuestos(filteredRepuestos);
}

// Función para preparar el modal para un nuevo repuesto
function prepareNewRepuesto() {
    document.getElementById('repuestoModalLabel').textContent = 'Nuevo Repuesto';
    document.getElementById('repuestoForm').reset();
    document.getElementById('repuestoId').value = '';
    currentRepuestoId = null;
    
    // Enfoca el primer campo después de que el modal se muestre
    document.getElementById('repuestoModal').addEventListener('shown.bs.modal', function () {
        document.getElementById('nombreInput').focus();
    }, { once: true });
}

// Función para ver detalles de un repuesto
function viewRepuesto(id) {
    const repuesto = repuestos.find(r => r.Id_Repuesto === id);
    if (repuesto) {
        // Encontrar la ubicación correspondiente
        const ubicacion = ubicaciones.find(u => u.Id_Ubicacion === repuesto.Id_Ubicacion) || { Area: 'No disponible', Ubicacion: 'No disponible' };
        
        document.getElementById('viewId').textContent = repuesto.Id_Repuesto;
        document.getElementById('viewNombre').textContent = repuesto.Nombre;
        document.getElementById('viewDescripcion').textContent = repuesto.Descripcion;
        document.getElementById('viewNumeroPieza').textContent = repuesto.Numero_de_Pieza;
        document.getElementById('viewUnidades').textContent = repuesto.Unidades;
        document.getElementById('viewUnidadesMin').textContent = repuesto.Unidades_Minimas;
        document.getElementById('viewUnidadesMax').textContent = repuesto.Unidades_Maximas;
        document.getElementById('viewUbicacion').textContent = `${ubicacion.Area} - ${ubicacion.Ubicacion}`;
        
        const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
        viewModal.show();
    }
}

// Función para editar un repuesto
function editRepuesto(id) {
    const repuesto = repuestos.find(r => r.Id_Repuesto === id);
    if (repuesto) {
        document.getElementById('repuestoModalLabel').textContent = 'Editar Repuesto';
        document.getElementById('repuestoId').value = repuesto.Id_Repuesto;
        document.getElementById('nombreInput').value = repuesto.Nombre;
        document.getElementById('descripcionInput').value = repuesto.Descripcion;
        document.getElementById('numeroPiezaInput').value = repuesto.Numero_de_Pieza;
        document.getElementById('unidadesInput').value = repuesto.Unidades;
        document.getElementById('unidadesMinInput').value = repuesto.Unidades_Minimas;
        document.getElementById('unidadesMaxInput').value = repuesto.Unidades_Maximas;
        document.getElementById('ubicacionInput').value = repuesto.Id_Ubicacion;
        
        currentRepuestoId = repuesto.Id_Repuesto;
        
        const repuestoModal = new bootstrap.Modal(document.getElementById('repuestoModal'));
        repuestoModal.show();
    }
}

// Función para eliminar un repuesto
function deleteRepuesto(id) {
    const repuesto = repuestos.find(r => r.Id_Repuesto === id);
    if (repuesto) {
        document.getElementById('deleteNombre').textContent = repuesto.Nombre;
        document.getElementById('deleteNumeroPieza').textContent = repuesto.Numero_de_Pieza;
        currentRepuestoId = repuesto.Id_Repuesto;
        
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();
    }
}

// Función para confirmar la eliminación
async function confirmDelete() {
    if (currentRepuestoId) {
        try {
            const deleteUrl = `${apiUrl}/${currentRepuestoId}`;
            console.log(`Eliminando repuesto con ID ${currentRepuestoId}. URL: ${deleteUrl}`);
            
            const response = await fetch(deleteUrl, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`Error al eliminar el repuesto: ${response.status} ${response.statusText}`);
            }
            
            console.log(`Repuesto con ID ${currentRepuestoId} eliminado correctamente`);
            
            // Eliminar de la lista local
            repuestos = repuestos.filter(r => r.Id_Repuesto !== currentRepuestoId);
            renderRepuestos(repuestos);
            
            // Cerrar el modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
            
            // Mostrar mensaje de éxito
            showToast('Repuesto eliminado con éxito', 'success');
        } catch (error) {
            console.error('Error:', error);
            showToast('Error al eliminar el repuesto: ' + error.message, 'danger');
            
            // No simulamos la eliminación si hay error, mantenemos los datos actuales
            // Cerrar el modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
        }
    }
}

// Función para guardar un repuesto (crear o actualizar)
async function saveRepuesto() {
    const nombre = document.getElementById('nombreInput').value.trim();
    const descripcion = document.getElementById('descripcionInput').value.trim();
    const numeroPieza = document.getElementById('numeroPiezaInput').value.trim();
    const unidades = parseInt(document.getElementById('unidadesInput').value);
    const unidadesMin = parseInt(document.getElementById('unidadesMinInput').value);
    const unidadesMax = parseInt(document.getElementById('unidadesMaxInput').value);
    const idUbicacion = parseInt(document.getElementById('ubicacionInput').value);
    
    if (!nombre || !descripcion || !numeroPieza || isNaN(unidades) || isNaN(unidadesMin) || isNaN(unidadesMax) || isNaN(idUbicacion)) {
        showToast('Por favor complete todos los campos correctamente', 'warning');
        return;
    }
    
    if (unidadesMin > unidadesMax) {
        showToast('Las unidades mínimas no pueden ser mayores que las máximas', 'warning');
        return;
    }
    
    const repuestoData = {
        Nombre: nombre,
        Descripcion: descripcion,
        Numero_de_Pieza: numeroPieza,
        Unidades: unidades,
        Unidades_Minimas: unidadesMin,
        Unidades_Maximas: unidadesMax,
        Id_Ubicacion: idUbicacion
    };
    
    try {
        let url = apiUrl;
        let method = 'POST';
        
        // Si es una edición, usamos PUT y la URL con ID
        if (currentRepuestoId) {
            url = `${apiUrl}/${currentRepuestoId}`;
            method = 'PUT';
            // No incluimos el ID en el cuerpo de la solicitud
        }
        
        console.log(`Enviando datos a ${url} con método ${method}:`, repuestoData);
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(repuestoData)
        });
        
        if (!response.ok) {
            throw new Error(`Error al guardar el repuesto: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);
        
        // Recargar los datos
        await loadRepuestos();
        
        // Cerrar el modal
        const repuestoModal = bootstrap.Modal.getInstance(document.getElementById('repuestoModal'));
        repuestoModal.hide();
        
        // Mostrar mensaje de éxito
        showToast(currentRepuestoId ? 'Repuesto actualizado con éxito' : 'Repuesto creado con éxito', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al guardar el repuesto: ' + error.message, 'danger');
        
        // No simulamos la operación si hay error, mantenemos los datos actuales
        // Cerrar el modal
        const repuestoModal = bootstrap.Modal.getInstance(document.getElementById('repuestoModal'));
        repuestoModal.hide();
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