# 🛡️ Appointment System Edge Cases & Validation

## ✅ **Currently Handled Edge Cases**

### 1. **Time Validation**
- ✅ **Outside working hours** (before 10 AM or after 6 PM)
  - Response: "Our clinic hours are from 10 AM to 6 PM"
  
- ✅ **Non-hourly times** (e.g., 10:30 AM, 2:15 PM)
  - Response: "Appointments must be scheduled on the hour"
  
- ✅ **Last slot validation** (5 PM is last slot, not 6 PM)
  - 6 PM is closing time, last appointment at 5 PM

### 2. **Slot Availability**
- ✅ **Double booking prevention**
  - Checks MongoDB for existing appointments
  - Response: "This time slot is already booked. Available slots: ..."
  
- ✅ **Fully booked day**
  - Response: "All slots are booked for this day. Please choose another date."

### 3. **Data Validation**
- ✅ **Phone number format**
  - Mongoose validator checks for valid mobile phone
  - Accepts various formats: 1234567890, +1-234-567-8900, etc.
  
- ✅ **Future date validation**
  - Mongoose validator ensures appointment is in the future
  - Rejects past dates

### 4. **Status Management**
- ✅ **Cancelled appointments excluded**
  - Slot availability ignores cancelled appointments
  - Cancelled slots become available again

---

## ⚠️ **Additional Edge Cases to Handle**

### 5. **Date/Time Parsing Edge Cases**

#### ❌ **Not Yet Handled:**
- **Ambiguous dates**
  - "Next Monday" - Which Monday?
  - "15th" - Which month?
  - Solution: Ask for clarification or default to next occurrence

- **Invalid dates**
  - "February 30th" - Doesn't exist
  - "13/25/2026" - Invalid format
  - Solution: Validate and ask user to correct

- **Timezone issues**
  - User in different timezone
  - Solution: Assume local clinic timezone, clarify if needed

- **Past dates**
  - "Yesterday at 2 PM"
  - "Last week"
  - Solution: Already handled by Mongoose validator

#### ✅ **Recommended Implementation:**
```typescript
// In slot.service.ts
export function validateDate(dateStr: string): {
  isValid: boolean;
  date?: Date;
  error?: string;
} {
  // Check for invalid dates
  // Check for past dates
  // Check for ambiguous dates
  // Return parsed date or error
}
```

---

### 6. **Concurrent Booking Edge Cases**

#### ❌ **Race Condition:**
**Scenario:**
- User A checks slot at 2 PM → Available ✅
- User B checks slot at 2 PM → Available ✅
- User A books 2 PM → Success
- User B books 2 PM → Should fail but might succeed

