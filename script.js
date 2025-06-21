let userKey = "";
let notes = [];

function enterVault() {
  const usernameInput = document.getElementById("username");
  const username = usernameInput.value.trim();

  if (!username) {
    alert("Please enter your name.");
    return;
  }

  userKey = "vault_" + username.toLowerCase().replace(/\s+/g, "_");
  notes = JSON.parse(localStorage.getItem(userKey)) || [];

  document.getElementById("loginSection").style.display = "none";
  document.getElementById("vault").style.display = "block";
  document.getElementById("userDisplay").innerText = username;

  showNotes();
}

function saveNotes() {
  localStorage.setItem(userKey, JSON.stringify(notes));
}

function addNote() {
  const noteInput = document.getElementById("noteInput");
  const noteText = noteInput.value.trim();

  if (!noteText) return;

  const note = {
    id: Date.now(),
    text: noteText,
    time: new Date().toLocaleString()
  };

  notes.unshift(note);
  saveNotes();
  noteInput.value = "";
  showNotes();
}

function showNotes(filtered = null) {
  const noteList = document.getElementById("noteList");
  noteList.innerHTML = "";

  const displayNotes = filtered || notes;

  displayNotes.forEach((note) => {
    const li = document.createElement("li");
    li.className = "note-item";

    li.innerHTML = `
      <div class="note-text">${note.text}</div>
      <small>🕒 ${note.time}</small>
      <div class="note-buttons">
        <button onclick="editNote(${note.id})">✏️ Edit</button>
        <button onclick="deleteNote(${note.id})">🗑️ Delete</button>
        <button onclick="copyNote('${note.text.replace(/'/g, "\\'")}')">📋 Copy</button>
      </div>
    `;

    noteList.appendChild(li);
  });
}

function editNote(id) {
  const index = notes.findIndex(n => n.id === id);
  if (index === -1) return;

  const newText = prompt("Edit your note:", notes[index].text);
  if (newText !== null && newText.trim()) {
    notes[index].text = newText.trim();
    notes[index].time = new Date().toLocaleString();
    saveNotes();
    showNotes();
  }
}

function deleteNote(id) {
  if (!confirm("Are you sure you want to delete this note?")) return;
  notes = notes.filter(note => note.id !== id);
  saveNotes();
  showNotes();
}

function copyNote(text) {
  navigator.clipboard.writeText(text)
    .then(() => alert("📋 Note copied!"))
    .catch(() => alert("❌ Copy failed"));
}

function searchNotes() {
  const q = document.getElementById("search").value.toLowerCase();
  const filtered = notes.filter(note => note.text.toLowerCase().includes(q));
  showNotes(filtered);
}

function exportNotes() {
  const dataStr = JSON.stringify(notes);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `${userKey}_notes_backup.json`;
  a.click();

  URL.revokeObjectURL(url);
}

function importNotes() {
  const file = document.getElementById("importFile").files[0];
  if (!file) return alert("No file selected");

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        notes = imported;
        saveNotes();
        showNotes();
        alert("✅ Notes imported successfully!");
      } else {
        alert("❌ Invalid file format.");
      }
    } catch {
      alert("❌ Failed to import file.");
    }
  };
  reader.readAsText(file);
}
