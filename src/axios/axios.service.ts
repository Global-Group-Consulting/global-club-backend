import {Inject, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {HttpService} from "@nestjs/axios";
import {Request} from "express";
import {Observable} from "rxjs";


@Injectable()
export class AxiosService {
  private instance: AxiosInstance;
  
  constructor(private configService: ConfigService,
              @Inject("REQUEST") private httpRequest: Request) {
    
    this.instance = axios.create({
      baseURL: this.configService.get<string>('http.mainServerUrl'),
      withCredentials: true
    })
    
    this.instance.interceptors.request.use((v: AxiosRequestConfig) => this.reqInterceptor(v))
    this.instance.interceptors.response.use(null, (er: any) => this.errInterceptor(er))
  }
  
  private reqInterceptor(axiosConfig: AxiosRequestConfig): AxiosRequestConfig {
    const reqHeaders: any = this.httpRequest.headers || {};
  
    axiosConfig.headers['client-key'] = reqHeaders["client-key"];
    
    // Set Authorization header only if there is a value to set
    if (reqHeaders.authorization) {
      axiosConfig.headers['Authorization'] = reqHeaders.authorization;
    }
    
    return axiosConfig
  }
  
  /*private respInterceptor(axiosResp: AxiosResponse): AxiosResponse {
    return axiosResp
  }*/
  
  private errInterceptor(error) {
    error.message = error.response?.data?.error?.message
    
    return Promise.reject(error);
  }
  
  request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.request(config)
  };
  
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config)
  };
  
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config)
  };
  
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.head(url, config)
  };
  
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config)
  };
  
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config)
  };
  
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch(url, data, config)
  };
  
  get axiosRef(): AxiosInstance {
    return this.instance
  };
}
