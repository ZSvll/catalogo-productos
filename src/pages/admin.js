import { logout } from '../services/authService.js';
import { getAllProductsAdmin, createProduct, updateProduct, deleteProduct } from '../services/productService.js';
import { getCategories } from '../services/categoryService.js';
import { uploadMultipleImages } from '../services/uploadService.js';
import { formatPrice } from '../utils/formatPrice.js';
import { invalidateCache } from '../utils/cache.js';

// Estado del panel
const state = {
  products: [],
  categories: [],
  currentView: 'dashboard',
  editingProduct: null,
  pendingImages: [],    // Files nuevos a subir
  existingImages: [],   // URLs ya subidas (edición)
};

export async function initAdminPanel(user) {
  renderLayout(user);
  await loadData();
  renderView('dashboard');
}

// ================================
// LAYOUT
// ================================
function renderLayout(user) {
  document.getElementById('app').innerHTML = `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="admin-sidebar__header">
          <span class="admin-sidebar__title">Panel Admin</span>
          <span class="admin-sidebar__user">${user.email}</span>
        </div>

        <nav class="admin-nav">
          <button class="admin-nav__item admin-nav__item--active" data-view="dashboard">
            <i class="fa-solid fa-gauge"></i> Dashboard
          </button>
          <button class="admin-nav__item" data-view="products">
            <i class="fa-solid fa-box"></i> Productos
          </button>
          <button class="admin-nav__item" data-view="categories">
            <i class="fa-solid fa-tags"></i> Categorías
          </button>
        </nav>

        <div class="admin-sidebar__footer">
          <button class="btn btn--secondary" id="logout-btn" style="width:100%">
            <i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión
          </button>
        </div>
      </aside>

      <main class="admin-main" id="admin-content"></main>
    </div>
  `;

  // Navegación del sidebar
  document.querySelectorAll('.admin-nav__item').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav__item').forEach((b) => b.classList.remove('admin-nav__item--active'));
      btn.classList.add('admin-nav__item--active');
      renderView(btn.dataset.view);
    });
  });

  document.getElementById('logout-btn').addEventListener('click', async () => {
    await logout();
    window.location.href = '/login.html';
  });
}

async function loadData() {
  const [products, categories] = await Promise.all([
    getAllProductsAdmin(),
    getCategories(),
  ]);
  state.products = products;
  state.categories = categories;
}

// ================================
// ROUTER DE VISTAS
// ================================
function renderView(view) {
  state.currentView = view;
  const content = document.getElementById('admin-content');

  switch (view) {
    case 'dashboard': renderDashboard(content); break;
    case 'products':  renderProducts(content);  break;
    case 'categories': renderCategories(content); break;
  }
}

// ================================
// VISTA: DASHBOARD
// ================================
function renderDashboard(container) {
  const total    = state.products.length;
  const active   = state.products.filter((p) => p.active).length;
  const featured = state.products.filter((p) => p.featured).length;
  const noStock  = state.products.filter((p) => Number(p.stock) <= 0).length;

  container.innerHTML = `
    <div class="admin-section-header">
      <h1 class="admin-section-title">Dashboard</h1>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card__icon"><i class="fa-solid fa-box"></i></div>
        <p class="stat-card__value">${total}</p>
        <p class="stat-card__label">Total productos</p>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon"><i class="fa-solid fa-check"></i></div>
        <p class="stat-card__value">${active}</p>
        <p class="stat-card__label">Activos</p>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon"><i class="fa-solid fa-star"></i></div>
        <p class="stat-card__value">${featured}</p>
        <p class="stat-card__label">Destacados</p>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon" style="background:#fee2e2; color:var(--color-danger)">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <p class="stat-card__value">${noStock}</p>
        <p class="stat-card__label">Sin stock</p>
      </div>
    </div>

    <div class="admin-section-header" style="margin-top: var(--space-xl)">
      <h2 class="admin-section-title" style="font-size: var(--font-size-lg)">Accesos rápidos</h2>
    </div>

    <div style="display:flex; gap: var(--space-md); flex-wrap:wrap;">
      <button class="btn btn--primary" id="quick-add-btn">
        <i class="fa-solid fa-plus"></i> Nuevo producto
      </button>
      <a href="/" target="_blank" class="btn btn--secondary">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> Ver sitio público
      </a>
    </div>
  `;

  document.getElementById('quick-add-btn').addEventListener('click', () => {
    document.querySelector('[data-view="products"]').click();
    setTimeout(() => openProductModal(), 100);
  });
}

