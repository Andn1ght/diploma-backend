class UploadedVideo {
  constructor(id, userId, originalFilename, rawVideo, storagePath, uploadedAt) {
    this.id = id;
    this.userId = userId;
    this.originalFilename = originalFilename;
    this.rawVideo = rawVideo;
    this.storagePath = storagePath;
    this.uploadedAt = uploadedAt;
  }
}

module.exports = UploadedVideo;
