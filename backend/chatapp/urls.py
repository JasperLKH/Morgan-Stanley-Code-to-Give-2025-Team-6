from django.urls import path
from . import views

app_name = "chatapp"

urlpatterns = [
    # Conversation management
    path("conversations/", views.get_conversations, name="get_conversations"),
    path("conversations/create/", views.create_private_conversation, name="create_private_conversation"),
    path("conversations/create-group/", views.create_group_conversation, name="create_group_conversation"),
    path("conversations/<int:conversation_id>/", views.get_conversation_detail, name="get_conversation_detail"),
    path("conversations/find/", views.find_conversation, name="find_conversation"),
    
    # Message management
    path("conversations/<int:conversation_id>/messages/", views.send_message, name="send_message"),
    path("conversations/<int:conversation_id>/messages/list/", views.get_messages, name="get_messages"),
    path("messages/<int:message_id>/delete/", views.delete_message, name="delete_message"),
    
    # Group management
    path("conversations/<int:conversation_id>/add-participants/", views.add_participants, name="add_participants"),
    path("conversations/<int:conversation_id>/remove-participant/", views.remove_participant, name="remove_participant"),
    path("conversations/<int:conversation_id>/leave/", views.leave_conversation, name="leave_conversation"),
    
    # User search
    path("users/search/", views.search_users, name="search_users"),
    
    # Questionnaire management
    path("questionnaires/", views.questionnaire_list_create, name="questionnaire_list_create"),
    path("questionnaires/<int:pk>/", views.questionnaire_detail, name="questionnaire_detail"),
    path("questionnaires/<int:pk>/deactivate/", views.questionnaire_deactivate, name="questionnaire_deactivate"),
    path("questionnaires/<int:pk>/activate/", views.questionnaire_activate, name="questionnaire_activate"),
]
