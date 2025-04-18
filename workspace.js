function showPage(pageId, clickedItem) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.style.display = section.id === pageId ? 'block' : 'none';
  });

  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => item.classList.remove('active'));
  if (clickedItem) clickedItem.classList.add('active');

  // ถ้าเปิดหน้า Library → แสดงวิดีโอเลย
  if (pageId === "library") {
    renderLibrary();
  }
}


// toggle sidebar ยืด-หด
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('expanded');
  sidebar.classList.toggle('collapsed');
}

// เรียก default active หน้าแรก
window.onload = function () {
  const firstMenu = document.querySelector('.menu-item');
  if (firstMenu) {
    firstMenu.classList.add('active');
  }

  // Set up textarea logic (Create)
  const textarea = document.getElementById("generate-input");
  const submitBtn = document.getElementById("generate-submit");
  const loading = document.getElementById("loading");
  const form = document.getElementById("generate-form");

  if (textarea && submitBtn && loading && form) {
    textarea.addEventListener("input", () => {
      const hasText = textarea.value.trim().length > 0;
      submitBtn.disabled = !hasText;
    });

    submitBtn.addEventListener("click", () => {
      const text = textarea.value.trim();
      if (!text) return;

      form.style.display = "none";
      loading.style.display = "flex";

      setTimeout(() => {
        const old = JSON.parse(localStorage.getItem("recapVideos") || "[]");
        old.push({ text, created: new Date().toISOString() });
        localStorage.setItem("recapVideos", JSON.stringify(old));

        showPage("library");
        textarea.value = "";
        submitBtn.disabled = true;
        form.style.display = "flex";
        loading.style.display = "none";
      }, 2000);
    });
  }

  // โหลด library ทันทีถ้าเริ่มที่หน้า library
  renderLibrary();
};


const textarea = document.getElementById("generate-input");
const submitBtn = document.getElementById("generate-submit");
const loading = document.getElementById("loading");

if (textarea && submitBtn && loading) {
  textarea.addEventListener("input", () => {
    const hasText = textarea.value.trim().length > 0;
    submitBtn.disabled = !hasText;
  });

  
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

    // Placeholder video image
    const img = document.createElement("img");
    img.src = "assets/icons/thumbnail.png"; // หรือเปลี่ยนเป็น URL ที่คุณมี
    img.alt = "Video Preview";
    img.className = "preview";

    // Video info
    const info = document.createElement("div");
    info.className = "video-info";

    const title = document.createElement("div");
    title.className = "video-title";
    title.textContent = `Video_${index + 1}`;

    const footer = document.createElement("div");
    footer.className = "video-footer";

    // Random duration
    const randomMin = 1;
    const randomSec = Math.floor(60 + Math.random() * 60); // 60–119 sec
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

    // Actions (download + delete)
    const actions = document.createElement("div");
    actions.className = "video-actions";

    const downloadBtn = document.createElement("button");
    const downloadIcon = document.createElement("img");
    downloadIcon.src = "assets/icons/download.png";
    downloadIcon.alt = "ดาวน์โหลด";
    downloadBtn.appendChild(downloadIcon);
    downloadBtn.addEventListener("click", () => {
      alert(`ดาวน์โหลดวิดีโอ: Video_${index + 1}`);
    });

    const deleteBtn = document.createElement("button");
    const deleteIcon = document.createElement("img");
    deleteIcon.src = "assets/icons/delete.png";
    deleteIcon.alt = "ลบ";
    deleteBtn.appendChild(deleteIcon);
    deleteBtn.addEventListener("click", () => {
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

    container.appendChild(card);
  });
}






