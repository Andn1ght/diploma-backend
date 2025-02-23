class ProcessedVideo {
  constructor(id, videoId, processedVideo, processedAt) {
    this.id = id;
    this.videoId = videoId;
    this.processedVideo = processedVideo;
    this.processedAt = processedAt;
  }
}

module.exports = ProcessedVideo;
