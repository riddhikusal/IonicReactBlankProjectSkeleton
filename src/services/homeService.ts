import { getChapterResources, getChapters, getFlashcards, getQuestions, getSubjects, synthesizeAudio } from "../api/contentApi/contentApi";
import { IGetChapterFlashcardsRequest, IGetChapterQuizRequest, IGetChapterRequest, IGetChapterResourcesRequest, IGetChapterResourcesResponse, IGetChapterResponse, IGetSubjectsRequest, IGetSubjectsResponse, IQuizQuestion, ISynthesizeAudioRequest, ISynthesizeAudioResponse } from "../api/contentApi/contentApi.interface";
export interface IApiResponseSuccessAndError<T> {
    status: number;
    data: T;
    message: string;
    responseStatus: 'DATA_FOUND' | 'DATA_NOT_FOUND' | 'ERROR';
}



export const GetSubjects = async (data: IGetSubjectsRequest): Promise<IApiResponseSuccessAndError<IGetSubjectsResponse[]>> => {
    try {
        const response = await getSubjects(data);
        console.log(response);
        if (response.status === 200) {
            if (response.data.length > 0) {
                return {
                    status: response.status,
                    data: response.data,
                    message: response.data.message,
                    responseStatus: 'DATA_FOUND'
                };
            } else {
                return {
                    status: response.status,
                    data: [],
                    message: response.data.message,
                    responseStatus: 'DATA_NOT_FOUND'
                };
            }
        }
        return {
            status: response.status,
            data: [],
            message: response.data.message,
            responseStatus: 'DATA_NOT_FOUND'
        };
    } catch (error: any) {
        console.log(error);
        return {
            status: error.status,
            data: [],
            message: error.message || 'Internal Server Error',
            responseStatus: 'ERROR'
        };
    }

}


export const GetChapters = async (data: IGetChapterRequest): Promise<IApiResponseSuccessAndError<IGetChapterResponse[]>> => {
    try {
        const response = await getChapters(data);
        console.log(response);
        if (response.status === 200) {
            if (response.data.length > 0) {
                return {
                    status: response.status,
                    data: response.data,
                    message: response.data.message,
                    responseStatus: 'DATA_FOUND'
                };
            } else {
                return {
                    status: response.status,
                    data: [],
                    message: response.data.message,
                    responseStatus: 'DATA_NOT_FOUND'
                };
            }
        }
        return {
            status: response.status,
            data: [],
            message: response.data.message,
            responseStatus: 'DATA_NOT_FOUND'
        };
    } catch (error: any) {
        console.log(error);
        return {
            status: error.status,
            data: [],
            message: error.message || 'Internal Server Error',
            responseStatus: 'ERROR'
        };
    }

}


export const GetChapterResources = async (data: IGetChapterResourcesRequest): Promise<IApiResponseSuccessAndError<IGetChapterResourcesResponse | null>> => {
    try {
        const response = await getChapterResources(data);
        console.log(response);
        if (response.status === 200) {
            if (response.data) {
                return {
                    status: response.status,
                    data: response.data,
                    message: response.data.message,
                    responseStatus: 'DATA_FOUND'
                };
            } else {
                return {
                    status: response.status,
                    data: null,
                    message: response.data.message,
                    responseStatus: 'DATA_NOT_FOUND'
                };
            }
        }
        return {
            status: response.status,
            data: null,
            message: response.data.message,
            responseStatus: 'DATA_NOT_FOUND'
        };
    } catch (error: any) {
        console.log(error);
        return {
            status: error.status,
            data: null,
            message: error.message || 'Internal Server Error',
            responseStatus: 'ERROR'
        };
    }

}


export const GetQuiz = async (data: IGetChapterQuizRequest): Promise<IApiResponseSuccessAndError<IQuizQuestion[]>> => {
    try {
        const response = await getQuestions(data);
        console.log(response);
        if (response.status === 200) {
            if (response.data) {
                return {
                    status: response.status,
                    data: response.data,
                    message: response.data.message,
                    responseStatus: 'DATA_FOUND'
                };
            } else {
                return {
                    status: response.status,
                    data: [],
                    message: response.data.message,
                    responseStatus: 'DATA_NOT_FOUND'
                };
            }
        }
        return {
            status: response.status,
            data: [],
            message: response.data.message,
            responseStatus: 'DATA_NOT_FOUND'
        };
    } catch (error: any) {
        console.log(error);
        return {
            status: error.status,
            data: [],
            message: error.message || 'Internal Server Error',
            responseStatus: 'ERROR'
        };
    }
}


export const GetFlashcards = async (data: IGetChapterFlashcardsRequest): Promise<IApiResponseSuccessAndError<IQuizQuestion[]>> => {
    try {
        const response = await getFlashcards(data);
        console.log(response);
        if (response.status === 200) {
            if (response.data) {
                return {
                    status: response.status,
                    data: response.data,
                    message: response.data.message,
                    responseStatus: 'DATA_FOUND'
                };
            } else {
                return {
                    status: response.status,
                    data: [],
                    message: response.data.message,
                    responseStatus: 'DATA_NOT_FOUND'
                };
            }
        }
        return {
            status: response.status,
            data: [],
            message: response.data.message,
            responseStatus: 'DATA_NOT_FOUND'
        };
    } catch (error: any) {
        console.log(error);
        return {
            status: error.status,
            data: [],
            message: error.message || 'Internal Server Error',
            responseStatus: 'ERROR'
        };
    }
}

export const Synthesizeaudio = async (data: ISynthesizeAudioRequest): Promise<ISynthesizeAudioResponse> => {
    const response = await synthesizeAudio(data);
    if (response.status === 200) {
        return {
            audio: response.data.audio,
            wordTimestamps: response.data.wordTimestamps,
        };
    }
    return {
        audio: '',
        wordTimestamps: [],
    };
};
