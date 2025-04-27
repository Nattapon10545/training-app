
document.getElementById('trainingForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = 'guest'; // ไม่ต้องเช็ก token แล้ว
  const title = document.getElementById('title').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const hours = document.getElementById('hours').value;
  const organization = document.getElementById('organization').value;
  const trainingType = document.getElementById('trainingType').value;
  const fileUrl = ''; // ไม่ใช้การอัปโหลดไฟล์ในเวอร์ชันนี้

  const url = 'https://script.google.com/macros/s/AKfycbygOLq7mNYXASGxbhpj6Xrvmv9StRLvrgT-_kNI6uyLXF-7S5EzO08tTD0F-9C7v6vkbg/exec?action=addTraining';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, title, startDate, endDate, hours, organization, trainingType, fileUrl })
  });

  const data = await res.json();

  if (data.success) {
    alert('เพิ่มข้อมูลสำเร็จ');
    window.location.href = './dashboard.html';
  } else {
    alert('เพิ่มข้อมูลไม่สำเร็จ');
  }
});
