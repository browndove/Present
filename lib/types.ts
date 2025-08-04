// Base User type with comprehensive fields
export type User = {
  // Core identification
  uid: string;
  email: string;
  fullName: string;
  universityId: string;
  role: 'student' | 'counselor' | 'admin';
  
  // Timestamps
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  lastLoginAt?: string; // ISO string
  emailVerifiedAt?: string; // ISO string
  
  // Basic profile info
  dateOfBirth: string; // ISO string
  avatarUrl?: string;
  phoneNumber?: string;
  bio?: string;
  
  // Account status and settings
  isActive: boolean;
  isEmailVerified: boolean;
  accountStatus: 'active' | 'suspended' | 'pending' | 'archived';
  timezone: string;
  preferredLanguage: 'english' | 'spanish' | 'french' | 'german' | 'chinese' | 'arabic' | 'hindi' | 'other';
  
  // Authentication & Security
  authProvider: 'email' | 'google' | 'apple';
  twoFactorEnabled: boolean;
  securityQuestions?: SecurityQuestion[];
  lastPasswordChange?: string; // ISO string
  
  // Emergency contact
  emergencyContact?: EmergencyContact;
  
  // Academic information (primarily for students)
  academicInfo?: AcademicInfo;
  
  // Address information
  address?: Address;
  
  // Communication preferences
  communicationPreferences: CommunicationPreferences;
  
  // Accessibility needs
  accessibility?: AccessibilityNeeds;
  
  // Social media (optional)
  socialMedia?: SocialMedia;
  
  // Privacy and consent
  consentRecords: ConsentRecord[];
  privacySettings: PrivacySettings;
  
  // AI and personalization
  aiHint?: string;
  personalizedSettings?: PersonalizedSettings;
  
  // Platform usage
  onboardingCompleted: boolean;
  profileCompleteness: number; // 0-100 percentage
  
  // Metadata
  referralCode?: string;
  referredBy?: string;
  tags?: string[]; // For admin categorization
  notes?: AdminNote[]; // Admin-only notes
};

// Supporting types
export type SecurityQuestion = {
  id: string;
  question: string;
  answerHash: string; // Hashed answer for security
  createdAt: string;
};

export type EmergencyContact = {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AcademicInfo = {
  year: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate' | 'postgraduate' | 'alumni';
  department: string;
  major?: string;
  minor?: string;
  gpa?: number;
  expectedGraduation?: string; // ISO string
  academicAdvisor?: string;
  enrollmentStatus: 'full-time' | 'part-time' | 'inactive';
  studentType: 'domestic' | 'international';
  scholarships?: string[];
};

export type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: 'permanent' | 'current' | 'mailing';
  isVerified: boolean;
  updatedAt: string;
};

export type CommunicationPreferences = {
  email: boolean;
  sms: boolean;
  push: boolean;
  reminders: boolean;
  newsletters: boolean;
  emergencyOnly: boolean;
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'any';
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
};

export type AccessibilityNeeds = {
  requiresInterpreter: boolean;
  interpreterLanguage?: string;
  mobilityAssistance: boolean;
  visualAssistance: boolean;
  hearingAssistance: boolean;
  cognitiveAssistance: boolean;
  otherAccommodations?: string;
  assistiveTechnology?: string[];
  preferredFormats?: ('large-print' | 'audio' | 'braille' | 'digital')[];
};

export type SocialMedia = {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  personalWebsite?: string;
};

export type ConsentRecord = {
  id: string;
  type: 'terms' | 'privacy' | 'marketing' | 'research' | 'recording' | 'data-sharing';
  granted: boolean;
  grantedAt: string; // ISO string
  version: string; // Version of terms/policy
  ipAddress?: string;
  userAgent?: string;
  withdrawnAt?: string; // ISO string
};

export type PrivacySettings = {
  profileVisibility: 'public' | 'university' | 'counselors-only' | 'private';
  allowDirectMessages: boolean;
  allowAppointmentRequests: boolean;
  shareWithResearch: boolean;
  shareAggregatedData: boolean;
  allowCookies: boolean;
  allowAnalytics: boolean;
};

export type PersonalizedSettings = {
  dashboardLayout?: 'default' | 'compact' | 'detailed';
  theme: 'light' | 'dark' | 'auto';
  defaultAppointmentDuration: 30 | 45 | 60 | 90;
  reminderTiming: number; // minutes before appointment
  favoriteResources?: string[];
  hiddenFeatures?: string[];
  customizations?: Record<string, any>;
};

export type AdminNote = {
  id: string;
  content: string;
  createdBy: string; // Admin UID
  createdAt: string;
  type: 'general' | 'warning' | 'restriction' | 'support';
  isVisible: boolean;
};

// Extended User types for specific roles
export type StudentUser = User & {
  role: 'student';
  academicInfo: AcademicInfo; // Required for students
  mentalHealthProfile?: MentalHealthProfile;
  appointmentHistory: AppointmentSummary[];
  counselorPreferences?: CounselorPreferences;
  crisisContacts?: string[]; // UIDs of designated crisis contacts
};

export type CounselorUser = User & {
  role: 'counselor';
  professionalInfo: ProfessionalInfo;
  availability: AvailabilitySlot[];
  specializations: string[];
  approaches: TherapeuticApproach[];
  credentials: Credential[];
  clientCapacity: ClientCapacity;
  performanceMetrics?: PerformanceMetrics;
  supervisorId?: string; // For supervised counselors
};

