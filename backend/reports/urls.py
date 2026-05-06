from django.urls import path
from . import views

urlpatterns = [
    path('dashboard-stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('bookings/', views.BookingReportView.as_view(), name='booking-report'),
    path('trips/', views.TripReportView.as_view(), name='trip-report'),
    path('maintenance/', views.MaintenanceReportView.as_view(), name='maintenance-report'),
    path('costs/', views.CostReportView.as_view(), name='cost-report'),
    path('departments/', views.DepartmentReportView.as_view(), name='department-report'),
    path('export/', views.ExportReportView.as_view(), name='export-report'),
]