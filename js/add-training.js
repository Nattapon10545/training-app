// js/add-training.js

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

const form = document.getElementById('trainingForm');
const fileInput = document.getElementById('fileUpload');
const fileName = document.getElementById('fileName');
const loading = document.getElementById('loading');

fileInput.addEventListener('change', () => {
  fileName.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : '';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  loading.classList.remove('hidden');

  const token = localStorage.getItem('token');
  if (!token) {
    alert("กรุณาเข้าสู่ระบบก่อน");
    window.location.href = "index.html";
    return;
  }

  const title = document.getElementById('title').value.trim();
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const hours = parseFloat(document.getElementById('hours').value);
  const organization = document.getElementById('organization').value.trim();
  const trainingType = document.getElementById('trainingType').value;
  const fileSelected = fileInput.files[0];

  if (new Date(startDate) > new Date(endDate)) {
    alert("วันที่เริ่มต้องไม่เกินวันที่สิ้นสุด");
    loading.classList.add('hidden');
    return;
  }
  if (hours <= 0) {
    alert("จำนวนชั่วโมงต้องมากกว่า 0");
    loading.classList.add('hidden');
    return;
  }

  let fileUrl = "";
  if (fileSelected) {
    const formData = new FormData();
    formData.append('file', fileSelected);
    formData.append('email', token);
    formData.append('budgetYear', new Date(startDate).getFullYear() + 543);

    const uploadRes = await fetch('https://script.google.com/macros/s/AKfycbySViwrwFFOh9bLCuuA0fiH_r5t6VK3ML3FhfxL7eOtvxzCK_IuidF6q6l78J4Job9f/exec?action=uploadFile', {
      method: 'POST',
      body: formData
    });
    const uploadData = await uploadRes.json();
    if (uploadData.success) {
      fileUrl = uploadData.fileUrl;
    } else {
      alert("อัปโหลดไฟล์ไม่สำเร็จ");
      loading.classList.add('hidden');
      return;
    }
  }

  const res = await fetch('https://script.google.com/macros/s/AKfycbySViwrwFFOh9bLCuuA0fiH_r5t6VK3ML3FhfxL7eOtvxzCK_IuidF6q6l78J4Job9f/exec?action=addTraining', {
    method: 'POST',
    body: JSON.stringify({
      email: token,
      title,
      startDate,
      endDate,
      hours,
      organization,
      trainingType,
      fileUrl
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await res.json();

  if (data.success) {
    alert("เพิ่มข้อมูลสำเร็จ!");
    form.reset();
    fileName.textContent = '';
  } else {
    alert("เกิดข้อผิดพลาด: " + data.message);
  }

  loading.classList.add('hidden');
});
