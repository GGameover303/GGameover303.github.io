const gifSamples = [
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://media.giphy.com/media/l0HlWm7IsVVfMcF1G/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif"
];

let currentEditingText = "";
let currentGif = "";

function openModal(gifUrl, caption, videoName) {
  document.getElementById("modal-gif").src = gifUrl;
  document.getElementById("modal-title").textContent = videoName;
  document.getElementById("modal-caption").textContent = caption;
  document.getElementById("video-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("video-modal").style.display = "none";
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('expanded');
  sidebar.classList.toggle('collapsed');
}

function showPage(pageId, clickedItem) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.style.display = section.id === pageId ? 'block' : 'none';
  });

  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => item.classList.remove('active'));
  if (clickedItem) clickedItem.classList.add('active');

  if (pageId === "library") {
    renderLibrary();
  }

  if (pageId === "edit") {
    const gifPreview = document.getElementById("edit-preview-gif");
    const placeholder = document.getElementById("edit-placeholder-text");
    const actionBtn = document.getElementById("edit-action-button");

    const hasGif = !!currentGif;

    if (gifPreview && placeholder && actionBtn) {
      gifPreview.style.display = hasGif ? "block" : "none";
      placeholder.style.display = hasGif ? "none" : "block";

      if (hasGif) {
        gifPreview.src = currentGif;
        actionBtn.textContent = "Apply Change";
        actionBtn.style.backgroundColor = "#10b981"; // เขียว
        actionBtn.disabled = false;
        actionBtn.onclick = () => applyChange(); // เชื่อมฟังก์ชัน apply
      } else {
        actionBtn.textContent = "ตกลง";
        actionBtn.style.backgroundColor = "#3b82f6"; // ฟ้า
        actionBtn.disabled = false;
        actionBtn.onclick = () => showPage("generate"); // ย้ายไปหน้า Create
      }
    }
  }
}

function applyChange() {
  const editForm = document.getElementById("edit-form");
  const editLoading = document.getElementById("edit-loading");
  const gifPreview = document.getElementById("edit-preview-gif");
  const placeholder = document.getElementById("edit-placeholder-text");
  const textarea = document.getElementById("generate-input");
  const submitBtn = document.getElementById("generate-submit");

  if (!currentEditingText || !currentGif) return;

  editForm.style.display = "none";
  editLoading.style.display = "flex";

  setTimeout(() => {
    // 1. บันทึกวิดีโอลง localStorage
    const old = JSON.parse(localStorage.getItem("recapVideos") || "[]");
    old.push({ text: currentEditingText, gif: currentGif, created: new Date().toISOString() });
    localStorage.setItem("recapVideos", JSON.stringify(old));

    // 2. Reset ตัวแปร
    currentEditingText = "";
    currentGif = "";

    // 3. Reset หน้า Edit
    if (gifPreview) gifPreview.style.display = "none";
    if (placeholder) placeholder.style.display = "block";

    // 4. Reset หน้า Create
    if (textarea) textarea.value = "";
    if (submitBtn) submitBtn.disabled = true;

    // 5. กลับไปหน้า Library
    showPage("library");

    editForm.style.display = "flex";
    editLoading.style.display = "none";
  }, 2000);
}


function renderLibrary() {
  const container = document.getElementById("library-grid");
  if (!container) return;

  const videos = JSON.parse(localStorage.getItem("recapVideos") || "[]");
  container.innerHTML = "";

  if (videos.length === 0) {
    container.innerHTML = "<p>ยังไม่มีวิดีโอที่สร้างไว้</p>";
    return;
  }

  videos.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "video-card";

    const img = document.createElement("img");
    img.src = item.gif || "assets/icons/thumbnail.png"; // ถ้ามี gif ใช้ gif, ถ้าไม่มีก็ fallback
    img.alt = "Video Preview";
    img.className = "preview";



    const info = document.createElement("div");
    info.className = "video-info";

    const title = document.createElement("div");
    title.className = "video-title";
    title.textContent = `Video_${index + 1}`;

    const footer = document.createElement("div");
    footer.className = "video-footer";

    const randomSec = Math.floor(60 + Math.random() * 60);
    const minutes = String(Math.floor(randomSec / 60)).padStart(2, '0');
    const seconds = String(randomSec % 60).padStart(2, '0');
    const duration = `${minutes}:${seconds}`;

    const caption = document.createElement("span");
    caption.textContent = item.text;

    const time = document.createElement("span");
    time.textContent = duration;

    footer.appendChild(caption);
    footer.appendChild(time);
    info.appendChild(title);
    info.appendChild(footer);

    const actions = document.createElement("div");
    actions.className = "video-actions";

    const downloadBtn = document.createElement("button");
    const downloadIcon = document.createElement("img");
    downloadIcon.src = "assets/icons/download.png";
    downloadIcon.alt = "ดาวน์โหลด";
    downloadBtn.appendChild(downloadIcon);
    downloadBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      alert(`ดาวน์โหลดวิดีโอ: Video_${index + 1}`);
    });

    const deleteBtn = document.createElement("button");
    const deleteIcon = document.createElement("img");
    deleteIcon.src = "assets/icons/delete.png";
    deleteIcon.alt = "ลบ";
    deleteBtn.appendChild(deleteIcon);
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm("คุณต้องการลบวิดีโอนี้ใช่หรือไม่?")) {
        const updatedVideos = JSON.parse(localStorage.getItem("recapVideos") || "[]");
        updatedVideos.splice(index, 1);
        localStorage.setItem("recapVideos", JSON.stringify(updatedVideos));
        renderLibrary();
      }
    });

    actions.appendChild(downloadBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(actions);

    card.addEventListener("click", (e) => {
      if (e.target.closest(".video-actions")) return;
      const gifToShow = item.gif || gifSamples[Math.floor(Math.random() * gifSamples.length)];
      openModal(gifToShow, item.text, `Video_${index + 1}`);

    });

    container.appendChild(card);
  });
}

window.onload = function () {
  const firstMenu = document.querySelector('.menu-item');
  if (firstMenu) {
    firstMenu.classList.add('active');
  }

  const textarea = document.getElementById("generate-input");
  const submitBtn = document.getElementById("generate-submit");
  const loading = document.getElementById("loading");
  const form = document.getElementById("generate-form");

  if (textarea && submitBtn && loading && form) {
    textarea.addEventListener("input", () => {
      submitBtn.disabled = textarea.value.trim().length === 0;
    });

    submitBtn.addEventListener("click", () => {
      const text = textarea.value.trim();
      if (!text) return;

      currentEditingText = text;
      currentGif = gifSamples[Math.floor(Math.random() * gifSamples.length)];

      showPage("edit");

      const gifPreview = document.getElementById("edit-preview-gif");
      const placeholder = document.getElementById("edit-placeholder-text");

      if (gifPreview && placeholder) {
        gifPreview.src = currentGif;
        gifPreview.style.display = "block";
        placeholder.style.display = "none";
      }

      textarea.value = "";
      submitBtn.disabled = true;
    });
  }

  renderLibrary();
};
