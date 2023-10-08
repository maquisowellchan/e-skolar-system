
from django.contrib import admin
from django.urls import path
from eskolar.views import register, verify_email, admin_register, admin_verify_email, FormListCreateView,FormRetrieveUpdateDestroyView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', register, name='register'),
    path('api/verify-email/<str:token>/', verify_email, name='verify_email'),
    path('api/registeradmin/', admin_register, name='register'),
    path('api/admin/verify-email/<str:token>/', admin_verify_email, name='verify_email'),
    path('forms/', FormListCreateView.as_view(), name='form-list-create'),
    path('forms/<int:pk>/', FormRetrieveUpdateDestroyView.as_view(), name='form-retrieve-update-destroy'),
]

