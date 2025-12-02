from django.urls import path
from . import views

urlpatterns = [
    path('stories/', views.stories_list, name='stories_list'),
    path('stories/create/', views.stories_create, name='stories_create'),
    path('stories/translate/', views.translate_preview, name='translate_emojis'),
    path('stories/<int:id>/like/', views.like_story, name='like_story'),
]
