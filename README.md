# 🏨 Frontend Hotel - Panel de Administración

Bienvenido al repositorio del Frontend del Sistema de Gestión de Hotel. Esta aplicación es una **SPA (Single Page Application)** construida con **Angular**, diseñada para consumir la API de nuestro backend en FastAPI y gestionar las reservas, habitaciones y clientes de manera fluida y moderna.

---

## 🎨 Tecnologías Utilizadas

* **Framework:** Angular (con TypeScript).
* **Estilos:** SCSS (Sass) para una escritura de CSS modular y anidada.
* **Integración Backend:** HttpClient para consumo de la API RESTful (FastAPI + PostgreSQL).

---

## 🚀 Requisitos Previos

Antes de ejecutar este proyecto en tu computadora, asegúrate de tener instalado:

1. **Node.js** (Versión 22 ).
2. **Angular CLI** (La interfaz de línea de comandos de Angular). Si no lo tienes, instálalo globalmente abriendo tu terminal y ejecutando:
   > npm install -g @angular/cli

---

## ⚙️ Instalación y Configuración Paso a Paso

Sigue estos pasos para levantar la interfaz gráfica en tu entorno local.

### 1. Clonar el repositorio
Abre tu terminal y clona este proyecto:
> git clone <URL_DE_ESTE_REPOSITORIO>
> cd fronted_angular

### 2. Instalar las dependencias
Angular necesita descargar todas las librerías necesarias que están declaradas en el archivo `package.json`. Ejecuta:
> npm install

### 3. Levantar el Servidor de Desarrollo
Una vez instaladas las dependencias, inicia el servidor local de Angular ejecutando:
> ng serve

Si todo está correcto, la terminal te indicará que la aplicación se compiló con éxito. Abre tu navegador web e ingresa a:
👉 **http://localhost:4200/**

---

## 🔌 Conexión con el Backend (FastAPI)

Para que este frontend funcione correctamente, necesita que el backend esté corriendo simultáneamente en tu computadora.

1. Asegúrate de levantar el servidor del backend en Python (por defecto estará en `http://127.0.0.1:8000`).
2. Los servicios de este proyecto de Angular están configurados para hacer peticiones HTTP a esa dirección local. Si tu backend cambia de puerto, recuerda actualizar las rutas de tus servicios en Angular.

---

## 📂 Arquitectura y Estructura de Carpetas

A medida que el proyecto crezca, mantendremos esta estructura dentro de la carpeta `src/app/` para tener el código limpio y escalable:

* **`components/`**: Componentes visuales reutilizables (botones, tarjetas, modales, tablas).
* **`pages/`**: Vistas completas o pantallas principales (Home, Panel de Reservas, Inventario).
* **`services/`**: Clases que se comunican exclusivamente con el backend (peticiones HTTP GET, POST, PUT, DELETE).
* **`models/`**: Interfaces de TypeScript que definen la estructura exacta de los datos (ej. cómo luce una Habitación o una Reserva).
* **`app.routes.ts`**: Archivo central donde se definen las rutas y URLs del navegador.
* **`app.component.ts`**: El componente raíz que envuelve toda la aplicación.

Fuera de `app/` encontrarás:
* **`assets/`**: Imágenes estáticas, íconos y fuentes del proyecto.
* **`styles.scss`**: Hoja de estilos global. Aquí van las variables maestras de diseño.
* **`index.html`**: El único archivo HTML real de todo el proyecto.

---

## 🛠️ Comandos Útiles de Angular CLI

Si necesitas crear nuevos elementos, usa la terminal para generarlos rápidamente con la estructura correcta:

* **Crear un componente:** `ng generate component nombre` (o `ng g c nombre`)
* **Crear un servicio:** `ng generate service nombre` (o `ng g s nombre`)
* **Crear una interfaz (modelo):** `ng generate interface nombre` (o `ng g i nombre`)
