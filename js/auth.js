
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const url = 'https://script.google.com/macros/s/AKfycbygOLq7mNYXASGxbhpj6Xrvmv9StRLvrgT-_kNI6uyLXF-7S5EzO08tTD0F-9C7v6vkbg/exec?action=login';
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  
  if (data.success) {
    localStorage.setItem('token', data.token);
    window.location.href = './dashboard.html';
  } else {
    alert(data.message);
  }
});
