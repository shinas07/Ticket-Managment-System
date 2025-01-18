from rest_framework import serializers
from accounts.models import User
from .models import Ticket

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_staff')

class TicketSerializer(serializers.ModelSerializer):
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)
    assigned_to_email = serializers.EmailField(source='assigned_to.email', read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description', 'priority', 'status',
            'created_by', 'assigned_to', 'created_at', 'updated_at',
            'created_by_email', 'assigned_to_email'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)