// ================================
// VISTA: PRODUCTOS
// ================================
function renderProducts(container) {
  const rows = state.products.map((p) => `
    <tr>
      <td>
        <img
          src="${p.images?.[0] || 'https://via.placeholder.com/48'}"
          alt="${p.name}"
          class="admin-table__img"
        />
      </td>
      <td><strong>${p.name}</strong><br/><small style="color:var(--color-text-secondary)">${p.code || ''}</small></td>
      <td>${p.categoryName || '—'}</td>
      <td>${formatPrice(p.price)}</td>
      <td>${p.stock ?? '—'}</td>
      <td>
        <span class="status-badge ${p.active ? 'status-badge--active' : 'status-badge--inactive'}">
          <i class="fa-solid fa-circle" style="font-size:0.5rem"></i>
          ${p.active ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td>
        ${p.featured
          ? '<span class="status-badge status-badge--featured"><i class="fa-solid fa-star"></i> Destacado</span>'
          : '<span style="color:var(--color-text-secondary); font-size:var(--font-size-xs)">—</span>'
        }
      </td>
      <td>
        <div class="admin-table__actions">
          <button class="btn-icon btn-icon--primary" data-action="edit" data-id="${p.id}" title="Editar">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-icon btn-icon--warning" data-action="toggle-active" data-id="${p.id}" title="${p.active ? 'Desactivar' : 'Activar'}">
            <i class="fa-solid fa-${p.active ? 'eye-slash' : 'eye'}"></i>
          </button>
          <button class="btn-icon btn-icon--warning" data-action="toggle-featured" data-id="${p.id}" title="${p.featured ? 'Quitar destacado' : 'Marcar destacado'}">
            <i class="fa-${p.featured ? 'solid' : 'regular'} fa-star"></i>
          </button>
          <button class="btn-icon btn-icon--danger" data-action="delete" data-id="${p.id}" title="Eliminar">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="admin-section-header">
      <h1 class="admin-section-title">Productos</h1>
      <button class="btn btn--primary" id="add-product-btn">
        <i class="fa-solid fa-plus"></i> Nuevo producto
      </button>
    </div>

    <div class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre / Código</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Destacado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${rows.length ? rows : '<tr><td colspan="8" style="text-align:center; padding: 2rem; color:var(--color-text-secondary)">No hay productos aún.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById('add-product-btn').addEventListener('click', () => openProductModal());

  container.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => handleProductAction(btn.dataset.action, btn.dataset.id));
  });
}

async function handleProductAction(action, id) {
  const product = state.products.find((p) => p.id === id);
  if (!product) return;

  switch (action) {
    case 'edit':
      openProductModal(product);
      break;
    case 'toggle-active':
      await updateProduct(id, { active: !product.active });
      await refreshProducts();
      break;
    case 'toggle-featured':
      await updateProduct(id, { featured: !product.featured });
      await refreshProducts();
      break;
    case 'delete':
      openConfirmModal(
        '¿Eliminar producto?',
        `"${product.name}" se eliminará permanentemente. Esta acción no se puede deshacer.`,
        async () => {
          await deleteProduct(id);
          await refreshProducts();
        }
      );
      break;
  }
}

async function refreshProducts() {
  invalidateCache('all-active-products');
  state.products = await getAllProductsAdmin();
  renderView(state.currentView);
}

// ================================
// MODAL DE PRODUCTO
// ================================
function openProductModal(product = null) {
  state.editingProduct = product;
  state.pendingImages = [];
  state.existingImages = product?.images || [];

  const categoriesOptions = state.categories
    .map((c) => `<option value="${c.slug}" data-name="${c.name}" ${product?.categorySlug === c.slug ? 'selected' : ''}>${c.name}</option>`)
    .join('');

  const existingImagesHTML = state.existingImages
    .map((url, i) => `
      <div class="image-preview-item" data-existing-index="${i}">
        <img src="${url}" alt="Imagen ${i + 1}" />
        <button class="image-preview-item__remove" data-remove-existing="${i}" type="button" title="Eliminar imagen">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>`)
    .join('');

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'product-modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">${product ? 'Editar producto' : 'Nuevo producto'}</h2>
        <button class="btn-icon" id="close-modal-btn" type="button" aria-label="Cerrar">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="modal__body">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nombre del producto</label>
            <input type="text" id="p-name" class="form-input" value="${product?.name || ''}" placeholder="Ej: Camisa Oxford" />
          </div>
          <div class="form-group">
            <label class="form-label">Código</label>
            <input type="text" id="p-code" class="form-input" value="${product?.code || ''}" placeholder="Ej: CAM-001" />
          </div>
          <div class="form-group">
            <label class="form-label">Precio (USD)</label>
            <input type="number" id="p-price" class="form-input" value="${product?.price || ''}" min="0" step="0.01" placeholder="0.00" />
          </div>
          <div class="form-group">
            <label class="form-label">Stock</label>
            <input type="number" id="p-stock" class="form-input" value="${product?.stock || ''}" min="0" placeholder="0" />
          </div>
          <div class="form-group form-grid--full">
            <label class="form-label">Categoría</label>
            <select id="p-category" class="form-input">
              <option value="">— Selecciona una categoría —</option>
              ${categoriesOptions}
            </select>
          </div>
          <div class="form-group form-grid--full">
            <label class="form-label">Descripción</label>
            <textarea id="p-description" class="form-input" rows="4" placeholder="Descripción detallada del producto...">${product?.description || ''}</textarea>
          </div>
        </div>

        <!-- Imágenes -->
        <div>
          <label class="form-label" style="margin-bottom: var(--space-sm)">Imágenes del producto</label>

          <div class="image-upload-area" id="upload-area">
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <p>Arrastra imágenes aquí o haz clic para seleccionar</p>
            <small>JPG, PNG o WebP — máx. 5MB por imagen</small>
            <input type="file" id="p-images" accept="image/*" multiple hidden />
          </div>

          <div class="image-previews" id="image-previews">
            ${existingImagesHTML}
          </div>
        </div>
      </div>

      <div class="modal__footer">
        <button class="btn btn--secondary" id="cancel-modal-btn" type="button">Cancelar</button>
        <button class="btn btn--primary" id="save-product-btn" type="button">
          <i class="fa-solid fa-floppy-disk"></i>
          ${product ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  attachModalEvents();
}

function attachModalEvents() {
  const overlay = document.getElementById('product-modal-overlay');
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('p-images');
  const previews = document.getElementById('image-previews');

  // Cerrar modal
  document.getElementById('close-modal-btn').addEventListener('click', closeModal);
  document.getElementById('cancel-modal-btn').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  // Click en área de upload
  uploadArea.addEventListener('click', () => fileInput.click());

  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('image-upload-area--dragover');
  });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('image-upload-area--dragover'));
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('image-upload-area--dragover');
    handleNewFiles(Array.from(e.dataTransfer.files));
  });

  // Selección de archivos
  fileInput.addEventListener('change', () => handleNewFiles(Array.from(fileInput.files)));

  // Eliminar imagen existente
  previews.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-remove-existing]');
    if (removeBtn) {
      const index = Number(removeBtn.dataset.removeExisting);
      state.existingImages.splice(index, 1);
      renderPreviews();
    }

    const removePendingBtn = e.target.closest('[data-remove-pending]');
    if (removePendingBtn) {
      const index = Number(removePendingBtn.dataset.removePending);
      state.pendingImages.splice(index, 1);
      renderPreviews();
    }
  });

  // Guardar
  document.getElementById('save-product-btn').addEventListener('click', saveProduct);
}

function handleNewFiles(files) {
  const valid = files.filter((f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
  state.pendingImages.push(...valid);
  renderPreviews();
}

function renderPreviews() {
  const container = document.getElementById('image-previews');

  const existingHTML = state.existingImages.map((url, i) => `
    <div class="image-preview-item">
      <img src="${url}" alt="Imagen existente ${i + 1}" />
      <button class="image-preview-item__remove" data-remove-existing="${i}" type="button">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>`).join('');

  const pendingHTML = state.pendingImages.map((file, i) => {
    const objectUrl = URL.createObjectURL(file);
    return `
      <div class="image-preview-item">
        <img src="${objectUrl}" alt="Nueva imagen ${i + 1}" />
        <button class="image-preview-item__remove" data-remove-pending="${i}" type="button">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>`;
  }).join('');

  container.innerHTML = existingHTML + pendingHTML;
}

async function saveProduct() {
  const saveBtn = document.getElementById('save-product-btn');
  const categorySelect = document.getElementById('p-category');
  const selectedOption = categorySelect.options[categorySelect.selectedIndex];

  const name = document.getElementById('p-name').value.trim();
  const price = parseFloat(document.getElementById('p-price').value);

  if (!name) { alert('El nombre es obligatorio.'); return; }
  if (isNaN(price) || price < 0) { alert('El precio no es válido.'); return; }
  if (!categorySelect.value) { alert('Selecciona una categoría.'); return; }

  saveBtn.disabled = true;
  saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

  try {
    // Subir imágenes nuevas a Cloudinary
    let newImageUrls = [];
    if (state.pendingImages.length > 0) {
      newImageUrls = await uploadMultipleImages(state.pendingImages);
    }

    const allImages = [...state.existingImages, ...newImageUrls];

    const data = {
      name,
      code: document.getElementById('p-code').value.trim(),
      price,
      stock: parseInt(document.getElementById('p-stock').value) || 0,
      categorySlug: categorySelect.value,
      categoryName: selectedOption.dataset.name || selectedOption.text,
      description: document.getElementById('p-description').value.trim(),
      images: allImages,
    };

    if (state.editingProduct) {
      await updateProduct(state.editingProduct.id, data);
    } else {
      await createProduct(data);
    }

    closeModal();
    await refreshProducts();
  } catch (error) {
    console.error('Error al guardar producto:', error);
    alert('Error al guardar el producto. Revisa la consola para más detalles.');
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> ${state.editingProduct ? 'Guardar cambios' : 'Crear producto'}`;
  }
}

