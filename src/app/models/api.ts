export interface ApiResponseModel<T> {
    status: 'string',
    data:{data: T},
    message: 'string'
}
