import { createClient }         // load supabase database
  from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://bclcknoxyjvrqqdhoevo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_VFxx1zL_Je9RKEvutGNZmQ_faQeMmtE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const form = document.getElementById("messageForm");
const messagesDiv = document.getElementById("messages");


async function loadMessages() {
  const { data, error } = await supabase        // get all rows (messages) sorted by date/time
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {       // error checking
    console.error(error);
    messagesDiv.textContent = "Could not load messages.";
    return;
  }

  messagesDiv.innerHTML = "";      // clear messages div in page

  for (const message of data) {
    // create a div per message
    const template = document.querySelector("#message-template");
    const div = template.content.cloneNode(true);  

    div.querySelector(".username").textContent = message.username;        // populate div
    div.querySelector(".text").textContent = message.message;
    div.querySelector(".date").textContent =
      new Date(message.created_at).toLocaleString();

    div.querySelector(".copy-button").onclick = () =>
      navigator.clipboard.writeText(message.message);
    div.querySelector(".respond-button").onclick = () => {
      messageDiv.value = "@" + message.username + " ";
      messageDiv.focus();
      messageDiv.setSelectionRange(messageDiv.value.length, messageDiv.value.length);
    };

    messagesDiv.appendChild(div);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();          // don't reload page upon submitting 'form'

  const username = document.getElementById("username").value.trim();    // get name and message
  const message = document.getElementById("message").value.trim();

  if (!username || !message) return;      // no empty messages or name

  const { error } = await supabase    // add message as row to database
    .from("messages")
    .insert({
      username: username,
      message: message
    });

  if (error) {              // error checking
    console.error(error);
    alert("Could not post message.");
    return;
  }

  document.getElementById("message").value = "";       // clear message box (not name)

  await loadMessages();
});

loadMessages();


const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  sidebarToggle.classList.toggle("open");

  // Change the button icon
  if (sidebar.classList.contains("open")) {
    sidebarToggle.textContent = "×";
  } else {
    sidebarToggle.textContent = "☰";
  }
});
