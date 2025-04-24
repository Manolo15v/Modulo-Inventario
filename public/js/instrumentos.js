// Variables globales
let instrumentos = [];
let ubicaciones = [];
let instrumentosUbicacion = [];
let currentInstrumentoId = null;
let currentUbicacionInstrumentoId = null;
let currentUbicacionUbicacionId = null;

const apiUrlInstrumento = '/api/inventario/instrumento';
const apiUrlUbicacion = '/api/inventario/almacen';
const apiUrlInstrumentoUbicacion = '/api/inventario/instrumentoUbicacion';

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', async function() {
    await loadInstrumentos();
    await loadAllUbicaciones();
});

// Función para cargar los instrumentos desde la API
async function loadInstrumentos() {
    try {
        const response = await fetch(apiUrlInstrumento);
        if (!response.ok) {
            throw new Error('Error al cargar los datos de instrumentos');
        }
        instrumentos = await response.json();
        
        // Si la respuesta es un objeto único, convertirlo en array
        if (!Array.isArray(instrumentos)) {
            instrumentos = [instrumentos];
        }
        
        renderInstrumentos(instrumentos);
        populateInstrumentosSelect();
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar los datos de instrumentos. No hay instrumentos disponibles.', 'danger');
        
        // Dejar instrumentos como un array vacío
        instrumentos = [];
        renderInstrumentos(instrumentos);
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
        showToast('Error al cargar las ubicaciones. No hay ubicaciones disponibles.', 'danger');
        
        // Dejar ubicaciones como un array vacío
        ubicaciones = [];
    }
}

// Función para cargar los instrumentos por ubicación
async function loadInstrumentosUbicacion() {
    try {
        const response = await fetch(apiUrlInstrumentoUbicacion);
        if (!response.ok) {
            throw new Error('Error al cargar los datos de instrumentos por ubicación');
        }
        instrumentosUbicacion = await response.json();
        
        // Si la respuesta es un objeto único, convertirlo en array
        if (!Array.isArray(instrumentosUbicacion)) {
            instrumentosUbicacion = [instrumentosUbicacion];
        }
        
        renderInstrumentosUbicacion(instrumentosUbicacion);
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar los datos de instrumentos por ubicación. No hay datos disponibles.', 'danger');
        
        // Dejar instrumentosUbicacion como un array vacío
        instrumentosUbicacion = [];
        renderInstrumentosUbicacion(instrumentosUbicacion);
    }
}

