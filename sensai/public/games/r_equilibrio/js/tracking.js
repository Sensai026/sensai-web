let sessionStart = null;

function startSession() {
  sessionStart = new Date();
}

window.addEventListener("beforeunload", () => {
  if (!sessionStart) return;
  const duration = Math.round((new Date() - sessionStart) / 1000);
  console.log("Duración de sesión:", duration, "segundos");
});
