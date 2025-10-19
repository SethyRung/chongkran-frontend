export const useFollow = () => {
  const { $api } = useNuxtApp()
  const { user } = useAuth()

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const followUser = async (authorId: string): Promise<void> => {
    if (!user.value) {
      throw new Error('You must be logged in to follow users')
    }

    isLoading.value = true
    error.value = null

    try {
      await $api.post('/follows', {
        followingId: authorId
      })
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to follow user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const unfollowUser = async (authorId: string): Promise<void> => {
    if (!user.value) {
      throw new Error('You must be logged in to unfollow users')
    }

    isLoading.value = true
    error.value = null

    try {
      await $api.delete('/follows', {
        data: {
          followingId: authorId
        }
      })
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to unfollow user'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const checkIfFollowing = async (authorId: string): Promise<boolean> => {
    if (!user.value) return false

    try {
      const response = await $api.get(`/follows/is-following/${authorId}`)
      return response.data.isFollowing
    } catch (err) {
      console.error('Failed to check follow status:', err)
      return false
    }
  }

  const getFollowers = async (userId: string, page = 1, limit = 10) => {
    try {
      const response = await $api.get(`/follows/followers/${userId}`, {
        params: { page, limit }
      })
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch followers'
      throw err
    }
  }

  const getFollowing = async (userId: string, page = 1, limit = 10) => {
    try {
      const response = await $api.get(`/follows/following/${userId}`, {
        params: { page, limit }
      })
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch following'
      throw err
    }
  }

  const getFollowStats = async (userId: string) => {
    try {
      const response = await $api.get(`/follows/stats/${userId}`)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch follow stats'
      throw err
    }
  }

  return {
    followUser,
    unfollowUser,
    checkIfFollowing,
    getFollowers,
    getFollowing,
    getFollowStats,
    isLoading: readonly(isLoading),
    error: readonly(error)
  }
}