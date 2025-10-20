document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openBtn");
  const codeBtn = document.getElementById("codeBtn");
  const codeInput = document.getElementById("codeInput");

  openBtn.onclick = () => {
    alert("Open Pack clicked!");
  };

  codeBtn.onclick = () => {
    const code = codeInput.value.trim();
    alert(`Apply Code clicked with input: ${code}`);
  };
});

