import { getChapters, getSubjects } from "../api/contentApi/contentApi";
import { IGetChapterRequest, IGetChapterResponse, IGetSubjectsRequest, IGetSubjectsResponse } from "../api/contentApi/contentApi.interface";
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