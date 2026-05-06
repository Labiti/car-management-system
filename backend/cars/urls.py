from django.urls import path
from . import views

urlpatterns = [
    path('', views.CarListCreateView.as_view(), name='car-list-create'),
    path('<int:pk>/', views.CarDetailView.as_view(), name='car-detail'),
    path('available/', views.AvailableCarsView.as_view(), name='available-cars'),
    path('<int:pk>/update-status/', views.UpdateCarStatusView.as_view(), name='update-status'),
]