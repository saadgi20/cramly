import axios from "axios"
import { setUserData } from "../redux/userSlice.js"

export const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000"


export const getCurrentUser = async (dispatch) => {
  try {
    const result = await axios.get(serverUrl + "/api/user/currentuser", {
      withCredentials: true,
      timeout: 3000
    })
    console.log(result.data)
    dispatch(setUserData(result.data))
  } catch (error) {
    console.log(error)
  }
}

export const generateNotes = async (payload) => {
  try {
    const result = await axios.post(serverUrl + "/api/notes/generate-notes", payload, {
      withCredentials: true
    })
    console.log(result.data)
    return result.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const searchNotes = async (query = "") => {
  const result = await axios.get(serverUrl + "/api/notes/search", {
    params: { q: query },
    withCredentials: true,
    timeout: 5000
  })

  return result.data
}

export const getNoteById = async (noteId) => {
  const result = await axios.get(serverUrl + `/api/notes/${noteId}`, {
    withCredentials: true,
    timeout: 5000
  })

  return result.data
}

export const downloadPdf = async (result) => {
    try {
        const response = await axios.post(serverUrl+ "/api/pdf/generate-pdf" , {result} , {
            responseType:"blob" , withCredentials:true
        })

        const blob = new Blob([response.data], {
      type: "application/pdf"
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "CramlyAI.pdf";
    link.click();

    window.URL.revokeObjectURL(url);
    } catch (error) {
         throw new Error("PDF download failed");

    }
}
