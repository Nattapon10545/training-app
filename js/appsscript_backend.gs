// appsscript_backend.gs

function doPost(e) {
  const action = e.parameter.action;

  if (action === "login") {
    const data = JSON.parse(e.postData.contents);
    return loginUser(data);
  } else if (action === "uploadFile") {
    return uploadFile(e);
  } else if (action === "addTraining") {
    const data = JSON.parse(e.postData.contents);
    return addTraining(data);
  } else if (action === "deleteTraining") {
    const data = JSON.parse(e.postData.contents);
    return deleteTraining(data);
  } else if (action === "editTraining") {
    const data = JSON.parse(e.postData.contents);
    return editTraining(data);
  } else {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Invalid action" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const action = e.parameter.action;

  if (action === "listTrainings") {
    const email = e.parameter.email;
    return listTrainings(email);
  }
}

function loginUser(data) {
  return ContentService.createTextOutput(JSON.stringify({ success: true, token: data.email }))
    .setMimeType(ContentService.MimeType.JSON);
}

function uploadFile(e) {
  const blob = e.parameter.file;
  const email = e.parameter.email;
  const budgetYear = e.parameter.budgetYear;
  const folder = DriveApp.getFolderById('1oXsyd2czyqOxv-BSoq0HGdI1Ywt6am9a
');
  const file = folder.createFile(blob);
  file.setName(email + "-" + file.getName());
  return ContentService.createTextOutput(JSON.stringify({ success: true, fileUrl: file.getUrl() }))
    .setMimeType(ContentService.MimeType.JSON);
}

function addTraining(data) {
  const sheet = SpreadsheetApp.openById('1L11yOEnicSz-RoblKVFoYsdNQPzyAIN5TGJZUhA5spk
').getSheetByName('trainings');
  sheet.appendRow([new Date(), data.email, data.title, data.startDate, data.endDate, data.hours, data.organization, data.trainingType, data.fileUrl]);
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function deleteTraining(data) {
  const sheet = SpreadsheetApp.openById('1L11yOEnicSz-RoblKVFoYsdNQPzyAIN5TGJZUhA5spk
').getSheetByName('trainings');
  const values = sheet.getDataRange().getValues();
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] == data.id) {
      sheet.deleteRow(i + 1);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
}

function editTraining(data) {
  const sheet = SpreadsheetApp.openById('1L11yOEnicSz-RoblKVFoYsdNQPzyAIN5TGJZUhA5spk
').getSheetByName('trainings');
  const values = sheet.getDataRange().getValues();
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] == data.id) {
      sheet.getRange(i + 1, 3).setValue(data.title);
      sheet.getRange(i + 1, 4).setValue(data.startDate);
      sheet.getRange(i + 1, 5).setValue(data.endDate);
      sheet.getRange(i + 1, 6).setValue(data.hours);
      sheet.getRange(i + 1, 7).setValue(data.organization);
      sheet.getRange(i + 1, 8).setValue(data.trainingType);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
}

function listTrainings(email) {
  const sheet = SpreadsheetApp.openById('1L11yOEnicSz-RoblKVFoYsdNQPzyAIN5TGJZUhA5spk
').getSheetByName('trainings');
  const values = sheet.getDataRange().getValues();
  const userTrainings = values.filter(row => row[1] === email);
  return ContentService.createTextOutput(JSON.stringify({ success: true, trainings: userTrainings }))
    .setMimeType(ContentService.MimeType.JSON);
}
