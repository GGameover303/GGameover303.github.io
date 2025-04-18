function showPage(pageId, clickedItem) {
    // ซ่อนหน้าทั้งหมดก่อน
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
      section.style.display = section.id === pageId ? 'block' : 'none';
    });
  
    // ตั้ง active ให้กับ icon ที่คลิก
    const menuItems = document.querySelectorAll('.sidebar nav ul li');
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
    const firstMenu = document.querySelector('.sidebar nav ul li');
    if (firstMenu) {
      firstMenu.classList.add('active');
    }
  };
  