const notesList = document.getElementById("notesList");
const noteDialog = document.getElementById("noteDialog");
const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");

let notes = [];

// Polyfill para <dialog> en navegadores que no lo soportan
if (!noteDialog.showModal) {
  dialogPolyfill.registerDialog(noteDialog);
}

// Abrir modal desde FAB o BottomNav
document.getElementById("fabAdd").addEventListener("click", () => noteDialog.showModal());
document.getElementById("bottomAdd").addEventListener("click", () => noteDialog.showModal());

// Cerrar modal
noteDialog.querySelector(".close").addEventListener("click", () => noteDialog.close());

// Cargar notas
document.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("notes");
  notes = stored ? JSON.parse(stored) : [];
  renderNotes();
});

// Guardar nota
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();

  if (!title || !content) {
    alert("No se permiten notas vacías");
    return;
  }

  const newNote = { id: Date.now(), title, content };
  notes.unshift(newNote);
  saveNotes();
  renderNotes();

  noteForm.reset();
  noteDialog.close();
});

// Guardar en localStorage
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Renderizar notas
function renderNotes() {
  notesList.innerHTML = "";
  notes.forEach(note => {
    const card = document.createElement("div");
    card.className = "mdl-card mdl-shadow--2dp";

    card.innerHTML = `
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">${note.title}</h2>
      </div>
      <div class="mdl-card__supporting-text">
        ${note.content}
      </div>
      <div class="mdl-card__actions mdl-card--border">
        <button class="mdl-button mdl-js-button mdl-button--accent delete-btn">Eliminar</button>
      </div>
    `;

    card.querySelector(".delete-btn").addEventListener("click", () => {
      notes = notes.filter(n => n.id !== note.id);
      saveNotes();
      renderNotes();
    });

    notesList.appendChild(card);
  });
}

window.addEventListener('load', async () => {
    await Notification.requestPermission();
    if('serviceWorker' in navigator) {
        const res = await navigator.serviceWorker.register('/sw.js');
        if(res){
            const ready = await navigator.serviceWorker.ready;
            ready.showNotification("Notes",{
                body: "La aplicacion se ha instalado correctamente",
                icon: "icons/icon-144x144.png",
                vibrate: [100, 50, 200]
            });
        }
    }
});