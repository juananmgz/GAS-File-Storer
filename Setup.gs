/**
 * Removes all triggers for the script's 'startSync' and 'install' function.
 */
function deleteAllTriggers_() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var trigger of triggers) {
    if (["GmailToDrive", "install"].includes(trigger.getHandlerFunction())) {
      ScriptApp.deleteTrigger(trigger);
    }
  }
}
