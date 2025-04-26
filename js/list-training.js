// js/list-training.js

let allTrainings = [];
let currentPage = 1;
const rowsPerPage = 10;

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

async function fetchTrainings() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("กรุณาเข้าสู่ระบบก่อน");
    window.location.href = "index.html";
    return;
  }

  const res = await fetch(`https://script.google.com/macros/s/AKfycbygOLq7mNYXASGxbhpj6Xrvmv9StRLvrgT-_kNI6uyLXF-7S5EzO08tTD0F-9C7v6vkbg/exec?action=listTrainings&email=${token}`);
  const data = await res.json();

  if (data.success) {
    allTrainings = data.trainings;
    currentPage = 1;
    renderTable();
  } else {
    alert("โหลดข้อมูลไม่สำเร็จ");
  }
}

function renderTable() {
  const table = document.getElementById('trainingTable');
  table.innerHTML = '';

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = allTrainings.slice(start, end);

  pageData.forEach((training, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="p-3">${training[2]}</td>
      <td class="p-3">${training[3]}</td>
      <td class="p-3">${training[4]}</td>
      <td class="p-3">${training[5]}</td>
      <td class="p-3">${training[7]}</td>
      <td class="p-3 space-x-2">
        <button onclick="viewTraining(${start + index})" class="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded text-sm">ดู</button>
        <button onclick="editTraining(${start + index})" class="bg-green-400 hover:bg-green-500 text-white px-2 py-1 rounded text-sm">แก้ไข</button>
        <button onclick="deleteTraining(${start + index})" class="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded text-sm">ลบ</button>
      </td>
    `;
    table.appendChild(row);
  });

  const pageInfo = document.getElementById('pageInfo');
  const totalPages = Math.ceil(allTrainings.length / rowsPerPage);
  pageInfo.textContent = `หน้า ${currentPage} / ${totalPages}`;

  document.getElementById('prevPage').disabled = (currentPage === 1);
  document.getElementById('nextPage').disabled = (currentPage === totalPages);
}

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  const totalPages = Math.ceil(allTrainings.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  const keyword = e.target.value.toLowerCase();
  const filteredTrainings = allTrainings.filter(training => {
    return training[2].toLowerCase().includes(keyword);
  });
  allTrainings = filteredTrainings;
  currentPage = 1;
  renderTable();
});

function viewTraining(index) {
  const trainings = JSON.parse(localStorage.getItem('trainings'));
  const training = trainings[index];

  const modal = document.getElementById('viewModal');
  const modalContent = document.getElementById('modalContent');

  modalContent.innerHTML = `
    <p><strong>ชื่ออบรม:</strong> ${training[2]}</p>
    <p><strong>วันที่เริ่ม:</strong> ${training[3]}</p>
    <p><strong>วันที่สิ้นสุด:</strong> ${training[4]}</p>
    <p><strong>จำนวนชั่วโมง:</strong> ${training[5]}</p>
    <p><strong>หน่วยงาน:</strong> ${training[6]}</p>
    <p><strong>ประเภทการอบรม:</strong> ${training[7]}</p>
    ${training[8] ? `<p><a href="${training[8]}" target="_blank" class="text-blue-500 underline">ดูไฟล์แนบ</a></p>` : ''}
  `;

  modal.classList.remove('hidden');
}

function editTraining(index) {
  const trainings = JSON.parse(localStorage.getItem('trainings'));
  const training = trainings[index];

  localStorage.setItem('editTraining', JSON.stringify({
    id: training[0],
    title: training[2],
    startDate: training[3],
    endDate: training[4],
    hours: training[5],
    organization: training[6],
    trainingType: training[7]
  }));

  window.location.href = 'edit-training.html';
}

async function deleteTraining(index) {
  const trainings = JSON.parse(localStorage.getItem('trainings'));
  const training = trainings[index];

  if (confirm(`คุณแน่ใจว่าต้องการลบ "${training[2]}" หรือไม่?`)) {
    const res = await fetch('https://script.google.com/macros/s/AKfycbygOLq7mNYXASGxbhpj6Xrvmv9StRLvrgT-_kNI6uyLXF-7S5EzO08tTD0F-9C7v6vkbg/exec?action=deleteTraining', {
      method: 'POST',
      body: JSON.stringify({ id: training[0] }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    if (data.success) {
      alert("ลบข้อมูลสำเร็จ");
      fetchTrainings();
    } else {
      alert("เกิดข้อผิดพลาด: " + data.message);
    }
  }
}

document.getElementById('closeModalBtn').addEventListener('click', () => {
  document.getElementById('viewModal').classList.add('hidden');
});

fetchTrainings();
