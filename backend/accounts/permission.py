from rest_framework import permissions

class IsAdminOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Admin can do anything
        if request.user.role == 'admin':
            return True
        # Users can only access their own tickets
        return obj.user == request.user