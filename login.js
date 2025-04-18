document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
  
    // จำลองการยืนยัน (คุณสามารถเปลี่ยนให้ใช้ localStorage หรือ API ก็ได้)
    if (username === "admin" && password === "1234") {
      window.location.href = "workspace.html";
    } else {
      alert("Invalid username or password");
    }
  });
  