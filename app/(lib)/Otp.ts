import crypto from 'crypto';

export const generateOTP = async (): Promise<number> => {
    // Generate a cryptographically secure random number
    const randomBytes = crypto.randomBytes(4);
    const randomNumber = randomBytes.readUInt32BE(0);
    
    // Ensure it's a 6-digit number (100000 to 999999)
    const otp = 100000 + (randomNumber % 900000);
    
    return otp;
}

export const generateSecureToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
}
