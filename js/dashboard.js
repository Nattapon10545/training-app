// js/dashboard.js

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

async function fetchTrainingData() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("กรุณาเข้าสู่ระบบก่อน");
    window.location.href = "index.html";
    return;
  }

  const res = await fetch(`https://script.google.com/macros/s/AKfycbygOLq7mNYXASGxbhpj6Xrvmv9StRLvrgT-_kNI6uyLXF-7S5EzO08tTD0F-9C7v6vkbg/exec?action=listTrainings&email=${token}`);
  const data = await res.json();

  if (data.success) {
    renderChart(data.trainings);
  } else {
    alert("โหลดข้อมูลไม่สำเร็จ");
  }
}

function renderChart(trainings) {
  const yearCount = {};
  trainings.forEach(training => {
    const year = training[5]; // ชั่วโมง (index 5)
    if (!yearCount[year]) yearCount[year] = 0;
    yearCount[year]++;
  });

  const ctx = document.getElementById('trainingChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(yearCount),
      datasets: [{
        label: 'จำนวนอบรม',
        data: Object.values(yearCount),
        borderWidth: 1,
        backgroundColor: 'rgba(250, 204, 21, 0.7)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

fetchTrainingData();
