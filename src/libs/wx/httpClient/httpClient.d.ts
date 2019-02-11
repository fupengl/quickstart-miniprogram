declare namespace wxHttpClient {
  interface requestOptions {
    url: string
    method: string
    data: any
    header: object
    [key: string]: any
  }
}
