const socket = io();

function renderRows(products) {
  const tbody = document.getElementById("productsTbody");
  if (!tbody) return;

  tbody.innerHTML = products
    .map(
      (p) => `
      <tr data-id="${p.id}">
        <td>${p.id}</td>
        <td>${p.title}</td>
        <td>${p.description ?? ""}</td>
        <td>${p.code ?? ""}</td>
        <td>${p.price}</td>
        <td>${p.stock}</td>
        <td>${p.category ?? ""}</td>
        <td><button class="btn-delete">Eliminar</button></td>
      </tr>
    `
    )
    .join("");

  [...tbody.querySelectorAll(".btn-delete")].forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tr = e.target.closest("tr");
      const id = tr?.dataset?.id;
      if (!id) return;

      socket.emit("deleteProduct", id, (resp) => {
        if (!resp?.ok) alert(resp?.error || "Error al eliminar producto");
      });
    });
  });
}

socket.on("products", (products) => {
  renderRows(products);
});

const form = document.getElementById("createForm");
const msg = document.getElementById("createMsg");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    if (!payload.title?.trim()) {
      msg.textContent = "⚠️ Falta el título";
      return;
    }
    if (!payload.price || isNaN(Number(payload.price))) {
      msg.textContent = "⚠️ Precio inválido";
      return;
    }
    if (!payload.stock || isNaN(Number(payload.stock))) {
      msg.textContent = "⚠️ Stock inválido";
      return;
    }

    payload.price = Number(payload.price);
    payload.stock = Number(payload.stock);
    payload.status = true;
    payload.thumbnails = [];

    socket.emit("createProduct", payload, (resp) => {
      if (resp?.ok) {
        form.reset();
        msg.textContent = "✅ Producto creado";
      } else {
        msg.textContent = resp?.error || "Error al crear producto";
      }
      setTimeout(() => (msg.textContent = ""), 2500);
    });
  });
}
