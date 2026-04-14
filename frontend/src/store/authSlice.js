import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api/auth'

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/profile`, { withCredentials: true })
    return res.data
  } catch {
    return rejectWithValue(null)
  }
})

export const login = createAsyncThunk('auth/login', async (form, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/login`, form, { withCredentials: true })
    return res.data.user
  } catch (err) {
    const message = err.response?.data?.message || 'Something went wrong'
    return rejectWithValue(Array.isArray(message) ? message[0] : message)
  }
})

export const register = createAsyncThunk('auth/register', async (form, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/register`, form, { withCredentials: true })
    return res.data.user
  } catch (err) {
    const message = err.response?.data?.message || 'Something went wrong'
    return rejectWithValue(Array.isArray(message) ? message[0] : message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await axios.post(`${API_URL}/logout`, {}, { withCredentials: true })
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => { state.loading = true })
      .addCase(checkAuth.fulfilled, (state, action) => { state.user = action.payload; state.loading = false })
      .addCase(checkAuth.rejected, (state) => { state.user = null; state.loading = false })
      .addCase(login.fulfilled, (state, action) => { state.user = action.payload })
      .addCase(register.fulfilled, (state, action) => { state.user = action.payload })
      .addCase(logout.fulfilled, (state) => { state.user = null })
  },
})

export default authSlice.reducer
