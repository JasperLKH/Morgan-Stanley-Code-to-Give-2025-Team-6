from django.urls import path
from . import views

app_name = "account"

urlpatterns = [
    # Authentication
    path("login/", views.login, name="login"),
    path("signup/", views.signup, name="signup"),
    path("generate_accounts_by_school/", views.generate_accounts_by_school, name="generate_accounts_by_school"),
    # path("logout/", views.logout, name="logout"),
    
    # School Management - specific routes first
    path("schools/available/", views.get_available_schools, name="get_available_schools"),
    path("schools/<str:school_identifier>/users/delete-all/", views.delete_all_users_in_school, name="delete_all_users_in_school"),
    path("schools/<str:school_identifier>/users/", views.school_users, name="school_users"),
    path("schools/<str:school_identifier>/", views.school_detail, name="school_detail"),
    path("schools/", views.school_list_create, name="school_list_create"),
    
    # User Management
    path("users/", views.get_all_users, name="get_all_users"),
    path("users/by-id/", views.get_user_by_id, name="get_user_by_id"),
    path("users/by-school/", views.get_user_by_school, name="get_user_by_school"),
    path("users/activate/", views.activate_user, name="activate_user"),
    path("users/deactivate/", views.deactivate_user, name="deactivate_user"),
    path("users/update-name/", views.update_user_name, name="update_user_name"),
    
    # Leaderboard & Points
    path("leaderboard/weekly/", views.get_weekly_leaderboard, name="get_weekly_leaderboard"),
    path("points/weekly/reset/", views.reset_weekly_points, name="reset_weekly_points")
    ]
