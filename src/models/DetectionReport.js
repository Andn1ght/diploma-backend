class DetectionReport {
  constructor(id, videoId, detectionJson, detectionAccuracy, reviewed, reviewerId, reviewedAt) {
    this.id = id;
    this.videoId = videoId;
    this.detectionJson = detectionJson;
    this.detectionAccuracy = detectionAccuracy;
    this.reviewed = reviewed;
    this.reviewerId = reviewerId;
    this.reviewedAt = reviewedAt;
  }
}

module.exports = DetectionReport;
