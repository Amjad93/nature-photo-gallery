const FOLDER_NAME = "Nature submissions";

function getFolder_() {
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}

// Runs on a timer: handles new emails, saves photos, sends the reply
function processEmails() {
  const folder = getFolder_();
  const threads = GmailApp.search("is:unread in:inbox", 0, 10);

  threads.forEach((thread) => {
    thread.getMessages().forEach((msg) => {
      if (!msg.isUnread()) return;

      // Avoid reply loops with automated senders
      const from = msg.getFrom().toLowerCase();
      if (/no-?reply|mailer-daemon|postmaster/.test(from)) {
        msg.markRead();
        return;
      }

      console.log(`Incoming message: ${msg.getSubject()} from ${from}`);

      const images = msg
        .getAttachments()
        .filter((a) => a.getContentType().startsWith("image/"));

      images.forEach((img) => {
        const file = folder.createFile(img);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        file.setDescription(msg.getSubject() || "Submitted photo");
      });

      msg.reply(
        images.length
          ? "Thanks for your submission! 📸"
          : "Please attach a photo to your email and send it again. 📸"
      );
      msg.markRead();
    });
  });
}

// This is your API: opening the web app URL returns the gallery as JSON
function doGet() {
  const files = getFolder_().getFiles();
  const gallery = [];

  while (files.hasNext()) {
    const f = files.next();
    const text = f.getDescription() || "Submitted photo";
    gallery.push({
      src: "https://drive.google.com/thumbnail?id=" + f.getId() + "&sz=w600",
      description: text,
      alt: text,
      thumbnailWidth: "200px",
      created: f.getDateCreated().getTime(),
    });
  }

  gallery.sort((a, b) => b.created - a.created); // newest first

  return ContentService.createTextOutput(JSON.stringify(gallery)).setMimeType(
    ContentService.MimeType.JSON
  );
}
