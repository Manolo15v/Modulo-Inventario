// Variables globales
let equipos = [];
let modelos = [];
let ubicaciones = [];
let currentEquipoId = null;

const apiUrlEquipo = '/api/inventario/equipos';
const apiUrlModelo = '/api/inventario/modeloEquipos';
const apiUrlUbicacion = '/api/inventario/almacen';

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', async function () {

  await loadModelos();
  await loadUbicaciones();
  await loadEquipos();
});

// Función para cargar los modelos de equipos
async function loadModelos() {
  try {
    const response = await fetch(apiUrlModelo);
    if (!response.ok) {
      throw new Error('Error al cargar los modelos de equipos');
    }
    modelos = await response.json();

    // Si la respuesta es un objeto único, convertirlo en array
    if (!Array.isArray(modelos)) {
      modelos = [modelos];
    }

    populateModelosSelect();
  } catch (error) {
    console.error('Error:', error);
    showToast('Error al cargar los modelos de equipos.', 'danger');

    populateModelosSelect();
  }
}

// Función para cargar las ubicaciones
async function loadUbicaciones() {
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
    showToast('Error al cargar las ubicaciones. Usando datos de ejemplo.', 'danger');

    // Datos de ejemplo en caso de error
    ubicaciones = [
      { Id_Ubicacion: 1, Area: "Laboratorio", Ubicacion: "Estante 3-B" },
      { Id_Ubicacion: 2, Area: "Quirófano", Ubicacion: "Sala 1" },
      { Id_Ubicacion: 3, Area: "Radiología", Ubicacion: "Sala Principal" },
      { Id_Ubicacion: 4, Area: "Consulta", Ubicacion: "Consultorio 5" }
    ];
    populateUbicacionesSelect();
  }
}

