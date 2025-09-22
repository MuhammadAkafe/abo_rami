# Forgot Password Flow Implementation

This document describes the complete forgot password flow implementation with OTP verification.

## Overview

The forgot password flow consists of three main steps:
1. **Request OTP** - User provides email and receives OTP
2. **Verify OTP** - User enters OTP to get reset token
3. **Reset Password** - User provides new password with reset token

## API Endpoints

### 1. Request OTP (`POST /api/email`)

**Purpose**: Send OTP to user's email for password reset

**Request Body**:
```json
{
  "email": "user@example.com",
  "isAdmin": false
}
```

**Response**:
```json
{
  "message": "OTP sent successfully to your email",
  "email": "user@example.com",
  "userType": "supplier",
  "expiresIn": "5 minutes"
}
```

**Features**:
- Validates email format
- Checks if user exists (supplier or admin)
- Generates cryptographically secure 6-digit OTP
- Stores OTP in Redis with 5-minute expiration
- Sends HTML email with OTP
- Handles both suppliers and admins

### 2. Verify OTP (`POST /api/verify-otp`)

**Purpose**: Verify OTP and generate reset token

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "isAdmin": false
}
```

**Response**:
```json
{
  "message": "OTP verified successfully",
  "resetToken": "abc123...",
  "email": "user@example.com",
  "userType": "supplier",
  "userId": 123,
  "expiresIn": "10 minutes"
}
```

**Features**:
- Validates 6-digit OTP format
- Verifies OTP against stored value
- Generates secure reset token
- Stores reset token with 10-minute expiration
- Cleans up OTP after successful verification

### 3. Reset Password (`POST /api/reset-password`)

**Purpose**: Update user password with reset token

**Request Body**:
```json
{
  "email": "user@example.com",
  "newPassword": "newpassword123",
  "resetToken": "abc123...",
  "isAdmin": false
}
```

**Response**:
```json
{
  "message": "Password updated successfully",
  "email": "user@example.com",
  "userType": "supplier"
}
```

**Features**:
- Validates password strength (minimum 6 characters)
- Verifies reset token
- Hashes password with bcrypt (12 salt rounds)
- Updates password in database
- Cleans up reset token

## Security Features

### OTP Generation
- Uses `crypto.randomBytes()` for cryptographically secure random numbers
- Generates 6-digit OTPs (100000-999999)
- No predictable patterns

### Token Management
- Reset tokens are 64-character hex strings
- Generated using `crypto.randomBytes(32)`
- Stored in Redis with expiration

### Password Security
- bcrypt hashing with 12 salt rounds
- Minimum 6 character password requirement
- Secure password storage

### Rate Limiting & Expiration
- OTP expires in 5 minutes
- Reset token expires in 10 minutes
- Automatic cleanup of expired tokens

## Redis Key Structure

```
otp:{email}:{userType}          # OTP storage (5 min TTL)
user_info:{email}:{userType}    # User info storage (5 min TTL)
reset_token:{email}:{userType}  # Reset token storage (10 min TTL)
```

## Error Handling

### Common Error Responses

**400 Bad Request**:
- Missing required fields
- Invalid email format
- Invalid OTP format
- Weak password
- Invalid reset token

**404 Not Found**:
- User not found
- OTP not found/expired
- Reset token not found/expired

**500 Internal Server Error**:
- Database connection issues
- Redis connection issues
- Email sending failures

## Usage Examples

### Frontend Integration

```javascript
// Step 1: Request OTP
const requestOTP = async (email, isAdmin = false) => {
  const response = await fetch('/api/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, isAdmin })
  });
  return response.json();
};

// Step 2: Verify OTP
const verifyOTP = async (email, otp, isAdmin = false) => {
  const response = await fetch('/api/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, isAdmin })
  });
  return response.json();
};

// Step 3: Reset Password
const resetPassword = async (email, newPassword, resetToken, isAdmin = false) => {
  const response = await fetch('/api/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword, resetToken, isAdmin })
  });
  return response.json();
};
```

## Environment Variables Required

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
DATABASE_URL=your-database-url
REDIS_URL=redis://localhost:6379
```

## Dependencies

- `bcryptjs` - Password hashing
- `nodemailer` - Email sending
- `redis` - Token storage
- `crypto` - Secure random generation

## Database Schema

The implementation works with the existing Prisma schema:
- `users` table for admins (role: 'ADMIN')
- `suppliers` table for suppliers (role: 'USER')

## Security Considerations

1. **OTP Expiration**: 5-minute limit prevents brute force attacks
2. **Token Expiration**: 10-minute limit for password reset
3. **Secure Random**: Uses crypto.randomBytes for all random generation
4. **Password Hashing**: bcrypt with high salt rounds
5. **Input Validation**: Comprehensive validation on all inputs
6. **Error Messages**: Generic error messages to prevent information leakage
7. **Automatic Cleanup**: Expired tokens are automatically removed

## Testing

Test the flow with:
1. Valid email → should receive OTP
2. Invalid email → should get 404
3. Wrong OTP → should get 400
4. Expired OTP → should get 404
5. Valid OTP → should get reset token
6. Wrong reset token → should get 400
7. Valid reset token → should update password
