function showPage(pageId, clickedItem) {
  // ซ่อนหน้าทั้งหมดก่อน
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.style.display = section.id === pageId ? 'block' : 'none';
  });

  // ตั้ง active ให้กับ icon ที่คลิก
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => item.classList.remove('active'));
  if (clickedItem) clickedItem.classList.add('active');
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
};

// ตรวจสอบข้อความใน textarea เพื่อเปิดปุ่มตกลง
const textarea = document.getElementById("generate-input");
const submitBtn = document.getElementById("generate-submit");

if (textarea && submitBtn) {
  textarea.addEventListener("input", () => {
    const hasText = textarea.value.trim().length > 0;
    submitBtn.disabled = !hasText;
  });

  submitBtn.addEventListener("click", () => {
    alert("ส่งข้อความ: " + textarea.value.trim());
    textarea.value = "";
    submitBtn.disabled = true;
  });
}

