from django.urls import path
from . import views

urlpatterns = [
    # Assignment CRUD
    path('', views.assignment_list_create, name='assignment-list-create'),
    path('<int:pk>/', views.assignment_detail, name='assignment-detail'),
    
    # User assignments
    path('user/<int:user_id>/', views.user_assignments, name='user-assignments'),
    
    # Assignment actions
    path('<int:pk>/hide/', views.assignment_hide, name='assignment-hide'),
    path('<int:pk>/unhide/', views.assignment_unhide, name='assignment-unhide'),
    path('<int:pk>/update-deadline/', views.assignment_update_deadline, name='assignment-update-deadline'),
    path('<int:assignment_pk>/assign/', views.assign_to_parents, name='assign-to-parents'),
    
    # Assignment submissions
    path('<int:assignment_pk>/submissions/', views.assignment_submissions, name='assignment-submissions'),
    path('<int:assignment_pk>/submit/', views.submit_assignment, name='submit-assignment'),
    path('submissions/<int:submission_pk>/grade/', views.grade_submission, name='grade-submission'),
    path('submissions/<int:submission_pk>/feedback/', views.update_submission_feedback, name='update-submission-feedback'),
    path('submissions/<int:submission_pk>/edit/', views.edit_submission, name='edit-submission'),
]
