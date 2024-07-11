import axios, { AxiosRequestConfig } from 'axios';

export class HttpService {
  async postDebt(data: any, debt: any): Promise<any> {
    //overweite doc id to be debt.id
    data.debt.docId = debt.id;
    const config: AxiosRequestConfig = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://staging.adamspay.com/api/v1/debts',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.API_KEY,
      },
      data: JSON.stringify(data),
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error('Error making HTTP request');
    }
  }
  async post(url: string, data: any, headers: any = {}): Promise<any> {
    return axios.post(url, data, { headers });
  }

  async get(url: string, headers: any = {}): Promise<any> {
    return axios.get(url, { headers });
  }
}