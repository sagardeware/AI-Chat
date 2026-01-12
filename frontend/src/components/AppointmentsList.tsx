import { useAppointments } from '../hooks/useAppointments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Clock, Phone, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import type { Appointment } from '../types';

/**
 * Format date to a readable string
 */
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format time to a readable string
 */
function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

/**
 * Get status badge variant
 */
function getStatusVariant(status: Appointment['status']): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'confirmed':
            return 'default';
        case 'pending':
            return 'secondary';
        case 'cancelled':
            return 'destructive';
        default:
            return 'outline';
    }
}

/**
 * Individual appointment card component
 */
function AppointmentCard({ appointment }: { appointment: Appointment }) {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-xl">{appointment.petName}</CardTitle>
                        <CardDescription>Owner: {appointment.petOwnerName}</CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(appointment.status)} className="capitalize">
                        {appointment.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">
                        {formatDate(appointment.preferredDateTime)}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">
                        {formatTime(appointment.preferredDateTime)}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{appointment.phone}</span>
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Main appointments list component
 */
export function AppointmentsList() {
    const { appointments, loading, error, refreshAppointments } = useAppointments();

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                    <span className="text-muted-foreground">Loading appointments...</span>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="text-center space-y-4">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Failed to load appointments</p>
                            <p className="text-sm text-muted-foreground">{error}</p>
                        </div>
                        <Button onClick={refreshAppointments} variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (appointments.length === 0) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="text-center space-y-4">
                        <Calendar className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">No Appointments Yet</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                Book your first appointment using our AI chat assistant!
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl">Appointments</CardTitle>
                        <CardDescription>
                            {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'} scheduled
                        </CardDescription>
                    </div>
                    <Button onClick={refreshAppointments} variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {appointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
