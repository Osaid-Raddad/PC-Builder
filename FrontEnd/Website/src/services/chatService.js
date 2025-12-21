import axios from 'axios';
import * as signalR from '@microsoft/signalr';

const API_BASE_URL = 'https://pcbuilder.runasp.net/api';
const HUB_URL = 'https://pcbuilder.runasp.net/chatHub';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/Admins/Users/GetAllUsers');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get chat messages between users
export const getChat = async (userId) => {
  try {
    const response = await axiosInstance.get(`/Chat/GetChat/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
};

// SignalR Connection Management
let hubConnection = null;

export const createHubConnection = async (token) => {
  if (hubConnection) {
    return hubConnection;
  }

  hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => token,
      skipNegotiation: false,
      transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  try {
    await hubConnection.start();
    console.log('SignalR Connected successfully');
    return hubConnection;
  } catch (error) {
    console.error('Error connecting to SignalR hub:', error);
    throw error;
  }
};

export const stopHubConnection = async () => {
  if (hubConnection) {
    try {
      await hubConnection.stop();
      hubConnection = null;
      console.log('SignalR Disconnected');
    } catch (error) {
      console.error('Error stopping SignalR connection:', error);
    }
  }
};

export const getHubConnection = () => hubConnection;

export const sendMessage = async (recipientId, message) => {
  if (hubConnection && hubConnection.state === signalR.HubConnectionState.Connected) {
    try {
      await hubConnection.invoke('SendMessage', recipientId, message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  } else {
    throw new Error('Hub connection is not established');
  }
};

// Filter users based on current user role
export const filterUsersByRole = (users, currentUserRole) => {
  if (!users || !Array.isArray(users)) return [];
  
  const normalizedRole = currentUserRole?.toLowerCase();
  
  switch (normalizedRole) {
    case 'user':
      // Users see: Admin, SuperAdmin, TechSupport
      return users.filter(user => 
        ['admin', 'superadmin', 'techsupport'].includes(user.role?.toLowerCase())
      );
    
    case 'admin':
    case 'superadmin':
      // Admin and SuperAdmin see: everyone (Admin, SuperAdmin, TechSupport, User)
      return users;
    
    case 'techsupport':
      // TechSupport sees: Admin, SuperAdmin, Users only
      return users.filter(user => 
        ['admin', 'superadmin', 'user'].includes(user.role?.toLowerCase())
      );
    
    default:
      // Default: show Admin, SuperAdmin, TechSupport
      return users.filter(user => 
        ['admin', 'superadmin', 'techsupport'].includes(user.role?.toLowerCase())
      );
  }
};
