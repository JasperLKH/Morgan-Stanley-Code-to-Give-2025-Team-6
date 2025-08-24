const API_BASE_URL = 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      };
    }
  }

  // Authentication
  async login(username: string, password: string) {
    return this.makeRequest('/account/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // User Management
  async getUserById(userId: string) {
    return this.makeRequest(`/account/users/by-id/?user_id=${userId}`);
  }

  async getAllUsers() {
    return this.makeRequest('/account/users/');
  }

  async getWeeklyLeaderboard() {
    return this.makeRequest('/account/leaderboard/weekly/');
  }

  // Assignment Management
  async getUserAssignments(userId: number) {
    return this.makeRequest(`/assignments/user/${userId}/`);
  }

  async getAllAssignments() {
    return this.makeRequest('/assignments/');
  }

  async submitAssignment(assignmentId: number, formData: FormData) {
    return this.makeRequest(`/assignments/${assignmentId}/submit/`, {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  async getAssignmentSubmissions(assignmentId: number) {
    return this.makeRequest(`/assignments/${assignmentId}/submissions/`);
  }

  // Chat Management
  async getConversations(userId: number) {
    return this.makeRequest(`/chat/conversations/?user_id=${userId}`);
  }

  async getConversationDetail(conversationId: number) {
    return this.makeRequest(`/chat/conversations/${conversationId}/`);
  }

  async getMessages(conversationId: number) {
    return this.makeRequest(`/chat/conversations/${conversationId}/messages/list/`);
  }

  async sendMessage(conversationId: number, content: string, messageType = 'text') {
    return this.makeRequest(`/chat/conversations/${conversationId}/messages/`, {
      method: 'POST',
      body: JSON.stringify({ content, message_type: messageType }),
    });
  }

  async createPrivateConversation(participantIds: number[]) {
    return this.makeRequest('/chat/conversations/create/', {
      method: 'POST',
      body: JSON.stringify({ participant_ids: participantIds }),
    });
  }

  async searchUsers(query: string) {
    return this.makeRequest(`/chat/users/search/?q=${encodeURIComponent(query)}`);
  }

  // Forum Management
  async getForumPosts() {
    return this.makeRequest('/forum/posts/');
  }

  async createForumPost(title: string, content: string, category?: string) {
    return this.makeRequest('/forum/posts/', {
      method: 'POST',
      body: JSON.stringify({ title, content, category }),
    });
  }

  async getForumComments(postId: number) {
    return this.makeRequest(`/forum/posts/${postId}/comments/`);
  }

  async createForumComment(postId: number, content: string) {
    return this.makeRequest(`/forum/posts/${postId}/comments/`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async toggleForumLike(postId: number) {
    return this.makeRequest(`/forum/posts/${postId}/like/`, {
      method: 'POST',
    });
  }

  // Questionnaire Management
  async getQuestionnaires() {
    return this.makeRequest('/chat/questionnaires/');
  }

  async createQuestionnaire(title: string, questions: string[], isActive = true) {
    return this.makeRequest('/chat/questionnaires/', {
      method: 'POST',
      body: JSON.stringify({ title, questions, is_active: isActive }),
    });
  }

  async getQuestionnaireDetail(id: number) {
    return this.makeRequest(`/chat/questionnaires/${id}/`);
  }

  async activateQuestionnaire(id: number) {
    return this.makeRequest(`/chat/questionnaires/${id}/activate/`, {
      method: 'POST',
    });
  }

  async deactivateQuestionnaire(id: number) {
    return this.makeRequest(`/chat/questionnaires/${id}/deactivate/`, {
      method: 'POST',
    });
  }

  // Rewards Management (using points from user data for now)
  async getAvailableRewards() {
    // Mock rewards for now - in a real system this would be a separate model
    return Promise.resolve({
      success: true,
      data: [
        {
          id: 1,
          name: "McDonald's Happy Meal",
          description: 'Free Happy Meal voucher',
          cost: 50,
          category: 'voucher',
          available: true
        },
        {
          id: 2,
          name: 'Toy Store Discount',
          description: '20% off at Toys"R"Us',
          cost: 75,
          category: 'coupon',
          available: true
        },
        {
          id: 3,
          name: 'Museum Family Pass',
          description: 'Free entry for family of 4',
          cost: 100,
          category: 'activity',
          available: true
        },
        {
          id: 4,
          name: 'Cinema Tickets',
          description: '2 free movie tickets',
          cost: 80,
          category: 'voucher',
          available: false
        }
      ]
    });
  }

  async redeemReward(rewardId: number, userId: string) {
    // Mock redemption - in a real system this would update user points and create a redemption record
    return Promise.resolve({
      success: true,
      data: { message: 'Reward redeemed successfully!' }
    });
  }

  // Staff Rewards Management
  async getAllRewards() {
    // Mock all rewards for staff management
    return Promise.resolve({
      success: true,
      data: [
        {
          id: '1',
          name: 'McDonald\'s Happy Meal',
          description: 'Free Happy Meal voucher redeemable at any McDonald\'s location',
          category: 'voucher',
          cost: 50,
          stockQuantity: 25,
          isUnlimited: false,
          isActive: true,
          createdDate: '2024-12-15',
          totalRedeemed: 12,
          icon: 'coffee',
          validUntil: '2025-03-31',
          terms: 'Valid at participating McDonald\'s locations. Cannot be combined with other offers.'
        },
        {
          id: '2',
          name: 'Toy Store Discount',
          description: '20% off voucher for major toy retailers',
          category: 'coupon',
          cost: 75,
          stockQuantity: 40,
          isUnlimited: false,
          isActive: true,
          createdDate: '2024-12-10',
          totalRedeemed: 8,
          icon: 'gift',
          validUntil: '2025-06-30',
          terms: 'Valid at participating toy stores. Cannot be combined with other discounts.'
        },
        {
          id: '3',
          name: 'Museum Family Pass',
          description: 'Free family admission to local science museum',
          category: 'activity',
          cost: 100,
          stockQuantity: 15,
          isUnlimited: false,
          isActive: true,
          createdDate: '2024-12-08',
          totalRedeemed: 25,
          icon: 'users',
          validUntil: '2025-12-31',
          terms: 'Valid for family of up to 4 members. Must be used within 6 months.'
        }
      ]
    });
  }

  async createReward(rewardData: any, userId?: string) {
    const headers: any = {};
    if (userId) {
      headers['User-ID'] = userId;
    }
    // Mock reward creation
    return Promise.resolve({
      success: true,
      data: {
        id: String(Date.now()),
        ...rewardData,
        createdDate: new Date().toISOString().split('T')[0],
        totalRedeemed: 0,
        isActive: true
      }
    });
  }

  async updateReward(rewardId: string, rewardData: any) {
    // Mock reward update
    return Promise.resolve({
      success: true,
      data: { ...rewardData, id: rewardId }
    });
  }

  async deleteReward(rewardId: string) {
    // Mock reward deletion
    return Promise.resolve({
      success: true,
      data: { message: 'Reward deleted successfully' }
    });
  }

  async toggleRewardStatus(rewardId: string, isActive: boolean) {
    // Mock toggle reward status
    return Promise.resolve({
      success: true,
      data: { id: rewardId, isActive }
    });
  }

  async getRewardStats() {
    // Mock reward statistics
    return Promise.resolve({
      success: true,
      data: {
        totalRedemptions: 100,
        pointsRedeemed: 6850,
        popularReward: 'Digital Storybook Collection',
        activeRewards: 12
      }
    });
  }

  // Performance and Analytics
  async getUserPerformance(userId: number) {
    return this.makeRequest(`/assignments/user/${userId}/performance/`);
  }

  async getSubjectProgress(userId: number) {
    return this.makeRequest(`/assignments/user/${userId}/progress/`);
  }

  // Parent-specific endpoints
  async getChildrenAssignments(parentId: number) {
    return this.makeRequest(`/assignments/parent/${parentId}/children/`);
  }

  async getChildrenProgress(parentId: number) {
    return this.makeRequest(`/account/parent/${parentId}/children/progress/`);
  }

  // Enhanced user endpoints
  async updateUserProfile(userId: number, profileData: any) {
    return this.makeRequest(`/account/users/${userId}/`, {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  async getUserByRole(role: string) {
    return this.makeRequest(`/account/users/?role=${role}`);
  }

  // Assignment feedback
  async getAssignmentFeedback(assignmentId: number) {
    return this.makeRequest(`/assignments/${assignmentId}/feedback/`);
  }

  async createAssignmentFeedback(assignmentId: number, feedback: string, grade?: string) {
    return this.makeRequest(`/assignments/${assignmentId}/feedback/`, {
      method: 'POST',
      body: JSON.stringify({ feedback, grade }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
