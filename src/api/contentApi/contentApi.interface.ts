// Content API Interfaces

export interface IResourceItem {
    id?: string;
    name?: string;
    url?: string;
    lang?: string;
    script?: string;
    contentType?: string;
    language?: string;
    htmlView?: string;
    content?: string;
}

export interface IBookReaderResource {
    contentType?: string;
    name?: string;
    pdf?: IResourceItem[];
    html?: IResourceItem[];
}

export interface IChapterResources {
    "BOOK READER"?: IBookReaderResource[];
    "NOTES & REFERENCES"?: IResourceItem[];
    "VIDEO EXPLAINERS"?: IResourceItem[];
    "QUESTION ANSWERS"?: IResourceItem[];
    "QUIZ"?: IResourceItem[];
    "FLASHCARDS"?: IResourceItem[];
}

export interface IChapterContent {
    resources?: IChapterResources;
}

export interface IChapter {
    id?: string;
    title?: string;
    info?: string;
    image?: string;
    content?: IChapterContent;
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