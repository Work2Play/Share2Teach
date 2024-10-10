const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {Storage} = require("@google-cloud/storage");
const {google} = require("googleapis");
const fs = require("fs");
const path = require("path");
const os = require("os");

admin.initializeApp();
const storage = new Storage();
const drive = google.drive("v3");

exports.processUploadedFile = functions.storage.object().onFinalize(async (object) => {
  const bucketName = object.bucket;
  const bucket = storage.bucket(bucketName);
  const filePath = object.name;
  const fileName = path.basename(filePath);
  const tempLocalFile = path.join(os.tmpdir(), fileName);
  const tempPdfPath = path.join(os.tmpdir(), `${path.basename(fileName, path.extname(fileName))}.pdf`);

  console.log("File detected:", filePath);

  try {
    // Download the file from Firebase Storage
    await bucket.file(filePath).download({destination: tempLocalFile});
    console.log("File downloaded to", tempLocalFile);

    let pdfFileId;

    if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      console.log("Converting Word document to PDF using Google Drive API.");
      pdfFileId = await convertDocxToPdf(tempLocalFile);
    } else if (fileName.endsWith(".pdf")) {
      console.log("PDF file detected. Skipping conversion.");
      pdfFileId = await uploadFileToDrive(tempLocalFile, "application/pdf");
    } else {
      console.error("Unsupported file type. Exiting function.");
      fs.unlinkSync(tempLocalFile);
      return null;
    }

    // Download the converted PDF from Google Drive
    await downloadPdfFromDrive(pdfFileId, tempPdfPath);

    // Get document metadata from Firestore
    const snapshot = await admin.firestore().collection("PDFS").where("title", "==", fileName).get();
    if (snapshot.empty) {
      console.error("No matching document found in Firestore. Skipping processing.");
      fs.unlinkSync(tempLocalFile);
      fs.unlinkSync(tempPdfPath);
      return null;
    }

    const doc = snapshot.docs[0];
    const docData = doc.data();
    const {subject} = docData;

    // Define the final destination paths
    const finalPdfPath = `${subject}/${fileName.replace(/\.[^/.]+$/, ".pdf")}`;
    const finalDocPath = `PDFS/${subject}_Main/${subject}/${fileName}`;

    // Upload the PDF to Firebase Storage
    await bucket.upload(tempPdfPath, {destination: finalPdfPath});
    console.log(`PDF moved to ${finalPdfPath}`);

    // Move the original document to its final location
    await bucket.upload(tempLocalFile, {destination: finalDocPath});
    console.log(`Original document moved to ${finalDocPath}`);

    // Get the download URL for the PDF
    const [downloadURL] = await bucket.file(finalPdfPath).getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    });

    // Update Firestore document with the download URL and move the document entry
    await admin.firestore().collection(`PDFS/${subject}_Main/${subject}`).doc(doc.id).set({
      ...docData,
      file_url: downloadURL,
    });

    // Delete the original document from the temporary collection
    await doc.ref.delete();

    // Clean up temporary files
    fs.unlinkSync(tempLocalFile);
    fs.unlinkSync(tempPdfPath);

    console.log("Processing complete.");
  } catch (error) {
    console.error("Error processing file:", error);
  }
});

async function convertDocxToPdf(filePath) {
  try {
    // Authenticate with Google APIs
    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const authClient = await auth.getClient();
    google.options({auth: authClient});

    // Upload the DOCX file to Google Drive
    const fileMetadata = {
      name: path.basename(filePath),
      mimeType: "application/vnd.google-apps.document",
    };
    const media = {
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      body: fs.createReadStream(filePath),
    };

    const uploadResponse = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    const fileId = uploadResponse.data.id;

    // Export the file to PDF
    await drive.files.export(
      {
        fileId: fileId,
        mimeType: "application/pdf",
      },
      {responseType: "stream"},
    );

    return fileId;
  } catch (error) {
    console.error("Error converting DOCX to PDF:", error);
    throw error;
  }
}

async function downloadPdfFromDrive(fileId, destinationPath) {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const authClient = await auth.getClient();
    google.options({auth: authClient});

    const response = await drive.files.get(
      {fileId: fileId, alt: "media"},
      {responseType: "stream"},
    );

    const dest = fs.createWriteStream(destinationPath);
    response.data.pipe(dest);

    return new Promise((resolve, reject) => {
      dest.on("finish", () => {
        console.log(`PDF downloaded to ${destinationPath}`);
        resolve();
      });

      dest.on("error", (err) => {
        console.error("Error downloading PDF from Google Drive:", err);
        reject(err);
      });
    });
  } catch (error) {
    console.error("Error downloading PDF from Google Drive:", error);
    throw error;
  }
}

async function uploadFileToDrive(filePath, mimeType) {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const authClient = await auth.getClient();
    google.options({auth: authClient});

    const fileMetadata = {
      name: path.basename(filePath),
    };

    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(filePath),
    };

    const uploadResponse = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    return uploadResponse.data.id;
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    throw error;
  }
}
