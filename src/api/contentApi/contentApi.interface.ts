// Content API Interfaces

// Content Types Enum
export type ContentType = 
    | "web-link" 
    | "html" 
    | "video" 
    | "youtube-video" 
    | "interactive";

// Resource Item Interface
export interface IResourceItem {
    id: string;
    name: string;
    url?: string;
    contentType: ContentType;
    language?: string;
    script?: string;
    htmlView?: string;
    content?: string;
    image?: string;
}

// Chapter Resources Interface - matches the exact structure from your object
export interface IChapterResources {
    "BOOK READER": IResourceItem[];
    "FLASHCARDS": IResourceItem[];
    "NOTES & REFERENCES": IResourceItem[];
    "QUESTION ANSWERS": IResourceItem[];
    "QUIZ": IResourceItem[];
    "VIDEO EXPLAINERS": IResourceItem[];
}

// Main Response Interface
export interface IGetChapterResourcesResponse {
    "BOOK READER"?: IResourceItem[];
    "FLASHCARDS"?: IResourceItem[];
    "NOTES & REFERENCES"?: IResourceItem[];
    "QUESTION ANSWERS"?: IResourceItem[];
    "QUIZ"?: IResourceItem[];
    "VIDEO EXPLAINERS"?: IResourceItem[];
}

export interface IGetChapterResourcesRequest{
    language:string;
    chapterId:number;
}




export interface IGetSubjectsRequest {
    language:string;
    classId:number;
}

export interface IGetSubjectsResponse {
    subjectId: number;
    info: string;
    image: string;
    isActive: boolean;
}

export interface IGetChapterRequest{
    language:string;
    subjectId:number;
}

export interface IGetChapterResponse{
    chapterId:number;
    subjectId:number;
    chapterNo:number;
    title:string;
    languageCode:string;
    isActive:boolean;
    image:string;
}
