# Appointments Feature

## Overview
The appointments feature displays all booked veterinary appointments on the main application page. This implementation follows React best practices with proper state management, error handling, and loading states.

## Architecture

### Backend
- **Endpoint**: `GET /api/chat/appointments`
- **Service**: `appointment.service.ts` - Handles appointment CRUD operations
- **Model**: `Appointment.model.ts` - MongoDB schema for appointments
- **Fields**:
  - `id`: Unique appointment identifier
  - `conversationId`: Reference to the chat conversation
  - `petOwnerName`: Name of the pet owner
  - `petName`: Name of the pet
  - `phone`: Contact phone number
  - `preferredDateTime`: Scheduled appointment date/time
  - `status`: Appointment status (pending, confirmed, cancelled)
  - `createdAt`: Timestamp when appointment was created

### Frontend

#### 1. Types (`src/types/index.ts`)
- `Appointment`: Interface for appointment data
- `AppointmentsResponse`: API response structure

#### 2. API Layer (`src/lib/api.ts`)
- `getAppointments()`: Fetches all appointments from the backend

#### 3. Custom Hook (`src/hooks/useAppointments.ts`)
Follows React best practices:
- **State Management**: Manages appointments, loading, and error states
- **useCallback**: Memoizes fetch and refresh functions to prevent unnecessary re-renders
- **useEffect**: Automatically fetches appointments on component mount
- **Error Handling**: Catches and displays errors gracefully

#### 4. Component (`src/components/AppointmentsList.tsx`)
Features:
- **Loading State**: Shows spinner while fetching data
- **Error State**: Displays error message with retry button
- **Empty State**: Shows helpful message when no appointments exist
- **Appointment Cards**: Displays each appointment with:
  - Pet and owner information
  - Status badge (color-coded)
  - Formatted date and time
  - Contact phone number
- **Refresh Button**: Manually refresh appointments
- **Responsive Grid**: Adapts to different screen sizes

## Usage

The appointments are automatically displayed on the main application page (`App.tsx`). The component:
1. Fetches appointments when the page loads
2. Updates the UI based on loading/error/data states
3. Allows manual refresh via the refresh button

## Features

✅ **Automatic Loading**: Appointments load when the page opens
✅ **Real-time Updates**: Refresh button to get latest appointments
✅ **Error Handling**: Graceful error messages with retry option
✅ **Loading States**: Visual feedback during data fetching
✅ **Empty States**: Helpful message when no appointments exist
✅ **Responsive Design**: Works on all screen sizes
✅ **Status Indicators**: Color-coded badges for appointment status
✅ **Formatted Dates**: Human-readable date and time display

## Best Practices Implemented

1. **Custom Hooks**: Separation of concerns with `useAppointments` hook
2. **Type Safety**: Full TypeScript typing throughout
3. **Error Boundaries**: Proper error handling at each level
4. **Memoization**: Using `useCallback` to optimize performance
5. **Accessibility**: Semantic HTML and ARIA labels
6. **Responsive Design**: Mobile-first approach with Tailwind CSS
7. **Loading States**: Clear feedback for all async operations
8. **Code Organization**: Modular components and utilities