**Solution:**
```typescript
// Use MongoDB transaction or atomic operation
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Check availability
  const isAvailable = await isSlotAvailable(dateTime);
  if (!isAvailable) throw new Error('Slot taken');
  
  // Create appointment
  await Appointment.create([appointmentData], { session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

### 7. **Input Validation Edge Cases**

#### ❌ **Malicious/Invalid Input:**
- **SQL Injection attempts** (MongoDB is safer but still validate)
- **XSS in names** (e.g., `<script>alert('xss')</script>`)
- **Extremely long names** (> 100 characters)
- **Special characters** in names
- **Empty strings** after trim

#### ✅ **Current Protection:**
- Mongoose schema validation (minlength, maxlength)
- Trim on strings
- Phone validator

#### ⚠️ **Additional Needed:**
```typescript
// Sanitize input
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
    .substring(0, 100); // Max length
}
```

---

### 8. **Phone Number Edge Cases**

#### ❌ **Not Yet Handled:**
- **International formats**
  - +44 20 7946 0958 (UK)
  - +91 98765 43210 (India)
  - Solution: validator library handles this ✅

- **Extensions**
  - "555-1234 ext 123"
  - Solution: Strip extensions before validation

- **Invalid but formatted**
  - "000-000-0000"
  - "123-456-7890" (not a real number)
  - Solution: Additional validation needed

#### ✅ **Recommended:**
```typescript
function validatePhone(phone: string): boolean {
  // Remove non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Check length (10-15 digits)
  if (digits.length < 10 || digits.length > 15) return false;
  
  // Check not all same digit
  if (/^(\d)\1+$/.test(digits)) return false; // e.g., 0000000000
  
  return validator.isMobilePhone(phone, 'any');
}
```

---

### 9. **Appointment Modification Edge Cases**

#### ❌ **Not Yet Handled:**
- **Cancellation**
  - User wants to cancel appointment
  - Solution: Add cancellation flow in AI

- **Rescheduling**
  - User wants to change time
  - Solution: Cancel old + book new

- **No-show tracking**
  - User doesn't show up
  - Solution: Add status field updates

---

### 10. **Business Logic Edge Cases**

#### ❌ **Not Yet Handled:**
- **Same-day appointments**
  - User books for "today at 2 PM" but it's already 3 PM
  - Solution: Check if requested time is in the future

- **Too far in advance**
  - User books 6 months ahead
  - Solution: Set maximum booking window (e.g., 3 months)

- **Minimum notice**
  - User books 5 minutes from now
  - Solution: Require minimum 1-hour notice

- **Weekend/Holiday handling**
  - Clinic closed on Sundays
  - Solution: Add day-of-week validation

#### ✅ **Recommended:**
```typescript
export function validateBookingWindow(requestedDate: Date): {
  isValid: boolean;
  message: string;
} {
  const now = new Date();
  const minNotice = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
  const maxAdvance = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
  
  if (requestedDate < minNotice) {
    return {
      isValid: false,
      message: 'Appointments require at least 1 hour notice'
    };
  }
  
  if (requestedDate > maxAdvance) {
    return {
      isValid: false,
      message: 'Appointments can only be booked up to 3 months in advance'
    };
  }
  
  // Check if weekend
  const day = requestedDate.getDay();
  if (day === 0) { // Sunday
    return {
      isValid: false,
      message: 'Clinic is closed on Sundays'
    };
  }
  
  return { isValid: true, message: 'Valid' };
}
```

---

### 11. **Data Extraction Edge Cases**

#### ❌ **AI Extraction Failures:**
- **User provides partial info**
  - "John, 555-1234, tomorrow" (missing pet name)
  - Solution: AI asks for missing details ✅ (already implemented)

- **User provides info in unexpected format**
  - "Call me at five five five one two three four"
  - "My dog's name is Buddy and I'm John"
  - Solution: Improve extraction regex

- **Multiple pets mentioned**
  - "I have Max and Bella, book for Max"
  - Solution: AI clarifies which pet

---

### 12. **Conversation Flow Edge Cases**

#### ❌ **Not Yet Handled:**
- **User changes mind mid-booking**
  - User: "Actually, cancel that"
  - Solution: AI acknowledges and stops booking

- **User provides conflicting info**
  - First says "tomorrow 2 PM"
  - Then says "actually 3 PM"
  - Solution: AI uses most recent info

- **User books multiple appointments**
  - Wants to book for 2 different pets
  - Solution: Complete first booking, then start second

---

### 13. **Error Handling Edge Cases**

#### ❌ **System Failures:**
- **MongoDB connection lost**
  - Solution: Graceful error message, retry logic

- **Gemini API failure**
  - Solution: Fallback response, log error

- **Slot check fails**
  - Solution: Assume unavailable, ask user to try again

---

## 🔧 **Priority Fixes Needed**

### **High Priority:**
1. ✅ **Race condition protection** (concurrent bookings)
2. ✅ **Same-day past time validation**
3. ✅ **Minimum notice requirement** (1 hour)
4. ✅ **Maximum advance booking** (3 months)

### **Medium Priority:**
5. ⚠️ **Weekend/Holiday validation**
6. ⚠️ **Phone number sanitization**
7. ⚠️ **Input sanitization** (XSS protection)
8. ⚠️ **Better date parsing** (handle more formats)

### **Low Priority:**
9. ⚪ **Cancellation flow**
10. ⚪ **Rescheduling flow**
11. ⚪ **No-show tracking**
12. ⚪ **Multiple pet booking**

---

## 📝 **Recommended Immediate Additions**

### 1. **Enhanced Slot Validation**
```typescript
// Add to slot.service.ts
export async function validateAppointmentTime(requestedDateTime: Date) {
  const now = new Date();
  
  // Check if in the past
  if (requestedDateTime < now) {
    return {
      isValid: false,
      message: 'Cannot book appointments in the past'
    };
  }
  
  // Check minimum notice (1 hour)
  const minNotice = new Date(now.getTime() + 60 * 60 * 1000);
  if (requestedDateTime < minNotice) {
    return {
      isValid: false,
      message: 'Appointments require at least 1 hour advance notice'
    };
  }
  
  // Check maximum advance (90 days)
  const maxAdvance = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  if (requestedDateTime > maxAdvance) {
    return {
      isValid: false,
      message: 'Appointments can only be booked up to 3 months in advance'
    };
  }
  
  // Check if Sunday
  if (requestedDateTime.getDay() === 0) {
    return {
      isValid: false,
      message: 'Clinic is closed on Sundays. Please choose another day.'
    };
  }
  
  // Existing validations...
  // (working hours, hourly slots, availability)
}
```

### 2. **Transaction Support**
```typescript
// Update appointment.service.ts
export async function createAppointment(data) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Double-check availability within transaction
    const isAvailable = await isSlotAvailable(data.preferredDateTime);
    if (!isAvailable) {
      throw new Error('Slot no longer available');
    }
    
    // Create appointment
    const [appointment] = await Appointment.create([data], { session });
    
    await session.commitTransaction();
    return appointment;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
```

---

## ✅ **Current System Status**

### **Working Well:**
- ✅ Working hours validation (10 AM - 6 PM)
- ✅ Hourly slot enforcement
- ✅ Double-booking prevention
- ✅ Phone number validation
- ✅ Future date validation
- ✅ Cancelled appointment handling
- ✅ AI asks for all details at once
- ✅ Dr. Peteshwar Dogari mentioned

### **Needs Improvement:**
- ⚠️ Race condition protection
- ⚠️ Same-day past time check
- ⚠️ Minimum notice requirement
- ⚠️ Maximum advance booking limit
- ⚠️ Weekend/Holiday handling
- ⚠️ Input sanitization

---

**Most Critical Edge Case:** Race conditions during concurrent bookings
**Recommended Next Step:** Add MongoDB transactions to appointment creation

Would you like me to implement the high-priority fixes now?
