
/** 
 *=========================================
 *           ABOUT THE AUTHOR
 *=========================================
 *
 * This program was created by Juan Antonio Muñoz Gómez (Juanan)
 *
 * If you would like to see other programs Juanan has made, you can check out
 * his website: juananmgz.com or his github: https://github.com/juananmgz
 *
 *=========================================
 *               SETTINGS
 *=========================================
 */

const config = {
  subjectTypesToFetch: [],                    // Subjects of emails to fetch
  fileTypesToExtract: [],                     // Array of file extension which you would like to extract to Drive
  folderParentName: ""                        // Name of the folder containing the files organization
};


//=====================================================================================================
//!!!!!!!!!!!!!!!! DO NOT EDIT BELOW HERE UNLESS YOU REALLY KNOW WHAT YOU'RE DOING !!!!!!!!!!!!!!!!!!!!
//=====================================================================================================

function install() {
  //Delete any already existing triggers so we don't create excessive triggers
  deleteAllTriggers_();

  //Schedule routine to explicitly repeat and schedule the initial syncronization
  ScriptApp.newTrigger("GmailToDrive").timeBased().onMonthDay(3).create();
}

function uninstall() {
  deleteAllTriggers_();
}


/**
 * Main function. Read mails forwarded, extract the file, stores it in the correct format and location 
 * and finally deletes the mail.
 */
function GmailToDrive() {
  // ----- Get Mails ------------------------------------
  var mailsFetched = GmailApp.search(formatQuery_());
  if (!mailsFetched.length) return;

  for (let mail of mailsFetched) {
    let messages = mail.getMessages();
    if (messages.length === 0) continue;

    // ----- Get Attachments ----------------------------
    let attachments = messages[0].getAttachments();
    for (let attachment of attachments) {
      if (checkIfDefinedType_(attachment)) {
        moveFileToDrive_(attachment);
      }
    }

    // ----- Delete processed mail ----------------------
    GmailApp.moveThreadToTrash(mail);
  }
}



