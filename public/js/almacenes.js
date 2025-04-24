// Variables globales
let almacenes = [];
let currentAlmacenId = null;
const apiUrl = '/api/inventario/almacen';

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', loadAlmacenes);

// Función para cargar los almacenes desde la API
async function loadAlmacenes() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        almacenes = await response.json();
        renderAlmacenes(almacenes);
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar los datos', 'danger');

    }
}

// Función para renderizar los almacenes en la tabla
function renderAlmacenes(data) {
    const tableBody = document.getElementById('almacenesTableBody');
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="3" class="text-center">No hay almacenes disponibles</td>
        `;
        tableBody.appendChild(row);
        return;
    }
    
    data.forEach(almacen => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${almacen.Area}</td>
            <td>${almacen.Ubicacion}</td>
            <td>
                <div class="action-btn view-btn" onclick="viewAlmacen(${almacen.Id_Ubicacion})" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="action-btn edit-btn" onclick="editAlmacen(${almacen.Id_Ubicacion})" title="Editar">
                    <i class="fas fa-edit"></i>
                </div>
                <div class="action-btn delete-btn" onclick="deleteAlmacen(${almacen.Id_Ubicacion})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para buscar almacenes
function searchAlmacenes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredAlmacenes = almacenes.filter(almacen => 
        almacen.Area.toLowerCase().includes(searchTerm) || 
        almacen.Ubicacion.toLowerCase().includes(searchTerm)
    );
    renderAlmacenes(filteredAlmacenes);
}

// Función para preparar el modal para un nuevo almacén
function prepareNewAlmacen() {
    document.getElementById('almacenModalLabel').textContent = 'Nuevo Almacén';
    document.getElementById('almacenForm').reset();
    document.getElementById('almacenId').value = '';
    currentAlmacenId = null;
    
    // Enfoca el primer campo después de que el modal se muestre
    document.getElementById('almacenModal').addEventListener('shown.bs.modal', function () {
        document.getElementById('areaInput').focus();
    }, { once: true });
}

// Función para ver detalles de un almacén
function viewAlmacen(id) {
    const almacen = almacenes.find(a => a.Id_Ubicacion === id);
    if (almacen) {
        document.getElementById('viewId').textContent = almacen.Id_Ubicacion;
        document.getElementById('viewArea').textContent = almacen.Area;
        document.getElementById('viewUbicacion').textContent = almacen.Ubicacion;
        
        const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
        viewModal.show();
    }
}

// Función para editar un almacén
function editAlmacen(id) {
    const almacen = almacenes.find(a => a.Id_Ubicacion === id);
    if (almacen) {
        document.getElementById('almacenModalLabel').textContent = 'Editar Almacén';
        document.getElementById('almacenId').value = almacen.Id_Ubicacion;
        document.getElementById('areaInput').value = almacen.Area;
        document.getElementById('ubicacionInput').value = almacen.Ubicacion;
        currentAlmacenId = almacen.Id_Ubicacion;
        
        const almacenModal = new bootstrap.Modal(document.getElementById('almacenModal'));
        almacenModal.show();
    }
}

// Función para eliminar un almacén
function deleteAlmacen(id) {
    const almacen = almacenes.find(a => a.Id_Ubicacion === id);
    if (almacen) {
        document.getElementById('deleteArea').textContent = almacen.Area;
        document.getElementById('deleteUbicacion').textContent = almacen.Ubicacion;
        currentAlmacenId = almacen.Id_Ubicacion;
        
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();
    }
}

// Función para confirmar la eliminación
async function confirmDelete() {
    if (currentAlmacenId) {
        try {
            const deleteUrl = `${apiUrl}/${currentAlmacenId}`;
            console.log(`Eliminando almacén con ID ${currentAlmacenId}. URL: ${deleteUrl}`);
            
            const response = await fetch(deleteUrl, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`Error al eliminar el almacén: ${response.status} ${response.statusText}`);
            }
            
            console.log(`Almacén con ID ${currentAlmacenId} eliminado correctamente`);
            
            // Eliminar de la lista local
            almacenes = almacenes.filter(a => a.Id_Ubicacion !== currentAlmacenId);
            renderAlmacenes(almacenes);
            
            // Cerrar el modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
            
            // Mostrar mensaje de éxito
            showToast('Almacén eliminado con éxito', 'success');
        } catch (error) {
            console.error('Error:', error);
            
            // Para desarrollo, simulamos la eliminación
            almacenes = almacenes.filter(a => a.Id_Ubicacion !== currentAlmacenId);
            renderAlmacenes(almacenes);
            
            // Cerrar el modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
            
            // Mostrar mensaje de éxito (simulado)
            showToast('Almacén eliminado con éxito (simulado)', 'success');
        }
    }
}

// Función para guardar un almacén (crear o actualizar)
async function saveAlmacen() {
    const area = document.getElementById('areaInput').value.trim();
    const ubicacion = document.getElementById('ubicacionInput').value.trim();
    
    if (!area || !ubicacion) {
        showToast('Por favor complete todos los campos', 'warning');
        return;
    }
    
    const almacenData = {
        Area: area,
        Ubicacion: ubicacion
    };
    
    try {
        let url = apiUrl;
        let method = 'POST';
        
        // Si es una edición, usamos PUT y la URL con ID
        if (currentAlmacenId) {
            url = `${apiUrl}/${currentAlmacenId}`;
            method = 'PUT';
            // No incluimos el ID en el cuerpo de la solicitud
        }
        
        console.log(`Enviando datos a ${url} con método ${method}:`, almacenData);
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(almacenData)
        });
        
        if (!response.ok) {
            throw new Error(`Error al guardar el almacén: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);
        
        // Recargar los datos
        await loadAlmacenes();
        
        // Cerrar el modal
        const almacenModal = bootstrap.Modal.getInstance(document.getElementById('almacenModal'));
        almacenModal.hide();
        
        // Mostrar mensaje de éxito
        showToast(currentAlmacenId ? 'Almacén actualizado con éxito' : 'Almacén creado con éxito', 'success');
    } catch (error) {
        console.error('Error:', error);
        
        // Para desarrollo, simulamos la operación
        if (currentAlmacenId) {
            // Actualizar en la lista local
            const index = almacenes.findIndex(a => a.Id_Ubicacion === currentAlmacenId);
            if (index !== -1) {
                almacenes[index] = {
                    ...almacenes[index],
                    Area: area,
                    Ubicacion: ubicacion
                };
            }
        } else {
            // Crear nuevo con ID generado
            const newId = Math.max(...almacenes.map(a => a.Id_Ubicacion), 0) + 1;
            almacenes.push({
                Id_Ubicacion: newId,
                Area: area,
                Ubicacion: ubicacion
            });
        }
        
        renderAlmacenes(almacenes);
        
        // Cerrar el modal
        const almacenModal = bootstrap.Modal.getInstance(document.getElementById('almacenModal'));
        almacenModal.hide();
        
        // Mostrar mensaje de éxito (simulado)
        showToast(currentAlmacenId ? 'Almacén actualizado con éxito (simulado)' : 'Almacén creado con éxito (simulado)', 'success');
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