// js/edit-training.js

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

const form = document.getElementById('editForm');
const training = JSON.parse(localStorage.getItem('editTraining'));

if (!training) {
  alert("ไม่พบข้อมูลอบรมที่จะแก้ไข");
  window.location.href = "list-training.html";
}

document.getElementById('title').value = training.title;
document.getElementById('startDate').value = training.startDate;
document.getElementById('endDate').value = training.endDate;
document.getElementById('hours').value = training.hours;
document.getElementById('organization').value = training.organization;
document.getElementById('trainingType').value = training.trainingType;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const updatedTraining = {
    id: training.id,
    title: document.getElementById('title').value.trim(),
    startDate: document.getElementById('startDate').value,
    endDate: document.getElementById('endDate').value,
    hours: document.getElementById('hours').value,
    organization: document.getElementById('organization').value.trim(),
    trainingType: document.getElementById('trainingType').value
  };

  const res = await fetch('https://script.google.com/macros/s/AKfycbwSZ119028RZXf1XyIIcDab4D9PArdss3aFDCaP3Dkk3PuMfuESWlDoXnJHj52mS3Qz/exec?action=editTraining', {
    method: 'POST',
    body: JSON.stringify(updatedTraining),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await res.json();

  if (data.success) {
    alert("แก้ไขข้อมูลสำเร็จ!");
    window.location.href = 'list-training.html';
  } else {
    alert("เกิดข้อผิดพลาด: " + data.message);
  }
});
