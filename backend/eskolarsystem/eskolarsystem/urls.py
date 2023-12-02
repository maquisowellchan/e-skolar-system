from django.contrib import admin
from django.urls import path, include, re_path
from eskolar.views import (
    verify_email, LoginView, admin_verify_email,
    FormDetail, FormRetrieveUpdateDestroyView, RolesRetrieveUpdateDestroyView,
    RolesListCreateView, UserProfileView, UserRetrieveUpdateDestroyView,create_application,
    FormList, UserProfileView, UserRegistration, UserView, LogoutView,
    AdminRegistration, AdminLoginView, SponsorListCreateView, SponsorRetrieveUpdateDestroyView,
    ProgramListCreateView, ProgramRetrieveUpdateDestroyView, ApplicationListCreateView, ApplicationDetailView
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/register/', UserRegistration.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login_view'),
    path('api/userview/', UserView.as_view(), name='user_view'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('verify-email/<str:token>/', verify_email, name='verify_email'),
    path('verify-adminemail/<str:token>/', admin_verify_email, name='verify_email'),
    path('api/registeradmin/', AdminRegistration.as_view(), name='register'),
    path('api/loginadmin/', AdminLoginView.as_view(), name='register'),
    path('api/fetchroles/<int:pk>/', RolesRetrieveUpdateDestroyView.as_view(), name='roles-detail'),
    path('api/fetchroles/', RolesListCreateView.as_view(), name='roles-list'),
    path('api/fetchapplicants/', RolesListCreateView.as_view(), name='roles-list'),
    path('api/fetchapplicants/<int:pk>/', RolesListCreateView.as_view(), name='roles-list'),
    path('api/sponsor/', SponsorListCreateView.as_view(), name='sponsor-list'),
    path('api/sponsor/<int:pk>/', SponsorRetrieveUpdateDestroyView.as_view(), name='sponsor-retrieve-update-destroy'),
    path('api/program/', ProgramListCreateView.as_view(), name='program-list'),
    path('api/program/<int:pk>/', ProgramRetrieveUpdateDestroyView.as_view(), name='program-retrieve-update-destroy'),
    path('api/admin/verify-email/<str:token>/', admin_verify_email, name='verify_email'),
    path('forms/', FormList.as_view(), name='form-list'),
    path('forms/<int:pk>/', FormDetail.as_view(), name='form-detail'),
    path('forms/<int:pk>/', FormRetrieveUpdateDestroyView.as_view(), name='form-retrieve-update-destroy'),
    path('applications/', ApplicationListCreateView.as_view(), name='application-list-create'),
    path('applications/<int:pk>/', ApplicationDetailView.as_view(), name='application-detail'),
    path('userprofile/', UserProfileView.as_view(), name='userprofile'),
    path('userprofile/<int:pk>/', UserProfileView.as_view(), name='userprofile-list-create'),
    path('create_application/', create_application, name='create_application'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


