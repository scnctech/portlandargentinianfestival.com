// Global variables
let allBusinesses = businessData.businesses;
let filteredBusinesses = allBusinesses;
let categories = [];
let subcategories = {};

// Current day (Thursday)
const currentDay = 'Jueves';

// DOM elements
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const subcategoryFilter = document.getElementById('subcategoryFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const businessGrid = document.getElementById('businessGrid');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');

// Initialize the application
function init() {
    extractCategoriesAndSubcategories();
    populateFilters();
    renderBusinesses(allBusinesses);
    attachEventListeners();
}

// Extract unique categories and subcategories
function extractCategoriesAndSubcategories() {
    categories = [...new Set(allBusinesses.map(business => business.organizacionEnGuia.categoria))];
    
    allBusinesses.forEach(business => {
        const category = business.organizacionEnGuia.categoria;
        const subcategory = business.organizacionEnGuia.subcategoria;
        
        if (!subcategories[category]) {
            subcategories[category] = [];
        }
        
        if (!subcategories[category].includes(subcategory)) {
            subcategories[category].push(subcategory);
        }
    });
}

// Populate filter dropdowns
function populateFilters() {
    // Populate categories
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Update subcategory filter based on selected category
function updateSubcategoryFilter(selectedCategory) {
    subcategoryFilter.innerHTML = '<option value="">Todas las subcategorías</option>';
    
    if (selectedCategory && subcategories[selectedCategory]) {
        subcategories[selectedCategory].forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = subcategory;
            subcategoryFilter.appendChild(option);
        });
    }
}

// Filter businesses based on search and filters
function filterBusinesses() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedSubcategory = subcategoryFilter.value;
    
    filteredBusinesses = allBusinesses.filter(business => {
        const matchesSearch = searchTerm === '' || 
            business.general.nombre.toLowerCase().includes(searchTerm) ||
            business.general.descripcion.toLowerCase().includes(searchTerm);
        
        const matchesCategory = selectedCategory === '' || 
            business.organizacionEnGuia.categoria === selectedCategory;
        
        const matchesSubcategory = selectedSubcategory === '' || 
            business.organizacionEnGuia.subcategoria === selectedSubcategory;
        
        return matchesSearch && matchesCategory && matchesSubcategory;
    });
    
    renderBusinesses(filteredBusinesses);
}

// Render business cards
function renderBusinesses(businesses) {
    updateResultsCount(businesses.length);

    if (businesses.length === 0) {
        businessGrid.style.display = 'none';
        noResults.classList.remove('hidden');
        return;
    }

    businessGrid.style.display = 'grid';
    noResults.classList.add('hidden');

    businessGrid.innerHTML = businesses.map(business => createBusinessCard(business)).join('');
}

// Create HTML for a business card
function createBusinessCard(business) {
    const scheduleHTML = business.ubi.horario?.map(day => {
        const isCurrentDay = day.dia === currentDay;
        const rowClass = isCurrentDay ? 'schedule-row current-day' : 'schedule-row';
        return `<div class="${rowClass}">
                    <div class="schedule-day">${day.dia}:</div>
                    <div class="schedule-hours">${day.apertura === 'Cerrado' ? 'Cerrado' : `${day.apertura} - ${day.cierre}`}</div>
                </div>`;
    }).join('') || '';

    const phonesHTML = business.contacto.telefonos?.map(phone => {
        const phoneNumber = phone.numero.replace(/[^\\d]/g, ''); // Remove non-digits for tel: link
        const displayNumber = `${phone.numero}${phone.extension ? ' ext. ' + phone.extension : ''}`;
        return `<div class="contact-item">
            <span class="contact-type">${phone.tipo}:</span>
            <span class="contact-value">
                <a href="tel:${phoneNumber}" class="url-item">${displayNumber}</a>
            </span>
        </div>`;
    }).join('') || '';

    const urlsHTML = business.urls?.map(url => 
        `<a href="${url.url}" target="_blank" class="url-item">
            <div class="url-item-content">
                <span class="url-description">${url.descripcion}</span>
                <span class="url-link-text">Visitar</span>
            </div>
        </a>`
    ).join('') || '';

    return `
        <div class="business-card">
            ${business.etc.urlImagen ? `<img src="${business.etc.urlImagen}" alt="${business.general.nombre}" class="business-image" />` : ''}
            
            <div class="business-content">
                <div class="business-header">
                    <h2 class="business-name">${business.general.nombre}</h2>
                    <h3 class="business-title">${business.general.titulo}</h3>
                    <p class="business-description">${business.general.descripcion}</p>
                    
                    <div class="business-categories">
                        <span class="category-badge">${business.organizacionEnGuia.categoria}</span>
                        ${business.organizacionEnGuia.subcategoria ? `<span class="subcategory-badge">${business.organizacionEnGuia.subcategoria}</span>` : ''}
                    </div>
                </div>
                
                <div class="business-details">
                    ${business.ubi.direccion ? `<div class="detail-section">
                        <h4 class="detail-title">Dirección</h4>
                        <div class="detail-content">${business.ubi.direccion}</div>
                    </div>` : ''}
                    
                    ${scheduleHTML ? `<div class="detail-section">
                        <h4 class="detail-title">Horarios</h4>
                        <div class="schedule-list">
                            ${scheduleHTML}
                        </div>
                    </div>` : ''}
                    
                    ${(phonesHTML || business.contacto.email) ? `<div class="detail-section">
                        <h4 class="detail-title">Contacto</h4>
                        <div class="contact-list">
                            ${phonesHTML}
                            ${business.contacto.email ? `<div class="contact-item">
                                <span class="contact-type">Email:</span>
                                <span class="contact-value">
                                    <a href="mailto:${business.contacto.email}">${business.contacto.email}</a>
                                </span>
                            </div>` : ''}
                        </div>
                    </div>` : ''}
                    
                    ${urlsHTML ? `<div class="detail-section">
                        <h4 class="detail-title">Enlaces</h4>
                        <div class="urls-list">
                            ${urlsHTML}
                        </div>
                    </div>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Update results count
function updateResultsCount(count) {
    resultsCount.textContent = `Mostrando ${count} de ${allBusinesses.length} negocios`;
}

// Clear all filters
function clearFilters() {
    searchInput.value = '';
    categoryFilter.value = '';
    subcategoryFilter.value = '';
    updateSubcategoryFilter('');
    filteredBusinesses = allBusinesses;
    renderBusinesses(allBusinesses);
}

// Attach event listeners
function attachEventListeners() {
    searchInput.addEventListener('input', filterBusinesses);
    
    categoryFilter.addEventListener('change', function() {
        updateSubcategoryFilter(this.value);
        subcategoryFilter.value = '';
        filterBusinesses();
    });
    
    subcategoryFilter.addEventListener('change', filterBusinesses);
    clearFiltersBtn.addEventListener('click', clearFilters);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);