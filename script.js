// Variable para rastrear el índice del producto que se va a editar
let indiceProductoAEditar = -1;

// Función para manejar el envío del formulario de precios
document
  .getElementById("precioForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Obtener valores de los campos
    const nombre = document.getElementById("nombre").value;
    const unidades = parseInt(document.getElementById("unidades").value);
    const costo = parseFloat(document.getElementById("costo").value);

    // Crear un objeto con los datos
    const precio = {
      nombre: nombre,
      unidades: unidades,
      costo: costo,
    };

    // Obtener la lista actual de precios desde el Local Storage
    let listaPrecios =
      JSON.parse(localStorage.getItem("listaPrecios")) || [];

    // Agregar el nuevo precio a la lista
    listaPrecios.push(precio);

    // Guardar la lista actualizada en el Local Storage
    localStorage.setItem("listaPrecios", JSON.stringify(listaPrecios));

    // Limpiar el formulario
    document.getElementById("precioForm").reset();

    // Actualizar la lista de precios en la página
    mostrarPrecios();
  });

// Función para mostrar la lista de precios en la página
function mostrarPrecios() {
  const listaPrecios =
    JSON.parse(localStorage.getItem("listaPrecios")) || [];
  const listaPreciosElement = document.getElementById("listaPrecios");

  // Limpiar la lista actual
  listaPreciosElement.innerHTML = "";

  // Mostrar cada precio en la lista
  listaPrecios.forEach(function (precio, index) {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.innerHTML = `
        <strong>${precio.nombre}</strong> - Unidades: ${precio.unidades}, Costo Unitario: ${precio.costo} pesos chilenos
        <button type="button" class="btn btn-warning btn-sm float-right editar-producto" data-indice="${index}">Editar</button>`;
    listaPreciosElement.appendChild(listItem);
  });

  // Actualizar opciones de productos en el formulario de ventas y de edición
  actualizarOpcionesProductos();
}

// Función para actualizar las opciones de productos en el formulario de ventas y de edición
function actualizarOpcionesProductos() {
  const listaPrecios =
    JSON.parse(localStorage.getItem("listaPrecios")) || [];
  const productoSelect = document.getElementById("producto");
  const editProductoSelect = document.getElementById("editNombre");

  // Limpiar las opciones actuales
  productoSelect.innerHTML = "";
  editProductoSelect.innerHTML = "";

  // Agregar opciones basadas en los precios guardados
  listaPrecios.forEach(function (precio, index) {
    const option = document.createElement("option");
    option.value = index;
    option.text = precio.nombre;
    productoSelect.appendChild(option);

    const editOption = document.createElement("option");
    editOption.value = index;
    editOption.text = precio.nombre;
    editProductoSelect.appendChild(editOption);
  });
}

// Escuchar eventos de clic en los botones "Editar"
document
  .getElementById("listaPrecios")
  .addEventListener("click", function (e) {
    if (e.target.classList.contains("editar-producto")) {
      const indice = e.target.getAttribute("data-indice");
      if (indice !== null) {
        // Mostrar el modal de edición con los datos del producto seleccionado
        indiceProductoAEditar = parseInt(indice);
        const productoAEditar = JSON.parse(
          localStorage.getItem("listaPrecios")
        )[indiceProductoAEditar];
        document.getElementById("editNombre").value =
          productoAEditar.nombre;
        document.getElementById("editUnidades").value =
          productoAEditar.unidades;
        document.getElementById("editCosto").value =
          productoAEditar.costo;
        $("#editarProductoModal").modal("show");
      }
    }
  });

// Función para guardar los cambios al editar un producto
document
  .getElementById("guardarEdicion")
  .addEventListener("click", function () {
    const nombreEditado = document.getElementById("editNombre").value;
    const unidadesEditadas = parseInt(
      document.getElementById("editUnidades").value
    );
    const costoEditado = parseFloat(
      document.getElementById("editCosto").value
    );

    // Obtener la lista actual de precios desde el Local Storage
    let listaPrecios =
      JSON.parse(localStorage.getItem("listaPrecios")) || [];

    // Actualizar los datos del producto editado
    listaPrecios[indiceProductoAEditar].nombre = nombreEditado;
    listaPrecios[indiceProductoAEditar].unidades = unidadesEditadas;
    listaPrecios[indiceProductoAEditar].costo = costoEditado;

    // Guardar la lista actualizada en el Local Storage
    localStorage.setItem("listaPrecios", JSON.stringify(listaPrecios));

    // Ocultar el modal de edición
    $("#editarProductoModal").modal("hide");

    // Actualizar la lista de precios en la página
    mostrarPrecios();
  });

// Escuchar el evento de clic en el botón "Calcular Venta"
document
  .getElementById("calcularVenta")
  .addEventListener("click", function () {
    // Obtener datos del formulario de venta
    const productoIndex = parseInt(
      document.getElementById("producto").value
    );
    const cantidadPacks = parseInt(
      document.getElementById("cantidad").value
    );
    const margenGanancia = parseFloat(
      document.getElementById("margen").value
    );

    // Obtener la lista de precios
    const listaPrecios =
      JSON.parse(localStorage.getItem("listaPrecios")) || [];

    // Obtener el producto seleccionado
    const productoSeleccionado = listaPrecios[productoIndex];

    // Calcular el total de la venta
    const costoUnitario = productoSeleccionado.costo;
    const unidadesPorPack = productoSeleccionado.unidades;
    const costoTotal = cantidadPacks * unidadesPorPack * costoUnitario;
    const margenTotal = (costoTotal * margenGanancia) / 100;
    const totalVenta = costoTotal + margenTotal;

    // Formatear el total de la venta a pesos chilenos
    const formatoTotalVenta = new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(totalVenta);

    // Formatear el costo total a pesos chilenos
    const formatoCostoTotal = new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(costoTotal);

    // Formatear la ganancia total a pesos chilenos
    const formatoMargenTotal = new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(margenTotal);

    // Mostrar el total de la venta y el desglose de costos
    document.getElementById("totalVenta").textContent = formatoTotalVenta;
    const desgloseCostos = document.getElementById("desgloseCostos");
    desgloseCostos.innerHTML = `<li>Costo: ${formatoCostoTotal}</li>`;
    desgloseCostos.innerHTML += `<li>Ganancia: ${formatoMargenTotal}</li>`;
  });

// Función para exportar los datos del localStorage a un archivo JSON
document
  .getElementById("exportarDatos")
  .addEventListener("click", function () {
    const listaPrecios =
      JSON.parse(localStorage.getItem("listaPrecios")) || [];
    const contenidoJSON = JSON.stringify(listaPrecios);
    const blob = new Blob([contenidoJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lista_precios.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

// Función para manejar la importación de datos desde un archivo JSON
document
  .getElementById("botonImportar")
  .addEventListener("click", function () {
    document.getElementById("importarDatos").click();
  });

document
  .getElementById("importarDatos")
  .addEventListener("change", function (e) {
    const archivo = e.target.files[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onload = function (evento) {
        const contenidoJSON = evento.target.result;
        const datosImportados = JSON.parse(contenidoJSON);
        localStorage.setItem(
          "listaPrecios",
          JSON.stringify(datosImportados)
        );
        // Actualizar la lista de precios en la página
        mostrarPrecios();
      };
      lector.readAsText(archivo);
    }
  });

// Mostrar los precios al cargar la página
mostrarPrecios();
