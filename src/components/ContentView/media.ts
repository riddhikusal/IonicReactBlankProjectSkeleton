export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  description: string;
  contentType?: "video" | "audio";
  descriptionFile?: string;
  review?: string;
  about?: string;
  relatedVideos?: Video[];
}
export interface FlashcardData {
  question: string;
  answer: string;
  image: string;
}
export interface QuizQuestion {
  question: string;
  description: string;
  options: string[];
  correctIndex: number;
}
export interface VideoPlayerProps {
  video: Video;
  autoplay?: boolean; // <-- new optional prop

}

export interface AudioFFMPEGResponse {
  audio: string;
  wordTimestamps: FFMediaProp[];
}
export interface FFMediaProp {
  word: string;
  offset: number;
}