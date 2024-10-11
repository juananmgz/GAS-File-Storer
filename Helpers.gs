/**
 * Format the Query used to fetch mails
 */
function formatQuery_() {
  var queryParts = config.subjectTypesToFetch.map((subject) => "subject:" + subject);
  return "in:inbox has:nouserlabels " + queryParts.join(" OR ");
}

/**
 * Gets the Google Drive folder. If it doesn't exist, folder is created
 */
function getFolder_() {
  const currentYear = new Date().getFullYear().toString();

  var folderParentIterator = DriveApp.getFoldersByName(config.folderParentName);
  if (!folderParentIterator.hasNext()) {
    throw new Error(`* [!] Parent folder '${config.folderParentName}' does not exist.`);
  }
  var folderParent = folderParentIterator.next();
  var folder;

  var fi = folderParent.getFolders();
  while (fi.hasNext()) {
    var subfolder = fi.next();
    if (subfolder.getName() === currentYear) {
      folder = subfolder;
      break;
    }
  }

  if (!folder) {
    folder = folderParent.createFolder(currentYear);
    console.log(`* [📁] CREATED: ${currentYear}`);
  }

  return folder;
}

/**
 * Check file extension type and extracts it
 */
function checkIfDefinedType_(attachment) {
  var fileExtension = attachment.getName().split(".").pop().toLowerCase();
  return config.fileTypesToExtract.indexOf(fileExtension) !== -1;
}

/**
 * Format name of the file
 */
function formatName_() {
  const currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth();

  // If the current month is January (0), set the month to December (12) and decrease the year by 1
  if (month === 0) {
    month = 12;
    year -= 1;
  }

  return `Nomina_${year}_${month.toString().padStart(2, "0")}`;
}

/**
 * Move attached file from Gmail to a specific Google Drive folder;
 */
function moveFileToDrive_(attachment) {
  attachment.setName(formatName_());

  var attachmentBlob = attachment.copyBlob();
  var file = DriveApp.createFile(attachmentBlob);
  file.moveTo(getFolder_());

  console.log(`* [💾] CREATED: ${newName}`);
}
