import { z } from 'zod';

// Schema for user login
export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  rememberMe: z.boolean().optional(),
  twoFactorCode: z.string().length(6, { message: '2FA code must be 6 digits.' }).optional(),
});
export type LoginInput = z.infer<typeof LoginSchema>;

// Enhanced password validation
const passwordSchema = z.string()
  .min(8, { message: 'Password must be at least 8 characters.' })
  .max(128, { message: 'Password cannot exceed 128 characters.' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])?/, { 
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number. Special characters are recommended.' 
  });

// Enhanced university ID validation
const universityIdSchema = z.string()
  .min(5, { message: 'University ID must be at least 5 characters.' })
  .max(20, { message: 'University ID cannot exceed 20 characters.' })
  .regex(/^[A-Za-z0-9-_]+$/, { message: 'University ID can only contain letters, numbers, hyphens, and underscores.' });

// Date of birth validation (must be at least 16 years old, not in the future)
const dateOfBirthSchema = z.date({ required_error: 'Date of birth is required.' })
  .refine(date => {
    const today = new Date();
    const sixteenYearsAgo = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    return date <= sixteenYearsAgo;
  }, { message: 'You must be at least 16 years old.' })
  .refine(date => date <= new Date(), { message: 'Date of birth cannot be in the future.' })
  .refine(date => {
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);
    return date >= hundredYearsAgo;
  }, { message: 'Please enter a valid date of birth.' });

// Phone number validation
const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number.' })
  .optional();

// File upload validation
const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(10 * 1024 * 1024, { message: 'File size cannot exceed 10MB.' }),
  type: z.string().regex(/^(image\/(jpeg|jpg|png|gif|webp)|application\/pdf|text\/(plain|csv)|application\/(msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document))$/, {
    message: 'Only images, PDFs, text files, and Word documents are allowed.'
  }),
});

