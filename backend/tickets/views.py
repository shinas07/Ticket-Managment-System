from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Ticket
from .serializers import TicketSerializer
# from .permissions import IsOwnerOrStaffOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from django.db.models.functions import TruncDate
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import PermissionDenied
class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'created_by', 'assigned_to']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'priority']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Ticket.objects.all()
        return Ticket.objects.filter(created_by=user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        # Check if ticket is resolved
        if serializer.instance.status == 'resolved':
            raise PermissionDenied("This ticket is already resolved and cannot be edited.")
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied("You do not have permission to delete this ticket.")
        return super().destroy(request, *args, **kwargs)
        
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get ticket statistics for the dashboard."""
        user = request.user
        queryset = self.get_queryset()

        # Get counts for different statuses
        stats = {
            'total_tickets': queryset.count(),
            'open_tickets': queryset.filter(status='open').count(),
            'in_progress_tickets': queryset.filter(status='in_progress').count(),
            'resolved_tickets': queryset.filter(status='resolved').count(),
        }

        return Response(stats)
    

    @action(detail=False, methods=['get'])
    def admin_stats(self, request):
        """Get comprehensive ticket statistics for the dashboard."""
        user = request.user
        if not user.is_staff:
            return Response({"error": "Not authorized"}, status=403)

        queryset = self.get_queryset()
        now = timezone.now()
        last_month = now - timedelta(days=30)

        # Current stats
        current_stats = {
            'total_tickets': queryset.count(),
            'open_tickets': queryset.filter(status='open').count(),
            'in_progress_tickets': queryset.filter(status='in_progress').count(),
            'resolved_tickets': queryset.filter(status='resolved').count(),
            
            # Priority breakdown
            'high_priority': queryset.filter(priority='high').count(),
            'medium_priority': queryset.filter(priority='medium').count(),
            'low_priority': queryset.filter(priority='low').count(),
            
            # Time-based metrics
            'created_last_30_days': queryset.filter(created_at__gte=last_month).count(),
            'resolved_last_30_days': queryset.filter(
                status='resolved',
                updated_at__gte=last_month
            ).count(),
            
            # Daily tickets trend
            'daily_tickets': queryset.filter(
                created_at__gte=last_month
            ).annotate(
                date=TruncDate('created_at')
            ).values('date').annotate(
                count=Count('id')
            ).order_by('date'),
            
            # Response metrics
            'unassigned_tickets': queryset.filter(assigned_to=None).count(),
            'aging_tickets': queryset.filter(
                status='open',
                created_at__lt=last_month
            ).count(),
        }

        return Response(current_stats)

