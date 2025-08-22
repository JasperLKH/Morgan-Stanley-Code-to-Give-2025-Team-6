from django.urls import path
from . import views

app_name = "account"

urlpatterns = [
    path("login/", views.login, name="login"),
    path("signup/", views.signup, name="signup"),
    # path("logout/", views.logout, name="logout"),
    path("users/", views.get_all_users, name="get_all_users"),
    path("users/by-id/", views.get_user_by_id, name="get_user_by_id"),
    path("users/by-school/", views.get_user_by_school, name="get_user_by_school"),
    path("users/activate/", views.activate_user, name="activate_user"),
    path("users/deactivate/", views.deactivate_user, name="deactivate_user"),
]
