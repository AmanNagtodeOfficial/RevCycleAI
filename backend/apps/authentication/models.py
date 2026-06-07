from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
import uuid


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_(\"The Email must be set\"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_(\"Superuser must have is_staff=True.\"))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_(\"Superuser must have is_superuser=True.\"))
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrator'),
        ('billing_manager', 'Billing Manager'),
        ('coder', 'Medical Coder'),
        ('compliance', 'Compliance Officer'),
        ('clinical', 'Clinical Staff'),
        ('viewer', 'Viewer'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=False, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')
    organization = models.ForeignKey('organizations.Organization', on_delete=models.CASCADE, related_name='users')
    is_active = models.BooleanField(default=True)
    mfa_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    def __str__(self):
        return f\"{self.first_name} {self.last_name} ({self.email})\"

    class Meta:
        db_table = 'auth_user'
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'


class AuditLog(models.Model):
    ACTION_CHOICES = (
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('export', 'Export'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='audit_logs')
    organization = models.ForeignKey('organizations.Organization', on_delete=models.CASCADE)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    resource_type = models.CharField(max_length=50)
    resource_id = models.CharField(max_length=100)
    changes = models.JSONField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['resource_type', 'resource_id']),
            models.Index(fields=['organization', '-timestamp']),
        ]
        verbose_name = 'Audit Log'
        verbose_name_plural = 'Audit Logs'

    def __str__(self):
        return f\"{self.user} - {self.action} - {self.resource_type}\"
