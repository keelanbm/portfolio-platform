import { toast } from 'sonner'

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    })
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 6000,
    })
  },

  loading: (message: string) => {
    return toast.loading(message)
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: unknown) => string)
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
      duration: 4000,
    })
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    })
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
    })
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId)
  },
}

// Common toast messages
export const toastMessages = {
  // Authentication
  auth: {
    loginRequired: 'Please sign in to continue',
    loginSuccess: 'Welcome back!',
    logoutSuccess: 'Signed out successfully',
  },

  // Projects
  project: {
    created: 'Project created successfully!',
    updated: 'Project updated successfully!',
    deleted: 'Project deleted successfully',
    liked: 'Added to your likes',
    unliked: 'Removed from your likes',
    uploadError: 'Failed to upload project. Please try again.',
    loadError: 'Failed to load project',
  },

  // Social Actions
  social: {
    followed: 'Successfully followed user',
    unfollowed: 'Successfully unfollowed user',
    followError: 'Failed to follow user',
    shareSuccess: 'Link copied to clipboard!',
    shareError: 'Failed to copy link',
  },

  // Comments
  comment: {
    added: 'Comment added successfully',
    updated: 'Comment updated successfully',
    deleted: 'Comment deleted successfully',
    liked: 'Comment liked',
    unliked: 'Comment unliked',
    loadError: 'Failed to load comments',
    addError: 'Failed to add comment',
  },

  // Collections
  collection: {
    created: 'Collection created successfully!',
    updated: 'Collection updated successfully!',
    deleted: 'Collection deleted successfully',
    projectAdded: 'Project added to collection',
    projectRemoved: 'Project removed from collection',
    createError: 'Failed to create collection',
    updateError: 'Failed to update collection',
    deleteError: 'Failed to delete collection',
    loadError: 'Failed to load collections',
  },

  // Generic
  generic: {
    success: 'Success!',
    error: 'Something went wrong',
    loading: 'Loading...',
    saveSuccess: 'Changes saved successfully',
    saveError: 'Failed to save changes',
    networkError: 'Network error. Please check your connection.',
    unauthorized: 'You are not authorized to perform this action',
  },

  // File uploads
  upload: {
    success: 'File uploaded successfully',
    error: 'Failed to upload file',
    invalidType: 'Invalid file type',
    tooLarge: 'File is too large',
    tooMany: 'Too many files selected',
  },
}