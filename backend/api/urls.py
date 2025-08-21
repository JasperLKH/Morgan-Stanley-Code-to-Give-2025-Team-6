from django.urls import path
from . import views

app_name = "core"

urlpatterns = [
    path("", views.TaskListCreateView.as_view(), name="home"),
    path("test/get/", views.testGet, name="test_get"),
    path("test/post/", views.testPost, name="test_post"),
    path("test/put/", views.testPut, name="test_put"),
    path("test/delete/", views.testDelete, name="test_delete"),
]
