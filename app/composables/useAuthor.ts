export const useAuthor = () => {
  const { $api } = useNuxtApp();
  const toast = useToast();

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const clearError = () => {
    error.value = null;
  };

  // Get all authors with pagination and filtering
  const getAuthors = async (
    page = 1,
    limit = 10,
    search?: string,
    expertise?: string
  ) => {
    isLoading.value = true;
    clearError();
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (expertise) params.expertise = expertise;

      const response = await $api("/users/authors", {
        method: "GET",
        params,
      });
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch authors";
      toast.add({
        title: "Error",
        description: error.value,
        color: "error",
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Get author by ID
  const getAuthorById = async (authorId: string) => {
    isLoading.value = true;
    clearError();
    try {
      const response = await $api(`/users/authors/${authorId}`, {
        method: "GET",
      });
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch author";
      toast.add({
        title: "Error",
        description: error.value,
        color: "error",
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Get popular authors
  const getPopularAuthors = async (limit = 10) => {
    try {
      const response = await $api("/users/authors/popular", {
        method: "GET",
        params: { limit },
      });
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch popular authors";
      toast.add({
        title: "Error",
        description: error.value,
        color: "error",
      });
      throw err;
    }
  };

  // Search authors
  const searchAuthors = async (query: string, limit = 20) => {
    try {
      const response = await $api("/users/authors/search", {
        method: "GET",
        params: { q: query, limit },
      });
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Failed to search authors";
      toast.add({
        title: "Error",
        description: error.value,
        color: "error",
      });
      throw err;
    }
  };

  const getAuthorStats = async (authorId?: string) => {
    isLoading.value = true;
    clearError();
    try {
      const endpoint = authorId ? `/users/authors/${authorId}/stats` : "/users/authors/me/stats";
      const response = await $api(endpoint, {
        method: "GET",
      });
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch author stats";
      toast.add({
        title: "Error",
        description: error.value,
        color: "error",
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getMyRecipes = async (params?: {
    page?: number;
    limit?: number;
    status?: "draft" | "published" | "all";
  }) => {
    isLoading.value = true;
    clearError();
    try {
      const response = await $api("/author/recipes", {
        method: "GET",
        params,
      });
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch author recipes";
      toast.add({
        title: "Error",
        description: error.value,
        color: "error",
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createRecipe = async (recipeData: any) => {
    isLoading.value = true;
    clearError();
    try {
      const response = await $api("/recipes", {
        method: "POST",
        body: recipeData,
      });
      toast.add({
        title: "Success",
        description: "Recipe created successfully",
        color: "success",
      });
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Failed to create recipe";
      toast.add({
        title: "Error",
        description: error.value,
        color: "error",
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateRecipe = async (recipeId: string, recipeData: any) => {
    isLoading.value = true;
    clearError();
    try {
      const response = await $api(`/recipes/${recipeId}`, {
        method: "PUT",
        body: recipeData,
      });
      toast.add({
        title: "Success",
        description: "Recipe updated successfully",
        color: "success",
      });
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Failed to update recipe";
      toast.add({
        title: "Error",
        description: error.value,
        color: "error",
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    isLoading.value = true;
    clearError();
    try {
      await $api(`/recipes/${recipeId}`, {
        method: "DELETE",
      });
      toast.add({
        title: "Success",
        description: "Recipe deleted successfully",
        color: "success",
      });
    } catch (err: any) {
      error.value = err.message || "Failed to delete recipe";
      toast.add({
        title: "Error",
        description: error.value,
        color: "error",
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getAuthorAnalytics = async (params?: {
    period?: "week" | "month" | "year";
  }) => {
    isLoading.value = true;
    clearError();
    try {
      const response = await $api("/author/analytics", {
        method: "GET",
        params,
      });
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch analytics";
      toast.add({
        title: "Error",
        description: error.value,
        color: "error",
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateAuthorProfile = async (authorId: string, profileData: any) => {
    isLoading.value = true;
    clearError();
    try {
      const response = await $api(`/users/authors/${authorId}/profile`, {
        method: "PATCH",
        body: profileData,
      });
      toast.add({
        title: "Success",
        description: "Profile updated successfully",
        color: "success",
      });
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Failed to update profile";
      toast.add({
        title: "Error",
        description: error.value,
        color: "error",
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Get author's recipes
  const getAuthorRecipes = async (authorId: string, page = 1, limit = 10) => {
    try {
      const response = await $api(`/recipes/author/${authorId}`, {
        method: "GET",
        params: { page, limit },
      });
      return response.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch author recipes";
      toast.add({
        title: "Error",
        description: error.value,
        color: "error",
      });
      throw err;
    }
  };

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    clearError,
    getAuthors,
    getAuthorById,
    getPopularAuthors,
    searchAuthors,
    getAuthorStats,
    getAuthorRecipes,
    getMyRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getAuthorAnalytics,
    updateAuthorProfile,
  };
};