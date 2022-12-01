import axios from "axios";
import { getAuth } from "firebase/auth";
import { BASE_API_URL } from "../appConfig";

const baseURL = BASE_API_URL;
export const api = async (method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: any, token?: string) => {
	let token0 = token;
	if(!token0){
		token0 =  await getAuth().currentUser.getIdToken();
	}
	const response = await axios({
		method,
		baseURL,
		data,
		url,
		headers: {
			authorization: `Bearer ${token0}`	
		}
	})
	return response.data;
}

export const apiNoAuth = async (method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: any) => {
	const response = await axios({
		method,
		baseURL,
		data,
		url
	})
	return response.data;
}

export const apiAutoAuth = async (method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: any) => {
	let token0;
	if(!token0){
		token0 =  await getAuth().currentUser?.getIdToken();
	}
	const response = await axios({
		method,
		baseURL,
		data,
		url,
		headers: token0 ?{
			authorization: `Bearer ${token0}`	
		} : {}
	})
	return response.data;
}