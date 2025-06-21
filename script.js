// script.js

let notes = JSON.parse(localStorage.getItem("vault_notes")) || [];

function saveNotes() {
  localStorage.setItem("vault_notes", JSON.stringify(notes));
  showNotes();
}

function addNote() {
  const text = document.getElementById("noteInput").value.trim();
  const tags = document.getElementById("tagsInput").value.trim().split(" ").filter(tag => tag.startsWith("#"));
  const folder = document.getElementById("folderInput").value.trim();
  if (!text) return alert("Note can't be empty!");

  const newNote = {
    id: Date.now(),
    text,
    tags,
    folder,
    pinned: false,
    time: new Date().toLocaleString()
  };

  notes.unshift(newNote);
  saveNotes();

  document.getElementById("noteInput").value = "";
  document.getElementById("tagsInput").value = "";
  document.getElementById("folderInput").value = "";
}

function showNotes(filteredNotes = notes) {
  const list = document.getElementById("notesList");
  list.innerHTML = "";

  const pinned = filteredNotes.filter(n => n.pinned);
  const unpinned = filteredNotes.filter(n => !n.pinned);

  const display = [...pinned, ...unpinned];

  display.forEach(note => {
    const li = document.createElement("li");
    li.className = "note";

    const pinBtn = document.createElement("button");
    pinBtn.innerText = note.pinned ? "📌 Unpin" : "📍 Pin";
    pinBtn.onclick = () => togglePin(note.id);

    const tagHTML = note.tags.map(t => `<span class="tag" onclick="filterByTag('${t}')">${t}</span>`).join(" ");

    li.innerHTML = `
      <div class="note-text">${note.text}</div>
      <div><small>🗂️ ${note.folder || 'No Folder'} | 🕒 ${note.time}</small></div>
      <div>${tagHTML}</div>
    `;
    li.appendChild(pinBtn);
    list.appendChild(li);
  });

  updateFolders();
}

function togglePin(id) {
  notes = notes.map(note =>
    note.id === id ? { ...note, pinned: !note.pinned } : note
  );
  saveNotes();
}

function filterByTag(tag) {
  const filtered = notes.filter(note => note.tags.includes(tag));
  showNotes(filtered);
}

function showAll() {
  showNotes();
}

function showPinned() {
  showNotes(notes.filter(note => note.pinned));
}

function updateFolders() {
  const container = document.getElementById("folderList");
  container.innerHTML = "";

  const uniqueFolders = [...new Set(notes.map(n => n.folder).filter(f => f))];
  uniqueFolders.forEach(folder => {
    const btn = document.createElement("button");
    btn.innerText = folder;
    btn.onclick = () => {
      const filtered = notes.filter(n => n.folder === folder);
      showNotes(filtered);
    };
    container.appendChild(btn);
  });
}

function exportNotes() {
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vault_notes_backup.json";
  a.click();
}

function importNotes() {
  const file = document.getElementById("importFile").files[0];
  if (!file) return alert("Choose a file");

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) return alert("Invalid format");

      notes = imported;
      saveNotes();
      alert("Notes imported ✅");
    } catch {
      alert("❌ Failed to import notes.");
    }
  };
  reader.readAsText(file);
}

showNotes(); // Initial call
