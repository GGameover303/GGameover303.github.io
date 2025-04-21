const gifSamples = [
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://media.giphy.com/media/l0HlWm7IsVVfMcF1G/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif"
];

let currentEditingText = "";
let currentGif = "";

const selectedVideos = new Set();
const pageOrder = ["profile", "highlight", "generate", "edit", "library"];
let currentPage = ""; // หรืออะไรก็ได้ตอนเริ่มต้น


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
  if (pageId === currentPage) return;
  const sections = document.querySelectorAll(".content-section");
  sections.forEach(section => {
    section.classList.remove("slide-up", "slide-down");
    section.style.display = "none";
  });

  const target = document.getElementById(pageId);
  if (target) {
    const currentIdx = pageOrder.indexOf(currentPage);
    const nextIdx = pageOrder.indexOf(pageId);
    const direction = nextIdx > currentIdx ? "slide-up" : "slide-down";

    target.style.display = "block";
    target.classList.remove("slide-up", "slide-down");

    currentPage = pageId;
  }

  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach(item => item.classList.remove("active"));
  if (clickedItem) {
    clickedItem.classList.add("active");
  } else {
    const autoActive = Array.from(menuItems).find(item =>
      item.getAttribute("onclick")?.includes(`'${pageId}'`)
    );
    if (autoActive) autoActive.classList.add("active");
  }

  if (pageId === "library") renderLibrary();

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
        actionBtn.style.backgroundColor = "#10b981";
        actionBtn.disabled = false;
        actionBtn.onclick = () => applyChange();
      } else {
        actionBtn.textContent = "ตกลง";
        actionBtn.style.backgroundColor = "#3b82f6";
        actionBtn.disabled = false;
        actionBtn.onclick = () => showPage("generate");
      }
    }
  }

  if (pageId === "generate") {
    const form = document.getElementById("generate-form");
    const sidebar = document.querySelector(".generate-right");
    const progressBar = document.getElementById("create-progress-bar");

    if (form) form.style.display = "flex";
    if (sidebar) sidebar.style.display = "block";
    if (progressBar) progressBar.style.display = "none";

    // ✅ Rebind selection behavior
    const externalItems = document.querySelectorAll(".external-video-item");
    externalItems.forEach((item, idx) => {
      // reset visual
      item.classList.remove("selected");

      // remove old event listener (safety)
      item.replaceWith(item.cloneNode(true));
    });

    // รี-query อีกครั้งหลัง replace
    const refreshedItems = document.querySelectorAll(".external-video-item");
    refreshedItems.forEach((item, idx) => {
      item.addEventListener("click", () => {
        item.classList.toggle("selected");

        if (item.classList.contains("selected")) {
          selectedVideos.add(idx);
        } else {
          selectedVideos.delete(idx);
        }

        const text = document.getElementById("generate-input").value.trim();
        const submitBtn = document.getElementById("generate-submit");

      });
    });
  }

  // Show or hide generate-right sidebar
  const generateSidebar = document.getElementById("generate-sidebar");
  if (generateSidebar) {
    generateSidebar.style.display = (pageId === "generate") ? "block" : "none";
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
    img.src = item.gif || "assets/icons/thumbnail.png";
    img.alt = "Video Preview";
    img.className = "preview";

    // ✅ สร้าง actions ก่อน append
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

    // ✅ ส่วนจัดการข้อมูลวิดีโอ
    const info = document.createElement("div");
    info.className = "video-info";

    const randomSec = Math.floor(60 + Math.random() * 60);
    const minutes = String(Math.floor(randomSec / 60)).padStart(2, '0');
    const seconds = String(randomSec % 60).padStart(2, '0');
    const duration = `${minutes}:${seconds}`;

    const titleRow = document.createElement("div");
    titleRow.className = "video-title-row";

    const title = document.createElement("div");
    title.className = "video-title";
    title.textContent = `Video_${index + 1}`;

    const time = document.createElement("span");
    time.className = "video-time";
    time.textContent = duration;

    titleRow.appendChild(title);
    titleRow.appendChild(time);
    info.appendChild(titleRow);

    const footer = document.createElement("div");
    footer.className = "video-footer";

    const caption = document.createElement("span");
    caption.textContent = item.text;

    footer.appendChild(caption);
    info.appendChild(footer);

    // ✅ เพิ่มทุกส่วนเข้า card
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
  
  showPage("profile");

  const textarea = document.getElementById("generate-input");
  const submitBtn = document.getElementById("generate-submit");
  const loading = document.getElementById("loading");
  const form = document.getElementById("generate-form");

  if (textarea && submitBtn && loading && form) {

    //OkayBTN
    submitBtn.addEventListener("click", () => {
      const text = textarea.value.trim();
      const selectedCount = selectedVideos.size;

      // ✅ ตรวจสอบเงื่อนไข
      if (text === "") {
        alert("กรุณาใส่ข้อความก่อน");
        return;
      }

      if (selectedCount < 2) {
        alert("กรุณาเลือกวิดีโอตัวอย่างอย่างน้อย 2 อัน");
        return;
      }

      // ✅ ถ้าเงื่อนไขครบ ทำงานตามปกติ
      currentEditingText = text;
      currentGif = gifSamples[Math.floor(Math.random() * gifSamples.length)];

      const form = document.getElementById("generate-form");
      const sidebar = document.querySelector(".generate-right");
      if (form) form.style.display = "none";
      if (sidebar) sidebar.style.display = "none";

      const bar = document.getElementById("create-progress-bar");
      const fill = document.getElementById("create-progress-fill");
      const percentText = document.getElementById("create-progress-text");

      if (bar && fill) {
        bar.style.display = "block";
        fill.style.width = "0%";

        let percent = 0;
        bar.style.display = "block";


        const interval = setInterval(() => {
          percent += 10;
          fill.style.width = percent + "%";
          percentText.textContent = percent + "%";

          if (percent >= 100) {
            clearInterval(interval);
            bar.style.display = "none";
            percent = 0; // รีเซ็ตไว้ใช้รอบหน้า
            showPage("edit")
          }
        }, 300);
      }

      // ✅ เคลียร์ข้อมูลหลังจากตกลง
      textarea.value = "";
      selectedVideos.clear();
      document.querySelectorAll(".external-video-item").forEach(item => {
        item.classList.remove("selected");
      });
    });


  }

  renderLibrary();

  const externalVideoList = document.getElementById("external-video-list");

  if (externalVideoList) {
    const externalSources = [
      { gif: gifSamples[0], icon: "assets/icons/youtube.png", alt: "YouTube" },
      { gif: gifSamples[1], icon: "assets/icons/facebook.png", alt: "Facebook" },
      { gif: gifSamples[2], icon: "assets/icons/tiktok.png", alt: "TikTok" }
    ];

    externalSources.forEach(({ gif, icon, alt }) => {
      const item = document.createElement("div");
      item.className = "external-video-item";

      const wrapper = document.createElement("div");
      wrapper.className = "video-thumbnail-wrapper";

      const img = document.createElement("img");
      img.src = gif;
      img.alt = "External Video";

      const overlay = document.createElement("img");
      overlay.className = "video-icon-overlay";
      overlay.src = icon;
      overlay.alt = alt;

      wrapper.appendChild(img);
      wrapper.appendChild(overlay);
      item.appendChild(wrapper);
      externalVideoList.appendChild(item);
    });

    // ✅ ตรงนี้สำคัญ!
    bindExternalVideoEvents();



    // ✅ ทำให้วิดีโอเลือกได้
    const externalItems = document.querySelectorAll(".external-video-item");
    externalItems.forEach((item, idx) => {
      item.addEventListener("click", () => {
        item.classList.toggle("selected");

        if (item.classList.contains("selected")) {
          selectedVideos.add(idx);
        } else {
          selectedVideos.delete(idx);
        }

        const text = textarea.value.trim();
      });
    });

  }

};