export type AdminUser = User & {
  role: 'admin';
  adminLevel: 'super' | 'department' | 'support' | 'read-only';
  permissions: AdminPermission[];
  departmentAccess?: string[];
  lastAdminAction?: string; // ISO string
  auditTrail: AuditEntry[];
};

// Supporting types for role-specific extensions
export type MentalHealthProfile = {
  riskLevel: 'low' | 'moderate' | 'high';
  lastScreening?: string; // ISO string
  activeConcerns: string[];
  triggerWarnings?: string[];
  medicationInfo?: MedicationInfo[];
  therapyHistory?: TherapyHistory[];
  crisisProtocol?: CrisisProtocol;
};

export type AppointmentSummary = {
  appointmentId: string;
  counselorId: string;
  date: string;
  type: string;
  status: 'completed' | 'cancelled' | 'no-show';
  rating?: number;
  followUpRequired: boolean;
};

export type CounselorPreferences = {
  preferredGender?: 'male' | 'female' | 'non-binary' | 'no-preference';
  preferredAge?: 'younger' | 'peer' | 'older' | 'no-preference';
  preferredSpecializations: string[];
  preferredApproaches: string[];
  languageRequirement?: string;
  avoidCounselors?: string[]; // UIDs of counselors to avoid
};

export type ProfessionalInfo = {
  licenseNumber?: string;
  licenseState?: string;
  licenseExpiry?: string; // ISO string
  yearsExperience: number;
  education: EducationRecord[];
  certifications: Certification[];
  professionalMemberships?: string[];
  supervisedBy?: string; // Senior counselor UID
  canSupervise: boolean;
  acceptsInsurance: boolean;
  rates?: SessionRates;
};

export type AvailabilitySlot = {
  id: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
  maxAppointments?: number;
  appointmentTypes?: string[];
  isRecurring: boolean;
  effectiveDate?: string; // ISO string
  expiryDate?: string; // ISO string
};

export type TherapeuticApproach = 
  | 'cognitive-behavioral'
  | 'psychodynamic'
  | 'humanistic'
  | 'solution-focused'
  | 'mindfulness-based'
  | 'dialectical-behavioral'
  | 'acceptance-commitment'
  | 'narrative-therapy'
  | 'family-systems'
  | 'trauma-informed'
  | 'other';

export type Credential = {
  id: string;
  title: string;
  institution: string;
  year: number;
  type: 'degree' | 'certification' | 'license' | 'training';
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string; // ISO string
  expiryDate?: string; // ISO string
  credentialNumber?: string;
  attachments?: string[]; // File URLs
};

export type ClientCapacity = {
  maxClientsPerDay: number;
  maxClientsPerWeek: number;
  maxActiveClients: number;
  currentActiveClients: number;
  emergencySlots: number;
  groupSessionCapacity: number;
};

export type PerformanceMetrics = {
  totalSessions: number;
  averageRating: number;
  completionRate: number; // Percentage of appointments completed
  noShowRate: number;
  clientSatisfactionScore: number;
  responseTime: number; // Average response time in hours
  specialtySuccessRates: Record<string, number>;
  lastUpdated: string; // ISO string
};

export type AdminPermission = {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
  conditions?: Record<string, any>;
};

export type AuditEntry = {
  id: string;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: string; // ISO string
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
};

// Additional supporting types
export type MedicationInfo = {
  name: string;
  dosage: string;
  frequency: string;
  prescriber: string;
  startDate: string; // ISO string
  endDate?: string; // ISO string
  sideEffects?: string[];
  effectiveness?: number; // 1-10 scale
};

export type TherapyHistory = {
  providerId?: string;
  providerName: string;
  duration: string; // "6 months", "2 years", etc.
  type: string;
  outcome: 'completed' | 'ongoing' | 'discontinued';
  helpful: boolean;
  notes?: string;
};

export type CrisisProtocol = {
  emergencyContacts: string[]; // Phone numbers
  preferredHospital?: string;
  medications?: string[];
  allergies?: string[];
  triggerWarnings: string[];
  copingStrategies: string[];
  lastUpdated: string; // ISO string
};

export type EducationRecord = {
  degree: string;
  institution: string;
  year: number;
  gpa?: number;
  honors?: string;
  relevantCoursework?: string[];
};

export type Certification = {
  name: string;
  issuingOrganization: string;
  issueDate: string; // ISO string
  expiryDate?: string; // ISO string
  credentialId?: string;
  verified: boolean;
};

export type SessionRates = {
  individual: number;
  group: number;
  emergency: number;
  family: number;
  assessment: number;
};

// Utility types for user management
export type UserCreateInput = Omit<User, 'uid' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'profileCompleteness'>;
export type UserUpdateInput = Partial<Omit<User, 'uid' | 'createdAt' | 'email' | 'role'>>;
export type UserSearchFilters = {
  role?: User['role'];
  department?: string;
  academicYear?: string;
  isActive?: boolean;
  hasEmergencyContact?: boolean;
  onboardingCompleted?: boolean;
  createdAfter?: string;
  createdBefore?: string;
};

// Type guards for role checking
export const isStudent = (user: User): user is StudentUser => user.role === 'student';
export const isCounselor = (user: User): user is CounselorUser => user.role === 'counselor';
export const isAdmin = (user: User): user is AdminUser => user.role === 'admin';