// Schema for traditional email/password registration
export const RegisterSchema = z.object({
  fullName: z.string()
    .min(2, { message: 'Full name must be at least 2 characters.' })
    .max(100, { message: 'Full name cannot exceed 100 characters.' })
    .regex(/^[a-zA-Z\s'-]+$/, { message: 'Full name can only contain letters, spaces, hyphens, and apostrophes.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  universityId: universityIdSchema,
  role: z.enum(['student', 'counselor', 'admin'], { required_error: 'You must select a role.' }),
  dateOfBirth: dateOfBirthSchema,
  phoneNumber: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, { 
    message: 'You must agree to the terms and conditions.' 
  }),
  agreeToPrivacy: z.boolean().refine(val => val === true, { 
    message: 'You must agree to the privacy policy.' 
  }),
  marketingConsent: z.boolean().optional(),
  referralCode: z.string().max(20).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'], 
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

// Schema for OAuth (Google/Apple) registration completion
export const OAuthCompleteSchema = z.object({
  fullName: z.string()
    .min(2, { message: 'Full name must be at least 2 characters.' })
    .max(100, { message: 'Full name cannot exceed 100 characters.' })
    .regex(/^[a-zA-Z\s'-]+$/, { message: 'Full name can only contain letters, spaces, hyphens, and apostrophes.' }),
  universityId: universityIdSchema,
  role: z.enum(['student', 'counselor'], { required_error: 'You must select a role.' }),
  dateOfBirth: dateOfBirthSchema,
  phoneNumber: phoneSchema,
  agreeToTerms: z.boolean().refine(val => val === true, { 
    message: 'You must agree to the terms and conditions.' 
  }),
  agreeToPrivacy: z.boolean().refine(val => val === true, { 
    message: 'You must agree to the privacy policy.' 
  }),
  marketingConsent: z.boolean().optional(),
  referralCode: z.string().max(20).optional(),
});
export type OAuthCompleteInput = z.infer<typeof OAuthCompleteSchema>;

// Enhanced profile schema
export const ProfileSchema = z.object({
  fullName: z.string()
    .min(2, { message: 'Full name must be at least 2 characters.' })
    .max(100, { message: 'Full name cannot exceed 100 characters.' })
    .regex(/^[a-zA-Z\s'-]+$/, { message: 'Full name can only contain letters, spaces, hyphens, and apostrophes.' })
    .optional(),
  email: z.string().email({ message: 'Invalid email address.' }).optional(), 
  universityId: universityIdSchema.optional(),
  phoneNumber: phoneSchema,
  bio: z.string()
    .max(500, { message: 'Bio cannot exceed 500 characters.' })
    .optional(),
  dateOfBirth: dateOfBirthSchema.optional(),
  profilePicture: fileSchema.optional(),
  emergencyContact: z.object({
    name: z.string().min(2, { message: 'Emergency contact name is required.' }),
    relationship: z.string().min(2, { message: 'Relationship is required.' }),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number.' }),
    email: z.string().email().optional(),
  }).optional(),
  academicInfo: z.object({
    year: z.enum(['freshman', 'sophomore', 'junior', 'senior', 'graduate', 'postgraduate', 'alumni']),
    department: z.string().max(100, { message: 'Department cannot exceed 100 characters.' }),
    major: z.string().max(100, { message: 'Major cannot exceed 100 characters.' }).optional(),
    minor: z.string().max(100, { message: 'Minor cannot exceed 100 characters.' }).optional(),
    gpa: z.number().min(0).max(4).optional(),
    expectedGraduation: z.date().optional(),
  }).optional(),
  address: z.object({
    street: z.string().max(200),
    city: z.string().max(100),
    state: z.string().max(100),
    zipCode: z.string().max(20),
    country: z.string().max(100),
  }).optional(),
  timezone: z.string().default('UTC'),
  preferredLanguage: z.enum(['english', 'spanish', 'french', 'german', 'chinese', 'arabic', 'hindi', 'other']).default('english'),
  communicationPreferences: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    push: z.boolean().default(true),
    reminders: z.boolean().default(true),
    newsletters: z.boolean().default(false),
  }).optional(),
  accessibility: z.object({
    requiresInterpreter: z.boolean().default(false),
    interpreterLanguage: z.string().optional(),
    mobilityAssistance: z.boolean().default(false),
    visualAssistance: z.boolean().default(false),
    hearingAssistance: z.boolean().default(false),
    otherAccommodations: z.string().max(500).optional(),
  }).optional(),
  socialMedia: z.object({
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    instagram: z.string().url().optional(),
  }).optional(),
});
export type ProfileInput = z.infer<typeof ProfileSchema>;

// Enhanced appointment request schema
export const RequestAppointmentSchema = z.object({
  counselorId: z.string().min(1, { message: "Please select a counselor." }),
  preferredDate: z.date({ required_error: "Please select a preferred date." })
    .refine(date => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, { message: "Appointment date cannot be in the past." })
    .refine(date => {
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 6); // 6 months in advance
      return date <= maxDate;
    }, { message: "Appointments can only be scheduled up to 6 months in advance." }),
  preferredTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time in HH:MM format." }),
  duration: z.enum(['30', '45', '60', '90'], { message: "Please select appointment duration." }).default('60'),
  alternativeDate: z.date().optional(),
  alternativeTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time in HH:MM format." })
    .optional(),
  contactMethod: z.enum(['video', 'chat', 'in-person', 'phone'], { 
    required_error: "Please select a contact method." 
  }),
  appointmentType: z.enum([
    'initial-consultation', 
    'follow-up', 
    'academic-support', 
    'crisis-support', 
    'career-counseling', 
    'mental-health', 
    'relationship-counseling',
    'group-therapy',
    'family-counseling',
    'substance-abuse',
    'eating-disorder',
    'trauma-therapy',
    'grief-counseling'
  ], { required_error: "Please select an appointment type." }),
  priority: z.enum(['low', 'normal', 'high', 'urgent', 'emergency'], { 
    required_error: "Please select a priority level." 
  }),
  reason: z.string()
    .min(10, { message: "Please provide a brief reason for your visit (min. 10 characters)." })
    .max(2000, { message: "The reason should not exceed 2000 characters." }),
  previousSessions: z.boolean().default(false),
  referralSource: z.enum([
    'self-referral', 
    'faculty', 
    'friend', 
    'family', 
    'academic-advisor', 
    'healthcare-provider', 
    'online-search',
    'campus-event',
    'social-media',
    'other'
  ]).optional(),
  specificConcerns: z.array(z.enum([
    'anxiety', 
    'depression', 
    'stress', 
    'academic-pressure', 
    'relationship-issues', 
    'family-problems', 
    'financial-stress', 
    'career-uncertainty', 
    'substance-use', 
    'eating-concerns', 
    'sleep-issues', 
    'grief-loss', 
    'trauma', 
    'social-anxiety',
    'panic-attacks',
    'self-esteem',
    'loneliness',
    'homesickness',
    'cultural-adjustment',
    'other'
  ])).optional(),
  timezone: z.string().default('UTC'),
  additionalNotes: z.string().max(1000, { message: "Additional notes cannot exceed 1000 characters." }).optional(),
  consentToRecord: z.boolean().optional(),
  insuranceInfo: z.object({
    provider: z.string(),
    policyNumber: z.string(),
    groupNumber: z.string().optional(),
  }).optional(),
  attachments: z.array(fileSchema).max(5, { message: "Maximum 5 files allowed." }).optional(),
  recurringAppointment: z.object({
    frequency: z.enum(['weekly', 'biweekly', 'monthly']),
    duration: z.number().min(1).max(12), // months
    endDate: z.date().optional(),
  }).optional(),
});
export type RequestAppointmentInput = z.infer<typeof RequestAppointmentSchema>;

// Appointment management schemas
export const AppointmentUpdateSchema = z.object({
  appointmentId: z.string(),
  status: z.enum(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show', 'rescheduled']),
  notes: z.string().max(2000).optional(),
  rating: z.number().min(1).max(5).optional(),
  feedback: z.string().max(1000).optional(),
});
export type AppointmentUpdateInput = z.infer<typeof AppointmentUpdateSchema>;

export const RescheduleAppointmentSchema = z.object({
  appointmentId: z.string(),
  newDate: z.date(),
  newTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  reason: z.string().min(10, { message: "Please provide a reason for rescheduling." }),
});
export type RescheduleAppointmentInput = z.infer<typeof RescheduleAppointmentSchema>;

// Counselor-specific schemas
export const CounselorProfileSchema = z.object({
  bio: z.string().min(100, { message: "Bio must be at least 100 characters." }).max(2000),
  specializations: z.array(z.string()).min(1, { message: "At least one specialization is required." }),
  credentials: z.array(z.object({
    title: z.string(),
    institution: z.string(),
    year: z.number(),
    verified: z.boolean().default(false),
  })),
  experience: z.number().min(0, { message: "Experience cannot be negative." }),
  languages: z.array(z.string()).min(1),
  approaches: z.array(z.enum([
    'cognitive-behavioral',
    'psychodynamic',
    'humanistic',
    'solution-focused',
    'mindfulness-based',
    'dialectical-behavioral',
    'acceptance-commitment',
    'narrative-therapy',
    'family-systems',
    'other'
  ])),
  availability: z.array(z.object({
    dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    isAvailable: z.boolean().default(true),
  })),
  rates: z.object({
    individual: z.number().min(0),
    group: z.number().min(0),
    emergency: z.number().min(0),
  }).optional(),
  acceptsInsurance: z.boolean().default(false),
  maxClientsPerDay: z.number().min(1).max(20).default(8),
});
export type CounselorProfileInput = z.infer<typeof CounselorProfileSchema>;

// Session notes and documentation
export const SessionNotesSchema = z.object({
  appointmentId: z.string(),
  sessionType: z.enum(['individual', 'group', 'family', 'emergency']),
  duration: z.number().min(15).max(180), // minutes
  attendees: z.array(z.string()).min(1),
  presenting_concerns: z.string().min(10).max(2000),
  session_summary: z.string().min(50).max(5000),
  treatment_plan: z.string().max(2000).optional(),
  homework_assignments: z.string().max(1000).optional(),
  risk_assessment: z.enum(['low', 'moderate', 'high', 'imminent']),
  next_session_goals: z.string().max(1000).optional(),
  referrals_made: z.string().max(500).optional(),
  medications_discussed: z.boolean().default(false),
  confidentiality_concerns: z.boolean().default(false),
  attachments: z.array(fileSchema).max(10).optional(),
});
export type SessionNotesInput = z.infer<typeof SessionNotesSchema>;

// Mental health screening forms
export const MentalHealthScreeningSchema = z.object({
  phq9_score: z.number().min(0).max(27).optional(), // Depression screening
  gad7_score: z.number().min(0).max(21).optional(), // Anxiety screening
  dass21_depression: z.number().min(0).max(21).optional(),
  dass21_anxiety: z.number().min(0).max(21).optional(),
  dass21_stress: z.number().min(0).max(21).optional(),
  sleep_quality: z.enum(['very-poor', 'poor', 'fair', 'good', 'very-good']),
  appetite_changes: z.enum(['significant-decrease', 'slight-decrease', 'no-change', 'slight-increase', 'significant-increase']),
  substance_use: z.object({
    alcohol: z.enum(['never', 'rarely', 'occasionally', 'frequently', 'daily']),
    drugs: z.enum(['never', 'rarely', 'occasionally', 'frequently', 'daily']),
    prescription_misuse: z.boolean().default(false),
  }),
  suicidal_ideation: z.boolean(),
  self_harm: z.boolean(),
  trauma_history: z.boolean(),
  support_system: z.enum(['none', 'limited', 'moderate', 'strong']),
  current_stressors: z.array(z.string()).optional(),
  coping_strategies: z.array(z.string()).optional(),
  previous_therapy: z.boolean(),
  current_medications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    prescriber: z.string(),
  })).optional(),
});
export type MentalHealthScreeningInput = z.infer<typeof MentalHealthScreeningSchema>;

// Crisis intervention schema
export const CrisisReportSchema = z.object({
  reportType: z.enum(['self-report', 'third-party', 'counselor-identified']),
  urgencyLevel: z.enum(['moderate', 'high', 'imminent']),
  crisisType: z.enum(['suicidal', 'homicidal', 'psychotic', 'substance', 'domestic-violence', 'sexual-assault', 'other']),
  location: z.string(),
  involvedPersons: z.array(z.string()),
  description: z.string().min(50).max(5000),
  immediateActions: z.string().min(20).max(2000),
  resourcesProvided: z.array(z.string()),
  followUpRequired: z.boolean(),
  followUpDate: z.date().optional(),
  emergencyContactsNotified: z.boolean(),
  lawEnforcementInvolved: z.boolean(),
  hospitalizationRequired: z.boolean(),
  additionalSupport: z.string().max(1000).optional(),
});
export type CrisisReportInput = z.infer<typeof CrisisReportSchema>;

// Group therapy schemas
export const GroupTherapySchema = z.object({
  groupName: z.string().min(5).max(100),
  groupType: z.enum(['support', 'therapy', 'psychoeducational', 'skills-based']),
  facilitatorId: z.string(),
  maxParticipants: z.number().min(3).max(15),
  currentParticipants: z.array(z.string()),
  meetingSchedule: z.object({
    dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    duration: z.number().min(60).max(180), // minutes
    frequency: z.enum(['weekly', 'biweekly', 'monthly']),
  }),
  focus: z.array(z.enum([
    'anxiety', 'depression', 'grief', 'trauma', 'addiction', 'eating-disorders',
    'relationships', 'anger-management', 'social-skills', 'stress-management',
    'academic-success', 'career-development', 'lgbtq-support', 'international-students'
  ])),
  description: z.string().min(100).max(1000),
  requirements: z.string().max(500).optional(),
  isOpen: z.boolean().default(true),
  startDate: z.date(),
  endDate: z.date().optional(),
});
export type GroupTherapyInput = z.infer<typeof GroupTherapySchema>;

// Notification and messaging schemas
export const MessageSchema = z.object({
  recipientId: z.string(),
  subject: z.string().min(5).max(200),
  content: z.string().min(10).max(5000),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  messageType: z.enum(['general', 'appointment', 'emergency', 'system']),
  attachments: z.array(fileSchema).max(5).optional(),
  scheduledSend: z.date().optional(),
  requiresReadReceipt: z.boolean().default(false),
});
export type MessageInput = z.infer<typeof MessageSchema>;

// Assessment and survey schemas
export const SurveyResponseSchema = z.object({
  surveyId: z.string(),
  responses: z.array(z.object({
    questionId: z.string(),
    answer: z.union([z.string(), z.number(), z.array(z.string()), z.boolean()]),
    skipped: z.boolean().default(false),
  })),
  completionTime: z.number().min(1), // seconds
  partialCompletion: z.boolean().default(false),
});
export type SurveyResponseInput = z.infer<typeof SurveyResponseSchema>;

// Password reset and security
export const PasswordResetSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  securityQuestion: z.string().optional(),
  securityAnswer: z.string().optional(),
});
export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;

