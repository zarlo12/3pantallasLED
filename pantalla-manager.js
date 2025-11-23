import {
  db,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "./firebase-config.js";

class PantallaManager {
  constructor(pantallaNumber) {
    this.pantallaNumber = pantallaNumber;
    this.imagenes = [];
    this.currentIndex = 0;
    this.isChanging = false;
    this.rotationInterval = null;
    this.isInitialized = false;

    this.init();
  }

  init() {
    // Escuchar cambios en la base de datos en tiempo real
    const q = query(
      collection(db, "datosPantallasBank"),
      orderBy("fecha_creacion", "asc")
    );

    onSnapshot(q, (snapshot) => {
      this.imagenes = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Solo agregar imágenes que tengan URL y no estén ocultas
        if (data.img_url && !data.oculto) {
          this.imagenes.push({
            id: doc.id,
            url: data.img_url,
            nombre: data.nombre,
            frase: data.frase,
            ciudad: data.ciudad,
            fecha: data.fecha,
          });
        }
      });

      console.log(
        `Pantalla ${this.pantallaNumber}: ${this.imagenes.length} imágenes cargadas`
      );

      // Solo iniciar rotación la primera vez
      if (this.imagenes.length > 0 && !this.isInitialized) {
        this.isInitialized = true;
        this.currentIndex = 0;
        this.startRotation();
      }
      // Si ya está inicializado, solo actualizar la lista sin reiniciar
      else if (this.imagenes.length > 0) {
        console.log(
          `Pantalla ${this.pantallaNumber}: Lista actualizada, manteniendo rotación`
        );
      }
    });
  }

  startRotation() {
    if (this.imagenes.length === 0) return;

    // Calcular el delay inicial basado en el número de pantalla
    // Pantalla 1: 0ms, Pantalla 2: 5000ms, Pantalla 3: 10000ms
    const initialDelay = (this.pantallaNumber - 1) * 5000;

    // Mostrar la primera imagen después del delay inicial
    setTimeout(() => {
      this.showCurrentImage();
      this.scheduleNextImage();
    }, initialDelay);
  }

  showCurrentImage() {
    if (this.imagenes.length === 0) return;

    const imagen = this.imagenes[this.currentIndex];
    const imgElement = document.getElementById("main-image");
    const infoElement = document.getElementById("image-info");

    // Fade out
    imgElement.style.opacity = "0";

    setTimeout(() => {
      imgElement.src = imagen.url;
      imgElement.alt = imagen.nombre;

      // Actualizar información (opcional)
      if (infoElement) {
        infoElement.innerHTML = `
          <div class="info-item"><strong>Nombre:</strong> ${imagen.nombre}</div>
          <div class="info-item"><strong>Ciudad:</strong> ${imagen.ciudad}</div>
          <div class="info-item"><strong>Frase:</strong> ${imagen.frase}</div>
        `;
      }

      // Fade in
      imgElement.style.opacity = "1";

      console.log(
        `Pantalla ${this.pantallaNumber}: Mostrando imagen ${
          this.currentIndex + 1
        }/${this.imagenes.length} - ${imagen.nombre}`
      );
    }, 500);
  }

  scheduleNextImage() {
    // Limpiar intervalo anterior si existe
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }

    // Cambiar cada 5 segundos
    this.rotationInterval = setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  nextImage() {
    if (this.imagenes.length === 0) return;

    this.currentIndex = (this.currentIndex + 1) % this.imagenes.length;
    this.showCurrentImage();
  }
}

// Obtener el número de pantalla desde el parámetro URL o el atributo data
const urlParams = new URLSearchParams(window.location.search);
const pantallaNumber =
  parseInt(urlParams.get("pantalla")) ||
  parseInt(document.body.getAttribute("data-pantalla")) ||
  1;

// Inicializar el manager de la pantalla
const manager = new PantallaManager(pantallaNumber);
