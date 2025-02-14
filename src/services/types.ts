export interface Url {
    shortUrl: string;
    longUrl: string;
    customAlias?: string;
    topic?: string;
  }
  
  export interface ApiResponse {
    urls: Url[];
    message?: string;
  }
  
  export interface UpdateUrlData {
    longUrl?: string;
    customAlias?: string;
    topic?: string;
  }