export const NewPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
  token: z.string().min(1, { message: 'Reset token is required.' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'], 
});
export type NewPasswordInput = z.infer<typeof NewPasswordSchema>;

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required.' }),
  newPassword: passwordSchema,
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match.",
  path: ['confirmNewPassword'], 
});
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

// Two-factor authentication
export const TwoFactorSetupSchema = z.object({
  method: z.enum(['sms', 'email', 'authenticator']),
  phoneNumber: phoneSchema,
  backupCodes: z.array(z.string()).length(10).optional(),
});
export type TwoFactorSetupInput = z.infer<typeof TwoFactorSetupSchema>;

// Admin and reporting schemas
export const ReportSchema = z.object({
  reportType: z.enum(['usage', 'outcomes', 'demographics', 'satisfaction', 'crisis', 'no-show']),
  dateRange: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }),
  filters: z.object({
    counselorIds: z.array(z.string()).optional(),
    appointmentTypes: z.array(z.string()).optional(),
    departments: z.array(z.string()).optional(),
    demographics: z.object({
      age: z.object({ min: z.number(), max: z.number() }).optional(),
      gender: z.array(z.string()).optional(),
      academicYear: z.array(z.string()).optional(),
    }).optional(),
  }).optional(),
  format: z.enum(['pdf', 'excel', 'csv']).default('pdf'),
  includePersonalInfo: z.boolean().default(false),
});
export type ReportInput = z.infer<typeof ReportSchema>;

// Feedback and evaluation schemas
export const FeedbackSchema = z.object({
  category: z.enum(['appointment', 'counselor', 'platform', 'technical', 'suggestion']),
  rating: z.number().min(1).max(5),
  subject: z.string().min(5).max(200),
  description: z.string().min(20).max(2000),
  anonymous: z.boolean().default(false),
  allowFollowUp: z.boolean().default(true),
  attachments: z.array(fileSchema).max(3).optional(),
});
export type FeedbackInput = z.infer<typeof FeedbackSchema>;