function closeModal() {
  document.getElementById('product-modal-overlay')?.remove();
  state.pendingImages = [];
  state.existingImages = [];
  state.editingProduct = null;
}

// ================================
// MODAL DE CONFIRMACIÓN
// ================================
function openConfirmModal(title, message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'confirm-modal-overlay';
  overlay.innerHTML = `
    <div class="modal confirm-modal">
      <div class="modal__body">
        <div class="confirm-modal__icon">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h2 class="modal__title" style="margin-bottom: var(--space-sm)">${title}</h2>
        <p style="color: var(--color-text-secondary)">${message}</p>
      </div>
      <div class="modal__footer" style="justify-content: center;">
        <button class="btn btn--secondary" id="confirm-cancel-btn">Cancelar</button>
        <button class="btn" style="background: var(--color-danger); color: #fff;" id="confirm-ok-btn">
          <i class="fa-solid fa-trash"></i> Eliminar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('confirm-cancel-btn').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  document.getElementById('confirm-ok-btn').addEventListener('click', async () => {
    overlay.remove();
    await onConfirm();
  });
}

// ================================
// VISTA: CATEGORÍAS
// ================================
function renderCategories(container) {
  const rows = state.categories.map((c) => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td><code style="background:var(--color-bg-secondary); padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); font-size: var(--font-size-xs)">${c.slug}</code></td>
      <td>
        <button class="btn-icon btn-icon--danger" data-delete-cat="${c.id}" title="Eliminar categoría">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="admin-section-header">
      <h1 class="admin-section-title">Categorías</h1>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl); align-items: start;">

      <div>
        <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--space-md)">Agregar categoría</h2>
        <div class="form-group" style="margin-bottom: var(--space-md)">
          <label class="form-label">Nombre</label>
          <input type="text" id="cat-name" class="form-input" placeholder="Ej: Electrónica" />
        </div>
        <div class="form-group" style="margin-bottom: var(--space-md)">
          <label class="form-label">Slug (identificador único)</label>
          <input type="text" id="cat-slug" class="form-input" placeholder="Ej: electronica" />
          <small style="color:var(--color-text-secondary); font-size: var(--font-size-xs)">
            Solo letras minúsculas, números y guiones. Se genera automáticamente.
          </small>
        </div>
        <button class="btn btn--primary" id="add-cat-btn">
          <i class="fa-solid fa-plus"></i> Agregar categoría
        </button>
        <p id="cat-feedback" style="margin-top: var(--space-sm); font-size: var(--font-size-sm)"></p>
      </div>

      <div>
        <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--space-md)">Categorías existentes</h2>
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Slug</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length ? rows : '<tr><td colspan="3" style="text-align:center; padding: 1.5rem; color:var(--color-text-secondary)">No hay categorías.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Auto-generar slug desde el nombre
  const nameInput = document.getElementById('cat-name');
  const slugInput = document.getElementById('cat-slug');

  nameInput.addEventListener('input', () => {
    slugInput.value = nameInput.value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  });

  document.getElementById('add-cat-btn').addEventListener('click', addCategory);

  container.querySelectorAll('[data-delete-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.deleteCat;
      const cat = state.categories.find((c) => c.id === id);
      openConfirmModal(
        '¿Eliminar categoría?',
        `La categoría "${cat?.name}" se eliminará. Los productos que la usen no serán afectados.`,
        async () => {
          const { deleteDoc, doc } = await import('firebase/firestore');
          const { db } = await import('../services/firebaseConfig.js');
          await deleteDoc(doc(db, 'categories', id));
          invalidateCache('categories');
          state.categories = await getCategories();
          renderView('categories');
        }
      );
    });
  });
}

async function addCategory() {
  const name = document.getElementById('cat-name').value.trim();
  const slug = document.getElementById('cat-slug').value.trim();
  const feedback = document.getElementById('cat-feedback');

  if (!name || !slug) {
    feedback.textContent = 'El nombre y el slug son obligatorios.';
    feedback.style.color = 'var(--color-danger)';
    return;
  }

  if (state.categories.some((c) => c.slug === slug)) {
    feedback.textContent = 'Ya existe una categoría con ese slug.';
    feedback.style.color = 'var(--color-danger)';
    return;
  }

  try {
    const { addDoc, collection } = await import('firebase/firestore');
    const { db } = await import('../services/firebaseConfig.js');
    await addDoc(collection(db, 'categories'), { name, slug });
    invalidateCache('categories');
    state.categories = await getCategories();
    renderView('categories');
  } catch (error) {
    feedback.textContent = 'Error al crear la categoría.';
    feedback.style.color = 'var(--color-danger)';
  }
}