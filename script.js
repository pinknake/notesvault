let userKey = "";
let notes = [];

function enterVault() {
  const usernameInput = document.getElementById("username");
  const username = usernameInput.value.trim();

  if (!username) return alert("Please enter your name.");

  userKey = "vault_" + username.toLowerCase().replace(/\s+/g, "_");
  notes = JSON.parse(localStorage.getItem(userKey)) || [];

  document.getElementById("loginSection").style.display = "none";
  document.getElementById("vault").style.display = "block";
  document.getElementById("userDisplay").innerText = username;

  showNotes();
}

function saveNotes() {
  localStorage.setItem(userKey, JSON.stringify(notes));
  showNotes();
}

function addNote() {
  const noteText = document.getElementById("noteInput").value.trim();
  if (!noteText) return;

  const folder = prompt("📂 Enter folder name (optional):") || "";

  const note = {
    id: Date.now(),
    text: noteText,
    folder,
    time: new Date().toLocaleString()
  };

  notes.unshift(note);
  saveNotes();

  document.getElementById("noteInput").value = "";
}

function showNotes(filtered = notes) {
  const noteList = document.getElementById("noteList");
  noteList.innerHTML = "";

  filtered.forEach((note, i) => {
    const li = document.createElement("li");
    li.className = "note";

    const html = `
      <div class="note-text">${note.text}</div>
      <small>🗂️ ${note.folder || "No Folder"} | 🕒 ${note.time}</small>
      <div class="note-buttons">
        <button onclick="editNote(${note.id})">✏️ Edit</button>
        <button onclick="deleteNote(${note.id})">🗑️ Delete</button>
        <button onclick="copyNote(${i})">📋 Copy</button>
      </div>
    `;

    li.innerHTML = html;
    noteList.appendChild(li);
  });
}

function editNote(id) {
  const note = notes.find(n => n.id === id);
  const newText = prompt("✏️ Edit note:", note.text);
  if (newText !== null) {
    const newFolder = prompt("📂 Edit folder:", note.folder);
    note.text = newText;
    note.folder = newFolder;
    saveNotes();
  }
}

function deleteNote(id) {
  if (!confirm("Delete this note?")) return;
  notes = notes.filter(n => n.id !== id);
  saveNotes();
}

function copyNote(index) {
  navigator.clipboard.writeText(notes[index].text)
    .then(() => alert("📋 Note copied!"))
    .catch(() => alert("❌ Copy failed"));
}

function searchNotes() {
  const q = document.getElementById("search").value.toLowerCase();
  const filtered = notes.filter(n =>
    n.text.toLowerCase().includes(q) ||
    (n.folder && n.folder.toLowerCase().includes(q))
  );
  showNotes(filtered);
}

function exportNotes() {
  const dataStr = JSON.stringify(notes);
  const blob = new Blob([dataStr], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${userKey}_notes.json`;
  a.click();
}

function importNotes() {
  const file = document.getElementById("importFile").files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) return alert("Invalid format");
      notes = imported;
      saveNotes();
    } catch {
      alert("Failed to import file.");
    }
  };
  reader.readAsText(file);
}

