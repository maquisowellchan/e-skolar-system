from django.contrib import admin
from django.urls import path, include, re_path
from eskolar.views import (
    register, verify_email, admin_register, login_view, admin_verify_email,
    FormDetail, FormRetrieveUpdateDestroyView, RolesRetrieveUpdateDestroyView,
    RolesListCreateView, UserProfileView, UserRetrieveUpdateDestroyView,
    FormList, UserProfileView, 
)
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/register/', register, name='register'),
    path('api/login/', login_view, name='login_view'),
    path('verify-email/<str:token>/', verify_email, name='verify_email'),
    path('api/registeradmin/', admin_register, name='register'),
    path('api/fetchroles/<int:pk>/', RolesRetrieveUpdateDestroyView.as_view(), name='roles-detail'),
    path('api/fetchroles/', RolesListCreateView.as_view(), name='roles-list'),
    path('api/admin/verify-email/<str:token>/', admin_verify_email, name='verify_email'),
    path('forms/', FormList.as_view(), name='form-list'),
    path('forms/<int:pk>/', FormDetail.as_view(), name='form-detail'),
    path('forms/<int:pk>/', FormRetrieveUpdateDestroyView.as_view(), name='form-retrieve-update-destroy'),
    path('userprofile/', UserProfileView.as_view(), name='userprofile'),
    path('userprofile/<int:pk>/', UserProfileView.as_view(), name='userprofile-list-create'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]