// Función para llenar el select de instrumentos
function populateInstrumentosSelect() {
    const select = document.getElementById('instrumentoSelect');
    // Limpiar opciones existentes excepto la primera
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Añadir los instrumentos al select
    instrumentos.forEach(instrumento => {
        const option = document.createElement('option');
        option.value = instrumento.Id_Instrumento;
        option.textContent = `${instrumento.Nombre} (${instrumento.Codigo})`;
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

// Función para renderizar los instrumentos en la tabla
function renderInstrumentos(data) {
    const tableBody = document.getElementById('instrumentosTableBody');
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" class="empty-message">No hay instrumentos disponibles</td>
        `;
        tableBody.appendChild(row);
        return;
    }
    
    data.forEach(instrumento => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${instrumento.Nombre}</td>
            <td>${instrumento.Descripcion}</td>
            <td>${instrumento.Tipo_Instrumento}</td>
            <td>${instrumento.Unidades}</td>
            <td>
                <div class="action-btn view-btn" onclick="viewInstrumento(${instrumento.Id_Instrumento})" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="action-btn edit-btn" onclick="editInstrumento(${instrumento.Id_Instrumento})" title="Editar">
                    <i class="fas fa-edit"></i>
                </div>
                <div class="action-btn delete-btn" onclick="deleteInstrumento(${instrumento.Id_Instrumento})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para renderizar los instrumentos por ubicación en la tabla
function renderInstrumentosUbicacion(data) {
    const tableBody = document.getElementById('ubicacionesTableBody');
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" class="empty-message">No hay asignaciones de instrumentos disponibles</td>
        `;
        tableBody.appendChild(row);
        return;
    }
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.Nombre_Instrumento}</td>
            <td>${item.Tipo_Instrumento}</td>
            <td>${item.Area}</td>
            <td>${item.Nombre_Ubicacion}</td>
            <td>${item.Unidades_Por_Ubicacion}</td>
            <td>
                <div class="action-btn view-btn" onclick="viewInstrumentoUbicacion(${item.Id_Instrumento}, ${item.Id_Ubicacion})" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="action-btn edit-btn" onclick="editInstrumentoUbicacion(${item.Id_Instrumento}, ${item.Id_Ubicacion})" title="Editar">
                    <i class="fas fa-edit"></i>
                </div>
                <div class="action-btn delete-btn" onclick="deleteInstrumentoUbicacion(${item.Id_Instrumento}, ${item.Id_Ubicacion})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para buscar instrumentos
function searchInstrumentos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredInstrumentos = instrumentos.filter(instrumento => 
        instrumento.Nombre.toLowerCase().includes(searchTerm) || 
        instrumento.Descripcion.toLowerCase().includes(searchTerm) ||
        instrumento.Codigo.toLowerCase().includes(searchTerm) ||
        instrumento.Tipo_Instrumento.toLowerCase().includes(searchTerm)
    );
    renderInstrumentos(filteredInstrumentos);
}

// Función para buscar instrumentos por ubicación
function searchInstrumentosUbicacion() {
    const searchTerm = document.getElementById('searchUbicacionInput').value.toLowerCase();
    const filteredInstrumentosUbicacion = instrumentosUbicacion.filter(item => 
        item.Nombre_Instrumento.toLowerCase().includes(searchTerm) || 
        item.Tipo_Instrumento.toLowerCase().includes(searchTerm) ||
        item.Area.toLowerCase().includes(searchTerm) ||
        item.Nombre_Ubicacion.toLowerCase().includes(searchTerm)
    );
    renderInstrumentosUbicacion(filteredInstrumentosUbicacion);
}

// Función para preparar el modal para un nuevo instrumento
function prepareNewInstrumento() {
    document.getElementById('instrumentoModalLabel').textContent = 'Nuevo Instrumento';
    document.getElementById('instrumentoForm').reset();
    document.getElementById('instrumentoId').value = '';
    currentInstrumentoId = null;
    
    // Enfoca el primer campo después de que el modal se muestre
    document.getElementById('instrumentoModal').addEventListener('shown.bs.modal', function () {
        document.getElementById('nombreInput').focus();
    }, { once: true });
}

// Función para preparar el modal para una nueva asignación de instrumento por ubicación
function prepareNewUbicacion() {
    document.getElementById('ubicacionModalLabel').textContent = 'Nueva Asignación de Instrumento';
    document.getElementById('ubicacionForm').reset();
    document.getElementById('currentInstrumentoId').value = '';
    document.getElementById('currentUbicacionId').value = '';
    currentUbicacionInstrumentoId = null;
    currentUbicacionUbicacionId = null;
    
    // Enfoca el primer campo después de que el modal se muestre
    document.getElementById('ubicacionModal').addEventListener('shown.bs.modal', function () {
        document.getElementById('instrumentoSelect').focus();
    }, { once: true });
}

// Función para ver detalles de un instrumento
function viewInstrumento(id) {
    const instrumento = instrumentos.find(i => i.Id_Instrumento === id);
    if (instrumento) {
        document.getElementById('viewId').textContent = instrumento.Id_Instrumento;
        document.getElementById('viewNombre').textContent = instrumento.Nombre;
        document.getElementById('viewDescripcion').textContent = instrumento.Descripcion;
        document.getElementById('viewCodigo').textContent = instrumento.Codigo;
        document.getElementById('viewTipo').textContent = instrumento.Tipo_Instrumento;
        document.getElementById('viewUnidades').textContent = instrumento.Unidades;
        document.getElementById('viewUnidadesMin').textContent = instrumento.Unidades_Minimas;
        document.getElementById('viewUnidadesMax').textContent = instrumento.Unidades_Maximas;
        
        const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
        viewModal.show();
    }
}

// Función para ver detalles de un instrumento por ubicación
function viewInstrumentoUbicacion(instrumentoId, ubicacionId) {
    const item = instrumentosUbicacion.find(i => i.Id_Instrumento === instrumentoId && i.Id_Ubicacion === ubicacionId);
    if (item) {
        document.getElementById('viewUbicacionInstrumentoId').textContent = item.Id_Instrumento;
        document.getElementById('viewUbicacionUbicacionId').textContent = item.Id_Ubicacion;
        document.getElementById('viewUbicacionNombre').textContent = item.Nombre_Instrumento;
        document.getElementById('viewUbicacionTipo').textContent = item.Tipo_Instrumento;
        document.getElementById('viewUbicacionArea').textContent = item.Area;
        document.getElementById('viewUbicacionNombreUbicacion').textContent = item.Nombre_Ubicacion;
        document.getElementById('viewUbicacionUnidades').textContent = item.Unidades_Por_Ubicacion;
        
        const viewModal = new bootstrap.Modal(document.getElementById('viewUbicacionModal'));
        viewModal.show();
    }
}

// Función para editar un instrumento
function editInstrumento(id) {
    const instrumento = instrumentos.find(i => i.Id_Instrumento === id);
    if (instrumento) {
        document.getElementById('instrumentoModalLabel').textContent = 'Editar Instrumento';
        document.getElementById('instrumentoId').value = instrumento.Id_Instrumento;
        document.getElementById('nombreInput').value = instrumento.Nombre;
        document.getElementById('descripcionInput').value = instrumento.Descripcion;
        document.getElementById('codigoInput').value = instrumento.Codigo;
        document.getElementById('tipoInput').value = instrumento.Tipo_Instrumento;
        document.getElementById('unidadesInput').value = instrumento.Unidades;
        document.getElementById('unidadesMinInput').value = instrumento.Unidades_Minimas;
        document.getElementById('unidadesMaxInput').value = instrumento.Unidades_Maximas;
        
        currentInstrumentoId = instrumento.Id_Instrumento;
        
        const instrumentoModal = new bootstrap.Modal(document.getElementById('instrumentoModal'));
        instrumentoModal.show();
    }
}

// Función para editar un instrumento por ubicación
function editInstrumentoUbicacion(instrumentoId, ubicacionId) {
    const item = instrumentosUbicacion.find(i => i.Id_Instrumento === instrumentoId && i.Id_Ubicacion === ubicacionId);
    if (item) {
        document.getElementById('ubicacionModalLabel').textContent = 'Editar Asignación de Instrumento';
        document.getElementById('currentInstrumentoId').value = item.Id_Instrumento;
        document.getElementById('currentUbicacionId').value = item.Id_Ubicacion;
        document.getElementById('instrumentoSelect').value = item.Id_Instrumento;
        document.getElementById('ubicacionSelect').value = item.Id_Ubicacion;
        document.getElementById('unidadesPorUbicacionInput').value = item.Unidades_Por_Ubicacion;
        
        // Deshabilitar los selects ya que no se puede cambiar el instrumento o ubicación en una edición
        document.getElementById('instrumentoSelect').disabled = true;
        document.getElementById('ubicacionSelect').disabled = true;
        
        currentUbicacionInstrumentoId = item.Id_Instrumento;
        currentUbicacionUbicacionId = item.Id_Ubicacion;
        
        const ubicacionModal = new bootstrap.Modal(document.getElementById('ubicacionModal'));
        ubicacionModal.show();
    }
}

// Función para eliminar un instrumento
function deleteInstrumento(id) {
    const instrumento = instrumentos.find(i => i.Id_Instrumento === id);
    if (instrumento) {
        document.getElementById('deleteNombre').textContent = instrumento.Nombre;
        document.getElementById('deleteCodigo').textContent = instrumento.Codigo;
        currentInstrumentoId = instrumento.Id_Instrumento;
        
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();
    }
}

// Función para eliminar un instrumento por ubicación
function deleteInstrumentoUbicacion(instrumentoId, ubicacionId) {
    const item = instrumentosUbicacion.find(i => i.Id_Instrumento === instrumentoId && i.Id_Ubicacion === ubicacionId);
    if (item) {
        document.getElementById('deleteUbicacionNombre').textContent = item.Nombre_Instrumento;
        document.getElementById('deleteUbicacionUbicacion').textContent = `${item.Area} - ${item.Nombre_Ubicacion}`;
        currentUbicacionInstrumentoId = item.Id_Instrumento;
        currentUbicacionUbicacionId = item.Id_Ubicacion;
        
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteUbicacionModal'));
        deleteModal.show();
    }
}

// Función para confirmar la eliminación de un instrumento
async function confirmDelete() {
    if (currentInstrumentoId) {
        try {
            const deleteUrl = `${apiUrlInstrumento}/${currentInstrumentoId}`;
            console.log(`Eliminando instrumento con ID ${currentInstrumentoId}. URL: ${deleteUrl}`);
            
            const response = await fetch(deleteUrl, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`Error al eliminar el instrumento: ${response.status} ${response.statusText}`);
            }
            
            console.log(`Instrumento con ID ${currentInstrumentoId} eliminado correctamente`);
            
            // Eliminar de la lista local
            instrumentos = instrumentos.filter(i => i.Id_Instrumento !== currentInstrumentoId);
            renderInstrumentos(instrumentos);
            
            // Cerrar el modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
            
            // Mostrar mensaje de éxito
            showToast('Instrumento eliminado con éxito', 'success');
        } catch (error) {
            console.error('Error:', error);
            showToast('Error al eliminar el instrumento: ' + error.message, 'danger');
            
            // Cerrar el modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
        }
    }
}

