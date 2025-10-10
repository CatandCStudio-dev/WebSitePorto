const routes = {
    '/': 'src/pages/Home/home.html'
};

const loadPage = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes['/']; // Default to home page

    const response = await fetch(route);
    const html = await response.text();
    document.getElementById('app').innerHTML = html;

    // Load CSS specific to the page
    loadCSS(route.replace('.html', '.css'));
};

const loadCSS = (cssPath) => {
    // Check if the stylesheet is already loaded
    if (!document.querySelector(`link[href="${cssPath}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPath;
        document.head.appendChild(link);
    }
};

// Handle navigation
window.onpopstate = loadPage;
document.addEventListener('DOMContentLoaded', loadPage);