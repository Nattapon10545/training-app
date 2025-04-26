// js/auth.js

const loginForm = document.getElementById('loginForm');
const signupLink = document.getElementById('signupLink');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const res = await fetch(`https://script.google.com/macros/s/AKfycbySViwrwFFOh9bLCuuA0fiH_r5t6VK3ML3FhfxL7eOtvxzCK_IuidF6q6l78J4Job9f/exec?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);

  
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
