// js/auth.js

const loginForm = document.getElementById('loginForm');
const signupLink = document.getElementById('signupLink');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const res = await fetch('https://script.google.com/macros/s/AKfycbygOLq7mNYXASGxbhpj6Xrvmv9StRLvrgT-_kNI6uyLXF-7S5EzO08tTD0F-9C7v6vkbg/exec?action=login', {
  method: 'POST',  // <-- ต้องเป็น POST นะ
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }) // <-- body ต้องอยู่ตรงนี้
});


  
  const data = await res.json();
  
  if (data.success) {
    localStorage.setItem('token', data.token);
    window.location.href = './dashboard.html';
  } else {
    alert(data.message);
  }
});

signupLink.addEventListener('click', () => {
  alert("ฟีเจอร์สมัครสมาชิกจะทำในอนาคต!");
});
