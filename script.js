let notes = [];
let userKey = "";

function generateKey(username) {
  const code = Math.random().toString(36).substring(2, 6);
  return `notes_${username}_${code}`;
}

function startVault() {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter your name!");

  let savedKey = localStorage.getItem("user_key_" + username);
  if (!savedKey) {
    savedKey = generateKey(username);
    localStorage.setItem("user_key_" + username, savedKey);
  }

  userKey = savedKey;
  notes = JSON.parse(localStorage.getItem(userKey) || "[]");

  document.getElementById("login").style.display = "none";
  document.getElementById("vault").style.display = "block";
  document.getElementById("welcome").innerText = "Welcome, " + username;
  showNotes();
}

function addNote() {
  const note = document.getElementById("newNote").value.trim();
  if (!note) return;

  notes.push(note);
  localStorage.setItem(userKey, JSON.stringify(notes));
  document.getElementById("newNote").value = "";
  showNotes();
}

function showNotes() {
  const list = document.getElementById("notesList");
  list.innerHTML = "";
  notes.forEach((n, i) => {
    const li = document.createElement("li");
    li.textContent = n;
    li.onclick = () => {
      if (confirm("Delete this note?")) {
        notes.splice(i, 1);
        localStorage.setItem(userKey, JSON.stringify(notes));
        showNotes();
      }
    };
    list.appendChild(li);
  });
}

function filterNotes() {
  const term = document.getElementById("search").value.toLowerCase();
  const list = document.getElementById("notesList").children;
  for (let li of list) {
    li.style.display = li.textContent.toLowerCase().includes(term) ? "block" : "none";
  }
}