// Función para cargar los equipos desde la API
async function loadEquipos() {
  try {
    const response = await fetch(apiUrlEquipo);
    if (!response.ok) {
      throw new Error('Error al cargar los datos de equipos');
    }
    equipos = await response.json();

    // Si la respuesta es un objeto único, convertirlo en array
    if (!Array.isArray(equipos)) {
      equipos = [equipos];
    }

    renderEquipos(equipos);
  } catch (error) {
    console.error('Error:', error);
    showToast('Error al cargar los datos. No hay equipos disponibles.', 'danger');

    // Dejar equipos como un array vacío
    equipos = [];
    renderEquipos(equipos);
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
  modelos.forEach(modelo => {
    const option = document.createElement('option');
    option.value = modelo.Id_Modelo;
    option.textContent = `${modelo.Nombre} (${modelo.Marca} - ${modelo.Modelo})`;
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

// Función para renderizar los equipos en la tabla
function renderEquipos(data) {
  const tableBody = document.getElementById('equiposTableBody');
  tableBody.innerHTML = '';

  if (data.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `
                <td colspan="6" class="empty-message">No hay equipos disponibles</td>
            `;
    tableBody.appendChild(row);
    return;
  }

  data.forEach(equipo => {
    // Determinar la clase CSS para el estado
    let estadoClass = '';
    switch (equipo.Estado.toLowerCase()) {
      case 'activo':
        estadoClass = 'status-activo';
        break;
      case 'inactivo':
        estadoClass = 'status-inactivo';
        break;
      case 'en mantenimiento':
        estadoClass = 'status-mantenimiento';
        break;
      default:
        estadoClass = '';
    }

    const row = document.createElement('tr');
    row.innerHTML = `
                <td>${equipo.Nombre_Modelo}</td>
                <td>${equipo.Marca}</td>
                <td>${equipo.Modelo}</td>
                <td>${equipo.Frecuencia_mantenimiento} días</td>
                <td><span class="status-badge ${estadoClass}">${equipo.Estado}</span></td>
                <td>
                    <div class="action-btn view-btn" onclick="viewEquipo(${equipo.Id_Equipo})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="action-btn edit-btn" onclick="editEquipo(${equipo.Id_Equipo})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </div>
                    <div class="action-btn delete-btn" onclick="deleteEquipo(${equipo.Id_Equipo})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </div>
                </td>
            `;
    tableBody.appendChild(row);
  });
}

// Función para buscar equipos
function searchEquipos() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  // Filtrar equipos basados en nombre, marca, modelo, estado, etc.
  const filteredEquipos = equipos.filter(equipo =>
    equipo.Nombre_Modelo.toLowerCase().includes(searchTerm) ||
    equipo.Marca.toLowerCase().includes(searchTerm) ||
    equipo.Modelo.toLowerCase().includes(searchTerm) ||
    equipo.Estado.toLowerCase().includes(searchTerm) ||
    equipo.Frecuencia_mantenimiento.toString().includes(searchTerm) ||
    equipo.Numero_de_serie.toLowerCase().includes(searchTerm) ||
    equipo.Area.toLowerCase().includes(searchTerm) ||
    equipo.Ubicacion.toLowerCase().includes(searchTerm)
  );

  renderEquipos(filteredEquipos);
}

// Función para preparar el modal para un nuevo equipo
function prepareNewModelo() {
  document.getElementById('modeloModalLabel').textContent = 'Nuevo Modelo Equipo';
  document.getElementById('modeloForm').reset();
}
// Función para preparar el modal para un nuevo equipo
function prepareNewEquipo() {
  document.getElementById('equipoModalLabel').textContent = 'Nuevo Equipo';
  document.getElementById('equipoForm').reset();
  document.getElementById('equipoId').value = '';
  currentEquipoId = null;

  // Establecer la fecha máxima como hoy
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('fechaInstalacionInput').max = today;

  // Enfoca el primer campo después de que el modal se muestre
  document.getElementById('equipoModal').addEventListener('shown.bs.modal', function () {
    document.getElementById('modeloSelect').focus();
  }, { once: true });
}

// Función para ver detalles de un equipo
function viewEquipo(id) {
  const equipo = equipos.find(e => e.Id_Equipo === id);
  if (equipo) {
    // Formatear la fecha de instalación
    const fechaInstalacion = new Date(equipo.Fecha_Instalacion);
    const fechaFormateada = fechaInstalacion.toISOString().split('T')[0];

    document.getElementById('viewId').textContent = equipo.Id_Equipo;
    document.getElementById('viewNombre').textContent = equipo.Nombre_Modelo;
    document.getElementById('viewMarca').textContent = equipo.Marca;
    document.getElementById('viewModelo').textContent = equipo.Modelo;
    document.getElementById('viewNumeroSerie').textContent = equipo.Numero_de_serie;
    document.getElementById('viewEstado').textContent = equipo.Estado;
    document.getElementById('viewFechaInstalacion').textContent = fechaFormateada;
    document.getElementById('viewFrecuencia').textContent = equipo.Frecuencia_mantenimiento;
    document.getElementById('viewUbicacion').textContent = equipo.Ubicacion;
    document.getElementById('viewArea').textContent = equipo.Area;

    const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
    viewModal.show();
  }
}

// Función para editar un equipo
function editEquipo(id) {
  const equipo = equipos.find(e => e.Id_Equipo === id);
  if (equipo) {
    document.getElementById('equipoModalLabel').textContent = 'Editar Equipo';
    document.getElementById('equipoId').value = equipo.Id_Equipo;
    document.getElementById('modeloSelect').value = equipo.Id_Modelo;
    document.getElementById('ubicacionSelect').value = equipo.Id_Ubicacion;
    document.getElementById('numeroSerieInput').value = equipo.Numero_de_serie;
    document.getElementById('estadoSelect').value = equipo.Estado;
    document.getElementById('frecuenciaInput').value = equipo.Frecuencia_mantenimiento;

    // Formatear la fecha de instalación para el input date
    const fechaInstalacion = new Date(equipo.Fecha_Instalacion);
    const fechaFormateada = fechaInstalacion.toISOString().split('T')[0];
    document.getElementById('fechaInstalacionInput').value = fechaFormateada;

    currentEquipoId = equipo.Id_Equipo;

    const equipoModal = new bootstrap.Modal(document.getElementById('equipoModal'));
    equipoModal.show();
  }
}

// Función para eliminar un equipo
function deleteEquipo(id) {
  const equipo = equipos.find(e => e.Id_Equipo === id);
  if (equipo) {
    document.getElementById('deleteNombre').textContent = equipo.Nombre_Modelo;
    document.getElementById('deleteNumeroSerie').textContent = equipo.Numero_de_serie;
    currentEquipoId = equipo.Id_Equipo;

    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }
}

// Función para confirmar la eliminación
async function confirmDelete() {
  if (currentEquipoId) {
    try {
      const deleteUrl = `${apiUrlEquipo}/${currentEquipoId}`;
      console.log(`Eliminando equipo con ID ${currentEquipoId}. URL: ${deleteUrl}`);

      const response = await fetch(deleteUrl, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el equipo: ${response.status} ${response.statusText}`);
      }

      console.log(`Equipo con ID ${currentEquipoId} eliminado correctamente`);

      // Eliminar de la lista local
      equipos = equipos.filter(e => e.Id_Equipo !== currentEquipoId);
      renderEquipos(equipos);

      // Cerrar el modal
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
      deleteModal.hide();

      // Mostrar mensaje de éxito
      showToast('Equipo eliminado con éxito', 'success');
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al eliminar el equipo: ' + error.message, 'danger');

      // Cerrar el modal
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
      deleteModal.hide();
    }
  }
}
async function saveModelo() {
    const modelo = document.getElementById('modeloInput').value;
    const nombre = document.getElementById('nombreInput').value;
    const marca = document.getElementById('marcaInput').value;
    const codigo = document.getElementById('codigoInput').value;
    const descripcion = document.getElementById('descripcionInput').value;

  
    if (!modelo || !nombre || !marca || !codigo) {
      showToast('Por favor complete todos los campos correctamente', 'warning');
      return;
    }
  
    try {
      let url = apiUrlModelo;
      let method = 'POST';
      let equipoData;
  
      // Si es una edición, usamos PUT y la URL con ID, manteniendo la estructura original
      if (currentEquipoId) {
        url = `${apiUrlEquipo}/${currentEquipoId}`;
        method = 'PUT';
  
        // Estructura original para PUT
        equipoData = {
            Modelo: modelo ,
            Nombre: nombre,
            Descripcion: descripcion ,
            Codigo: codigo ,
            Marca: marca ,
        };
      } else {
        // Estructura nueva para POST
        equipoData = {
            Modelo: modelo ,
            Nombre: nombre,
            Descripcion: descripcion ,
            Codigo: codigo ,
            Marca: marca ,
        };
      }
  
      console.log(`Enviando datos a ${url} con método ${method}:`, equipoData);
  
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(equipoData)
      });
  
      if (!response.ok) {
        throw new Error(`Error al guardar el modelo: ${response.status} ${response.statusText}`);
      }
  
      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);
  
      // Recargar los datos
      await loadModelos();
  
      // Cerrar el modal
      const modeloModal = bootstrap.Modal.getInstance(document.getElementById('modeloModal'));
      modeloModal.hide();
  
      // Mostrar mensaje de éxito
      showToast(currentEquipoId ? 'Equipo actualizado con éxito' : 'Equipo creado con éxito', 'success');
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al guardar el equipo: ' + error.message, 'danger');
  
      // Cerrar el modal
      const modeloModal = bootstrap.Modal.getInstance(document.getElementById('modeloModal'));
      modeloModal.hide();
    }
}

// Función para guardar un equipo (crear o actualizar)
async function saveEquipo() {
  const modeloId = parseInt(document.getElementById('modeloSelect').value);
  const ubicacionId = parseInt(document.getElementById('ubicacionSelect').value);
  const numeroSerie = document.getElementById('numeroSerieInput').value.trim();
  const estado = document.getElementById('estadoSelect').value;
  const fechaInstalacion = document.getElementById('fechaInstalacionInput').value;
  const frecuenciaMantenimiento = parseInt(document.getElementById('frecuenciaInput').value);

  if (isNaN(modeloId) || isNaN(ubicacionId) || !numeroSerie || !estado || !fechaInstalacion || isNaN(frecuenciaMantenimiento)) {
    showToast('Por favor complete todos los campos correctamente', 'warning');
    return;
  }

  try {
    let url = apiUrlEquipo;
    let method = 'POST';
    let equipoData;

    // Si es una edición, usamos PUT y la URL con ID, manteniendo la estructura original
    if (currentEquipoId) {
      url = `${apiUrlEquipo}/${currentEquipoId}`;
      method = 'PUT';

      // Estructura original para PUT
      equipoData = {
        Fecha_Instalacion: fechaInstalacion,
        Estado: estado,
        Frecuencia_mantenimiento: frecuenciaMantenimiento,
        Numero_de_serie: numeroSerie,
        Id_Modelo: modeloId,
        Id_Ubicacion: ubicacionId
      };
    } else {
      // Estructura nueva para POST
      equipoData = {
        FechaInstalacion: fechaInstalacion,
        Estado: estado,
        FrecuenciaMantenimiento: frecuenciaMantenimiento,
        NumeroDeSerie: numeroSerie,
        idModelo: modeloId,
        idUbicacion: ubicacionId
      };
    }

    console.log(`Enviando datos a ${url} con método ${method}:`, equipoData);

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(equipoData)
    });

    if (!response.ok) {
      throw new Error(`Error al guardar el equipo: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Respuesta del servidor:', responseData);

    // Recargar los datos
    await loadEquipos();

    // Cerrar el modal
    const equipoModal = bootstrap.Modal.getInstance(document.getElementById('equipoModal'));
    equipoModal.hide();

    // Mostrar mensaje de éxito
    showToast(currentEquipoId ? 'Equipo actualizado con éxito' : 'Equipo creado con éxito', 'success');
  } catch (error) {
    console.error('Error:', error);
    showToast('Error al guardar el equipo: ' + error.message, 'danger');

    // Cerrar el modal
    const equipoModal = bootstrap.Modal.getInstance(document.getElementById('equipoModal'));
    equipoModal.hide();
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