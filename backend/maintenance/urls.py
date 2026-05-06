from django.urls import path
from . import views

urlpatterns = [
    path('maintenance/', views.MaintenanceRecordListCreateView.as_view(), name='maintenance-list'),
    path('maintenance/<int:pk>/', views.MaintenanceRecordDetailView.as_view(), name='maintenance-detail'),
    path('maintenance/upcoming/', views.UpcomingMaintenanceView.as_view(), name='maintenance-upcoming'),
    path('maintenance/overdue/', views.OverdueMaintenanceView.as_view(), name='maintenance-overdue'),
    path('maintenance/<int:pk>/complete/', views.CompleteMaintenanceView.as_view(), name='maintenance-complete'),
    path('reminders/', views.ServiceReminderListCreateView.as_view(), name='reminder-list'),
    path('reminders/<int:pk>/', views.ServiceReminderDetailView.as_view(), name='reminder-detail'),
    path('insurance/', views.InsuranceRecordListCreateView.as_view(), name='insurance-list'),
    path('insurance/<int:pk>/', views.InsuranceRecordDetailView.as_view(), name='insurance-detail'),
]