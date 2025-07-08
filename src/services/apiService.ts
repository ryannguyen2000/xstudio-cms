import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_EXTERNAL_URL || 'http://localhost:4000/api'

export interface Project {
  id: string
  name: string
  description?: string
  status: 'active' | 'inactive' | 'draft'
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: string
  title: string
  content?: string
  projectId: string
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

class ApiService {
  private axiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async getProjects(userId: string): Promise<Project[]> {
    try {
      if (!userId) {
        return []
      }
      const response = await this.axiosInstance.get('/cms/getCmsProject', {
        params: {
          userId,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching projects:', error)
      return []
    }
  }

  async getProject(id: string): Promise<Project | null> {
    try {
      const response = await this.axiosInstance.get(`/projects/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching project:', error)
      return null
    }
  }

  async getDocuments(projectId?: string): Promise<Document[]> {
    try {
      console.log('projectId', projectId)
      const url = projectId ? `/cms/getCmsDocumentsData?projectId=${projectId}` : ''
      const response = await this.axiosInstance.get(url)
      return response.data?.data
    } catch (error) {
      console.error('Error fetching documents:', error)
      return []
    }
  }

  async getDocument({
    projectId,
    layoutId,
  }: {
    projectId: string
    layoutId: string
  }): Promise<Document | null> {
    try {
      const response = await this.axiosInstance.get(`/documents/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching document:', error)
      return null
    }
  }

  async getCmsLayouts({ documentId, type }: { documentId?: string; type?: string }) {
    try {
      const response = await this.axiosInstance.get(
        `/cms/getCmsLayouts?documentId=${documentId}&typeLayout=${type}`,
      )
      return response?.data?.data
    } catch (error) {
      console.error('Error fetching document:', error)
      return null
    }
  }

  async getCmsLayoutDetail(layoutId?: string) {
    try {
      const response = await this.axiosInstance.get(`/cms/getCmsLayout/${layoutId}`)
      return response?.data?.data
    } catch (error) {
      console.error('Error fetching document:', error)
      return null
    }
  }

  async uploadMediaToServer(file: File) {
    try {
      const formData = new FormData()
      formData.append('media', file)

      const response = await this.axiosInstance.post(`/uploadMedia`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 200 || response.status === 201) {
        return response.data?.mediaUrl
      }
    } catch (error) {
      return null
    }
  }

  async updateCmsLayout({
    isPublished,
    cmsLayoutId,
    layoutId,
    layoutJson,
  }: {
    isPublished: boolean
    cmsLayoutId: string
    layoutId?: string
    layoutJson?: string
  }) {
    console.log('isPublished', isPublished)
    try {
      const response = await this.axiosInstance.put(`/cms/updateCmsLayout`, {
        isPublished,
        cmsLayoutId,
        layoutId,
        layoutJson,
      })

      if (response.status === 200 || response.status === 201) {
        return
      }
    } catch (error) {
      return null
    }
  }
}

export const apiService = new ApiService()
