from django.urls import path
from . import views

urlpatterns = [
    # Forum posts
    path("posts/", views.forum_posts, name="forum_posts"),  # GET: list, POST: create
    path("posts/<int:pk>/", views.forum_post_detail, name="forum_post_detail"),  # GET/PUT/DELETE
    
    # Post management (staff only)
    path("posts/<int:post_pk>/approve/", views.approve_post, name="approve_post"),
    path("posts/<int:post_pk>/reject/", views.reject_post, name="reject_post"),
    path("posts/<int:post_pk>/pin/", views.toggle_pin, name="toggle_pin"),
    path("posts/pending/", views.pending_posts, name="pending_posts"),
    
    # Attachments
    path("posts/<int:post_pk>/attachments/", views.upload_attachment, name="upload_attachment"),
    
    # Likes
    path("posts/<int:post_pk>/like/", views.toggle_like, name="toggle_like"),
    
    # Comments
    path("posts/<int:post_pk>/comments/", views.forum_comments, name="forum_comments"),  # GET/POST
    path("comments/<int:comment_pk>/", views.comment_detail, name="comment_detail"),  # PUT/DELETE
]