// Función para confirmar la eliminación de un instrumento por ubicación
async function confirmDeleteUbicacion() {
    if (currentUbicacionInstrumentoId && currentUbicacionUbicacionId) {
        try {
            const deleteUrl = `${apiUrlInstrumentoUbicacion}/${currentUbicacionInstrumentoId}/${currentUbicacionUbicacionId}`;
            console.log(`Eliminando asignación de instrumento con ID ${currentUbicacionInstrumentoId} y ubicación ${currentUbicacionUbicacionId}. URL: ${deleteUrl}`);
            
            const response = await fetch(deleteUrl, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`Error al eliminar la asignación: ${response.status} ${response.statusText}`);
            }
            
            console.log(`Asignación eliminada correctamente`);
            
            // Eliminar de la lista local
            instrumentosUbicacion = instrumentosUbicacion.filter(i => 
                !(i.Id_Instrumento === currentUbicacionInstrumentoId && i.Id_Ubicacion === currentUbicacionUbicacionId)
            );
            renderInstrumentosUbicacion(instrumentosUbicacion);
            
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

// Función para guardar un instrumento (crear o actualizar)
async function saveInstrumento() {
    const nombre = document.getElementById('nombreInput').value.trim();
    const descripcion = document.getElementById('descripcionInput').value.trim();
    const codigo = document.getElementById('codigoInput').value.trim();
    const tipo = document.getElementById('tipoInput').value;
    const unidades = parseInt(document.getElementById('unidadesInput').value);
    const unidadesMin = parseInt(document.getElementById('unidadesMinInput').value);
    const unidadesMax = parseInt(document.getElementById('unidadesMaxInput').value);
    
    if (!nombre || !descripcion || !codigo || !tipo || isNaN(unidades) || isNaN(unidadesMin) || isNaN(unidadesMax)) {
        showToast('Por favor complete todos los campos correctamente', 'warning');
        return;
    }
    
    if (unidadesMin > unidadesMax) {
        showToast('Las unidades mínimas no pueden ser mayores que las máximas', 'warning');
        return;
    }
    
    const instrumentoData = {
        Nombre: nombre,
        Descripcion: descripcion,
        Codigo: codigo,
        Tipo_Instrumento: tipo,
        Unidades: unidades,
        Unidades_Minimas: unidadesMin,
        Unidades_Maximas: unidadesMax
    };
    
    try {
        let url = apiUrlInstrumento;
        let method = 'POST';
        
        // Si es una edición, usamos PUT y la URL con ID
        if (currentInstrumentoId) {
            url = `${apiUrlInstrumento}/${currentInstrumentoId}`;
            method = 'PUT';
            // No incluimos el ID en el cuerpo de la solicitud
        }
        
        console.log(`Enviando datos a ${url} con método ${method}:`, instrumentoData);
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(instrumentoData)
        });
        
        if (!response.ok) {
            throw new Error(`Error al guardar el instrumento: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);
        
        // Recargar los datos
        await loadInstrumentos();
        
        // Cerrar el modal
        const instrumentoModal = bootstrap.Modal.getInstance(document.getElementById('instrumentoModal'));
        instrumentoModal.hide();
        
        // Mostrar mensaje de éxito
        showToast(currentInstrumentoId ? 'Instrumento actualizado con éxito' : 'Instrumento creado con éxito', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al guardar el instrumento: ' + error.message, 'danger');
        
        // Cerrar el modal
        const instrumentoModal = bootstrap.Modal.getInstance(document.getElementById('instrumentoModal'));
        instrumentoModal.hide();
    }
}

// Función para guardar un instrumento por ubicación (crear o actualizar)
async function saveUbicacion() {
    const instrumentoId = currentUbicacionInstrumentoId || parseInt(document.getElementById('instrumentoSelect').value);
    const ubicacionId = currentUbicacionUbicacionId || parseInt(document.getElementById('ubicacionSelect').value);
    const unidades = parseInt(document.getElementById('unidadesPorUbicacionInput').value);
    
    if (isNaN(instrumentoId) || isNaN(ubicacionId) || isNaN(unidades) || unidades <= 0) {
        showToast('Por favor complete todos los campos correctamente', 'warning');
        return;
    }
    
    const ubicacionData = {
        Unidades_Por_Ubicacion: unidades,
        Id_Instrumento: instrumentoId,
        Id_Ubicacion: ubicacionId
    };
    
    try {
        let url = apiUrlInstrumentoUbicacion;
        let method = 'POST';
        
        // Si es una edición, usamos PUT y la URL con IDs
        if (currentUbicacionInstrumentoId && currentUbicacionUbicacionId) {
            url = `${apiUrlInstrumentoUbicacion}/${currentUbicacionInstrumentoId}/${currentUbicacionUbicacionId}`;
            method = 'PUT';
            // Para PUT solo necesitamos enviar las unidades
            ubicacionData = {
                Unidades_Por_Ubicacion: unidades
            };
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
        await loadInstrumentosUbicacion();
        
        // Cerrar el modal
        const ubicacionModal = bootstrap.Modal.getInstance(document.getElementById('ubicacionModal'));
        ubicacionModal.hide();
        
        // Habilitar los selects para futuras operaciones
        document.getElementById('instrumentoSelect').disabled = false;
        document.getElementById('ubicacionSelect').disabled = false;
        
        // Mostrar mensaje de éxito
        showToast(currentUbicacionInstrumentoId && currentUbicacionUbicacionId ? 'Asignación actualizada con éxito' : 'Asignación creada con éxito', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al guardar la asignación: ' + error.message, 'danger');
        
        // Cerrar el modal
        const ubicacionModal = bootstrap.Modal.getInstance(document.getElementById('ubicacionModal'));
        ubicacionModal.hide();
        
        // Habilitar los selects para futuras operaciones
        document.getElementById('instrumentoSelect').disabled = false;
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