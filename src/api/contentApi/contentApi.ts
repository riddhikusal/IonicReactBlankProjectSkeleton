// src/api/contentApi/contentApi.ts
import apiClient from '../axiosInstance';
import { IChapter, IGetChapterRequest, IGetChapterResourcesRequest, IGetSubjectsRequest } from './contentApi.interface';

const ContentApiEndpoints = {
    getLanguages: '/api/AIContent/languages',
    getBoards: '/api/AIContent/boards',
    getClasses: '/api/AIContent/classes',
    getSubjects: '/api/AIContent/subjects',
    getChapters: '/api/AIContent/chapters',
    getChapterResource: '/api/AIContent/chapterresource',
    getQuestions: '/api/AIContent/questions',
    getFlashcards: '/api/AIContent/flashcards',
}

export const getBoards = async (data: any) => {
    return apiClient.post(ContentApiEndpoints.getBoards, data,
        { skipAuth: true });
};

export const getClasses = async (data: any) => {
    return apiClient.post(ContentApiEndpoints.getClasses, data,
        { skipAuth: true });
};

export const getSubjects = async (data: IGetSubjectsRequest) => {
    return apiClient.get(ContentApiEndpoints.getSubjects, {
        params: data
    },
        { skipAuth: true });
}

export const getChapters = async (data: IGetChapterRequest) => {
    return apiClient.get(ContentApiEndpoints.getChapters, {
        params: data
    },
        { skipAuth: true });
};

export const getChapterResources = async (data: IGetChapterResourcesRequest) => {
    return apiClient.get(ContentApiEndpoints.getChapterResource, {
        params: data
    },
        { skipAuth: true });
};

export const getSubjectChapters = async (data: any) => {
    return apiClient.post(ContentApiEndpoints.getSubjectChapters, data,
        { skipAuth: true });
};

export const getLanguages = async (data: any) => {
    return apiClient.post(ContentApiEndpoints.getLanguages, data,
        { skipAuth: true });
};



export const getQuestions = async (data: any) => {
    return apiClient.post(ContentApiEndpoints.getQuestions, data,
        { skipAuth: true });
};

export const getFlashcards = async (data: any) => {
    return apiClient.post(ContentApiEndpoints.getFlashcards, data,
        { skipAuth: true });
};