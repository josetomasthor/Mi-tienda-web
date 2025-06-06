// --------------------- GENERACIÓN DE PRODUCTOS ---------------------
const productos = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  nombre: `Producto ${i + 1}`,
  descripcion: 'Descripción breve del producto.',
  categoria: ['Hombre', 'Mujer', 'Niños'][i % 3],
  imagen: i === 0 ? 'imagen/imagen1.jpg' : `imagen/producto${i + 1}.jpg`,
  precio: (Math.random() * 50 + 10).toFixed(2)
}));


const productosPorPagina = 10;
let paginaActual = 1;
let filtro = '';
let busqueda = '';
const carrito = [];

// --------------------- ELEMENTOS DOM ---------------------
const contenedorProductos = document.getElementById('contenedor-productos');
const paginacion = document.getElementById('paginacion');
const filtroCategoria = document.getElementById('filtro-categoria');
const campoBusqueda = document.getElementById('buscador');
const contadorCarrito = document.getElementById('contador-carrito');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const userDisplay = document.getElementById('userDisplay');
const cerrarSesionBtn = document.getElementById('cerrarSesion');
const mensajeBienvenida = document.getElementById('mensajeBienvenida');
const btnIrCatalogo = document.getElementById('btnIrCatalogo');

// --------------------- FILTROS ---------------------
function filtrarProductos() {
  return productos.filter(p => {
    const coincideCategoria = !filtro || p.categoria === filtro;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });
}

// --------------------- MOSTRAR PRODUCTOS ---------------------
function mostrarProductos() {
  contenedorProductos.innerHTML = '';
  const filtrados = filtrarProductos();
  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = filtrados.slice(inicio, fin);

  if (productosPagina.length === 0) {
    contenedorProductos.innerHTML = '<p class="text-center">No se encontraron productos.</p>';
    return;
  }

  productosPagina.forEach(producto => {
    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.innerHTML = `
      <article class="card h-100 shadow">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">${producto.descripcion}</p>
          <span class="badge bg-secondary">${producto.categoria}</span>
          <p class="mt-2"><strong>${parseInt(producto.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</strong></p>
          <button class="btn btn-outline-primary mt-2" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        </div>
      </article>
    `;
    contenedorProductos.appendChild(card);
  });
}

// --------------------- PAGINACIÓN ---------------------
function mostrarPaginacion() {
  paginacion.innerHTML = '';
  const totalPaginas = Math.ceil(filtrarProductos().length / productosPorPagina);

  for (let i = 1; i <= totalPaginas; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === paginaActual ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener('click', (e) => {
      e.preventDefault();
      paginaActual = i;
      mostrarProductos();
      mostrarPaginacion();
    });
    paginacion.appendChild(li);
  }
}

// --------------------- CARRITO ---------------------
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  actualizarCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function actualizarCarrito() {
  contadorCarrito.textContent = carrito.length;
  listaCarrito.innerHTML = '';
  let total = 0;

  carrito.forEach((p, index) => {
    total += parseFloat(p.precio);
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';
    item.innerHTML = `
      <div>${p.nombre} <span class="text-muted">($${p.precio})</span></div>
      <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">Eliminar</button>
    `;
    listaCarrito.appendChild(item);
  });

  totalCarrito.textContent = `$${total.toFixed(2)}`;
}

// --------------------- FILTRO Y BUSQUEDA ---------------------
filtroCategoria.addEventListener('change', e => {
  filtro = e.target.value;
  paginaActual = 1;
  mostrarProductos();
  mostrarPaginacion();
});

campoBusqueda.addEventListener('input', e => {
  busqueda = e.target.value;
  paginaActual = 1;
  mostrarProductos();
  mostrarPaginacion();
});

// --------------------- LOGIN PROFESIONAL ---------------------
const formLogin = document.getElementById('formLogin');

if (formLogin) {
  formLogin.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();

    const emailRegex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      alert('Por favor ingresa un correo electrónico válido.');
      return;
    }

    localStorage.setItem('usuario', email);

    if (mensajeBienvenida) {
      mensajeBienvenida.textContent = `Hola ${email}, gracias por iniciar sesión.`;
    }

    const modal = new bootstrap.Modal(document.getElementById('modalBienvenida'));
    modal.show();

    if (userDisplay) userDisplay.innerHTML = `👤 ${email}`;
    if (cerrarSesionBtn) cerrarSesionBtn.classList.remove('d-none');

    formLogin.reset();
  });
}

// --------------------- SESIÓN ACTIVA ---------------------
if (localStorage.getItem('usuario') && userDisplay) {
  userDisplay.innerHTML = `👤 ${localStorage.getItem('usuario')}`;
  if (cerrarSesionBtn) cerrarSesionBtn.classList.remove('d-none');
}

if (cerrarSesionBtn) {
  cerrarSesionBtn.addEventListener('click', () => {
    localStorage.removeItem('usuario');
    location.reload();
  });
}

// --------------------- MODAL Y SCROLL ---------------------
if (btnIrCatalogo) {
  btnIrCatalogo.addEventListener('click', (e) => {
    e.preventDefault();
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalBienvenida'));
    modal.hide();
    setTimeout(() => {
      document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
    }, 300);
  });
}

function cerrarModalYIrACatalogo() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('modalBienvenida'));
  modal.hide();
  setTimeout(() => {
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
  }, 300);
}

// --------------------- INICIALIZACIÓN ---------------------
mostrarProductos();
mostrarPaginacion();