document.getElementById("highlight-submit").addEventListener("click", () => {
  const url = document.getElementById("highlight-url-input").value.trim();
  const min = document.getElementById("highlight-duration-min").value.trim();
  const sec = document.getElementById("highlight-duration-sec").value.trim();


  if (!url) {
    alert("กรุณาใส่ URL ก่อนกดตกลง");
    return;
  }

  if ((min === "" && sec === "") || (isNaN(min) && isNaN(sec))) {
    alert("กรุณาระบุความยาวคลิปอย่างน้อย 1 ช่อง (นาทีหรือวินาที)");
    return;
  }

  const minutes = parseInt(min, 10) || 0;
  const seconds = parseInt(sec, 10) || 0;

  if (minutes < 0 || seconds < 0 || seconds >= 60) {
    alert("กรุณาใส่เวลาที่ถูกต้อง (วินาทีต้องอยู่ระหว่าง 0-59)");
    return;
  }

  const duration = minutes * 60 + seconds;
  if (duration === 0) {
    alert("ระยะเวลาคลิปต้องมากกว่า 0 วินาที");
    return;
  }

  // ซ่อน input ทั้งหมด
  document.getElementById("highlight-header").style.display = "none";
  document.getElementById("highlight-url-input").style.display = "none";
  document.querySelector(".highlight-time-inputs").style.display = "none";
  document.getElementById("highlight-submit").style.display = "none";


  // แสดง progress bar
  const bar = document.getElementById("highlight-progress-bar");
  const fill = document.getElementById("highlight-progress-fill");
  if (bar && fill) {
    bar.style.display = "block";
    fill.style.width = "0%";

    let percent = 0;
    const interval = setInterval(() => {
      percent += 10;
      fill.style.width = percent + "%";

      if (percent >= 100) {
        clearInterval(interval);
        bar.style.display = "none";

        // เพิ่มวิดีโอ Highlight เข้า library
        const gif = gifSamples[Math.floor(Math.random() * gifSamples.length)];
        const existing = JSON.parse(localStorage.getItem("recapVideos") || "[]");
        existing.push({ text: "Highlight", gif });
        localStorage.setItem("recapVideos", JSON.stringify(existing));

        // ✅ เคลียร์ช่อง input
        document.getElementById("highlight-url-input").value = "";
        document.getElementById("highlight-duration-min").value = "";
        document.getElementById("highlight-duration-sec").value = "";

        // ✅ แสดง input กลับ (หรือจะไม่แสดงเพราะเปลี่ยนหน้าเลยก็ได้)
        document.getElementById("highlight-header").style.display = "block";
        document.getElementById("highlight-url-input").style.display = "block";
        document.querySelector(".highlight-time-inputs").style.display = "flex";
        document.getElementById("highlight-submit").style.display = "inline-block";

        // ✅ ไปหน้า library
        showPage("library");
        renderLibrary();
      }



    }, 100);
  }
});
