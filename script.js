let userKey = "";
let notes = [];

function enterVault() {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Please enter name");

  userKey = "vault_" + username.toLowerCase().replace(/\s+/g, "_");
  notes = JSON.parse(localStorage.getItem(userKey)) || [];

  if (!Array.isArray(notes)) notes = [];

  document.getElementById("loginSection").style.display = "none";
  document.getElementById("vault").style.display = "block";
  document.getElementById("userDisplay").innerText = username;

  showNotes();
}

function saveNotes() {
  localStorage.setItem(userKey, JSON.stringify(notes));
}

function addNote() {
  const text = document.getElementById("noteInput").value.trim();
  if (!text) return;

  const note = {
    id: Date.now(),
    text,
    time: new Date().toLocaleString()
  };

  notes.unshift(note);
  saveNotes();
  document.getElementById("noteInput").value = "";
  showNotes();
}

function showNotes(list = notes) {
  const noteList = document.getElementById("noteList");
  noteList.innerHTML = "";

  list.forEach(note => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>${note.text}</div>
      <small>${note.time}</small>
      <div>
        <button onclick="editNote(${note.id})">✏️</button>
        <button onclick="deleteNote(${note.id})">🗑️</button>
      </div>
    `;
    noteList.appendChild(li);
  });
}

function editNote(id) {
  const index = notes.findIndex(n => n.id === id);
  if (index !== -1) {
    const newText = prompt("Edit note:", notes[index].text);
    if (newText) {
      notes[index].text = newText;
      notes[index].time = new Date().toLocaleString();
      saveNotes();
      showNotes();
    }
  }
}

function deleteNote(id) {
  if (!confirm("Delete this note?")) return;
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  showNotes();
}

function searchNotes() {
  const q = document.getElementById("search").value.toLowerCase();
  const filtered = notes.filter(n => n.text.toLowerCase().includes(q));
  showNotes(filtered);
}

function exportNotes() {
  const blob = new Blob([JSON.stringify(notes)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${userKey}_notes.json`;
  a.click();
}

function importNotes() {
  const file = document.getElementById("importFile").files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) return alert("Invalid file");
      notes = data;
      saveNotes();
      showNotes();
      alert("✅ Notes imported");
    } catch {
      alert("❌ Import failed");
    }
  };
  reader.readAsText(file);
}
