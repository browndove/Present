'use server';

import { db } from './firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  orderBy,
  limit,
  writeBatch,
  Timestamp,
  setDoc,
  deleteField,
  arrayUnion,
  arrayRemove,
  increment,
  runTransaction,
  startAfter,
  Query,
  DocumentSnapshot,
  FieldValue,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import type { 
  RequestAppointmentInput, 
  AppointmentUpdateInput,
  RescheduleAppointmentInput,
  SessionNotesInput,
  MessageInput,
  FeedbackInput,
  MentalHealthScreeningInput,
  CrisisReportInput,
  GroupTherapyInput,
  ReportInput
} from './schemas';
import type { 
  User, 
  StudentUser, 
  CounselorUser, 
  AdminUser,
  AppointmentSummary,
  PerformanceMetrics,
  ConsentRecord
} from './types';
import { chat, type AssistantInput } from '@/ai/flows/assistant-flow';
import { revalidatePath } from 'next/cache';
import type { Message } from 'genkit';
import { StreamClient } from '@stream-io/node-sdk';

// Enhanced error handling
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Enhanced serialization with deep object support
const serializeFirestoreData = (doc: any): any => {
  if (!doc || !doc.data) return null;

  const data = doc.data();
  const serializedData: { [key: string]: any } = { id: doc.id };

  const serialize = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    
    if (obj && typeof obj.toDate === 'function') {
      return obj.toDate().toISOString();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(serialize);
    }
    
    if (typeof obj === 'object' && obj.constructor === Object) {
      const serializedObj: { [key: string]: any } = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          serializedObj[key] = serialize(obj[key]);
        }
      }
      return serializedObj;
    }
    
    return obj;
  };

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      serializedData[key] = serialize(data[key]);
    }
  }

  return serializedData;
};

// Enhanced pagination helper
interface PaginationOptions {
  limit?: number;
  lastDoc?: DocumentSnapshot;
  orderField?: string;
  orderDirection?: 'asc' | 'desc';
}

interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  lastDoc?: DocumentSnapshot;
  total?: number;
}

// Authentication and permission helpers
async function checkUserPermission(userId: string, requiredRole?: string[], resourceOwnerId?: string): Promise<User> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) {
    throw new AppError('User not found', 'USER_NOT_FOUND', 404);
  }

  const user = serializeFirestoreData(userDoc) as User;
  
  if (!user.isActive) {
    throw new AppError('Account is inactive', 'ACCOUNT_INACTIVE', 403);
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    throw new AppError('Insufficient permissions', 'INSUFFICIENT_PERMISSIONS', 403);
  }

  if (resourceOwnerId && resourceOwnerId !== userId && user.role !== 'admin') {
    throw new AppError('Access denied', 'ACCESS_DENIED', 403);
  }

  return user;
}

// Enhanced Stream token provider with error handling and logging
export async function streamTokenProvider(userId: string) {
  try {
    await checkUserPermission(userId);

    if (!process.env.STREAM_SECRET_KEY || !process.env.NEXT_PUBLIC_STREAM_API_KEY) {
      throw new AppError('Stream configuration missing', 'STREAM_CONFIG_ERROR', 500);
    }

    const streamClient = new StreamClient(
      process.env.NEXT_PUBLIC_STREAM_API_KEY, 
      process.env.STREAM_SECRET_KEY
    );
    
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60 * 24; // 24 hours
    const token = streamClient.createToken(userId, exp);

    // Log token generation for audit
    await addDoc(collection(db, 'audit_logs'), {
      userId,
      action: 'stream_token_generated',
      timestamp: serverTimestamp(),
      metadata: { expiresAt: new Date(exp * 1000).toISOString() }
    });

    return { token };
  } catch (error: any) {
    console.error(`Error generating Stream token for user ${userId}:`, error);
    return { error: error.message || 'Failed to generate video token.' };
  }
}

// Enhanced student sessions with filtering and pagination
export async function getStudentSessions(
  studentId: string, 
  forCounselor: boolean = false,
  options: {
    status?: string[];
    appointmentType?: string[];
    dateRange?: { start: string; end: string };
    pagination?: PaginationOptions;
  } = {}
) {
  try {
    const user = await checkUserPermission(studentId, undefined, studentId);
    
    let q = query(collection(db, 'appointments'), where('studentId', '==', studentId));

    // Apply filters
    if (options.status && options.status.length > 0) {
      q = query(q, where('status', 'in', options.status));
    }

    if (options.appointmentType && options.appointmentType.length > 0) {
      q = query(q, where('appointmentType', 'in', options.appointmentType));
    }

    if (options.dateRange) {
      q = query(q, 
        where('date', '>=', options.dateRange.start),
        where('date', '<=', options.dateRange.end)
      );
    }

    // Apply pagination
    if (options.pagination?.limit) {
      q = query(q, limit(options.pagination.limit));
    }

    if (options.pagination?.lastDoc) {
      q = query(q, startAfter(options.pagination.lastDoc));
    }

    const querySnapshot = await getDocs(q);
    let sessions = querySnapshot.docs.map(doc => serializeFirestoreData(doc));
    
    sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (forCounselor) {
      return { 
        data: sessions,
        hasMore: sessions.length === (options.pagination?.limit || 50)
      };
    }

    // Enrich with counselor details
    const enrichedSessions = await Promise.all(
      sessions.map(async (session: any) => {
        if (session.counselorId) {
          const counselorDoc = await getDoc(doc(db, 'users', session.counselorId));
          if (counselorDoc.exists()) {
            const counselorData = counselorDoc.data();
            session.counselor = {
              id: session.counselorId,
              name: counselorData.fullName,
              avatarUrl: counselorData.avatarUrl || null,
              avatarFallback: counselorData.fullName?.split(" ").map((n:string)=>n[0]).join("") || 'C',
              specializations: counselorData.specializations || [],
              credentials: counselorData.credentials || [],
            };
          }
        }
        session.status = session.status ? session.status.charAt(0).toUpperCase() + session.status.slice(1) : 'Pending';
        return session;
      })
    );

    return { 
      data: enrichedSessions,
      hasMore: sessions.length === (options.pagination?.limit || 50)
    };
  } catch (error: any) {
    console.error("Error fetching student sessions:", error);
    return { error: error.message };
  }
}

// Enhanced counselor appointments with advanced filtering
export async function getCounselorAppointments(
  counselorId: string,
  options: {
    status?: string[];
    appointmentType?: string[];
    priority?: string[];
    dateRange?: { start: string; end: string };
    searchTerm?: string;
    pagination?: PaginationOptions;
  } = {}
) {
  try {
    await checkUserPermission(counselorId, ['counselor', 'admin']);

    let q = query(collection(db, "appointments"), where("counselorId", "==", counselorId));

    // Apply filters
    if (options.status && options.status.length > 0) {
      q = query(q, where('status', 'in', options.status));
    }

    if (options.appointmentType && options.appointmentType.length > 0) {
      q = query(q, where('appointmentType', 'in', options.appointmentType));
    }

    if (options.priority && options.priority.length > 0) {
      q = query(q, where('priority', 'in', options.priority));
    }

    if (options.dateRange) {
      q = query(q, 
        where('date', '>=', options.dateRange.start),
        where('date', '<=', options.dateRange.end)
      );
    }

    if (options.pagination?.limit) {
      q = query(q, limit(options.pagination.limit));
    }

    const querySnapshot = await getDocs(q);
    let appointments = querySnapshot.docs.map(doc => serializeFirestoreData(doc));
    
    appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const enrichedAppointments = await Promise.all(
      appointments.map(async (apt: any) => {
        if (apt.studentId) {
          const studentDoc = await getDoc(doc(db, 'users', apt.studentId));
          if (studentDoc.exists()) {
            const studentData = studentDoc.data();
            apt.student = {
              id: apt.studentId,
              name: studentData.fullName,
              avatarUrl: studentData.avatarUrl || null,
              email: studentData.email,
              universityId: studentData.universityId,
              academicInfo: studentData.academicInfo,
            };
          }
        }
        apt.status = apt.status ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1) : 'Pending';
        return apt;
      })
    );

    // Apply search filter after enrichment
    let filteredAppointments = enrichedAppointments;
    if (options.searchTerm) {
      const searchLower = options.searchTerm.toLowerCase();
      filteredAppointments = enrichedAppointments.filter(apt => 
        apt.student?.name?.toLowerCase().includes(searchLower) ||
        apt.reason?.toLowerCase().includes(searchLower) ||
        apt.appointmentType?.toLowerCase().includes(searchLower)
      );
    }

    return { 
      data: filteredAppointments,
      hasMore: appointments.length === (options.pagination?.limit || 50)
    };
  } catch (error: any) {
    console.error("Error fetching counselor appointments:", error);
    return { error: error.message };
  }
}

// Enhanced appointment status update with notifications
export async function updateAppointmentStatus(
  appointmentId: string, 
  status: 'confirmed' | 'cancelled' | 'completed' | 'no-show' | 'rescheduled',
  updatedBy: string,
  notes?: string
) {
  try {
    await checkUserPermission(updatedBy, ['counselor', 'admin']);

    const appointmentRef = doc(db, 'appointments', appointmentId);
    const appointmentSnap = await getDoc(appointmentRef);
    
    if (!appointmentSnap.exists()) {
      throw new AppError('Appointment not found', 'APPOINTMENT_NOT_FOUND', 404);
    }

    const oldData = appointmentSnap.data();
    
    await runTransaction(db, async (transaction) => {
      // Update appointment
      transaction.update(appointmentRef, {
        status: status,
        modifiedAt: serverTimestamp(),
        modifiedBy: updatedBy,
        statusHistory: arrayUnion({
          status,
          changedBy: updatedBy,
          changedAt: serverTimestamp(),
          notes: notes || null
        })
      });

      // Update counselor performance metrics
      const counselorRef = doc(db, 'users', oldData.counselorId);
      if (status === 'completed') {
        transaction.update(counselorRef, {
          'performanceMetrics.totalSessions': increment(1),
          'performanceMetrics.lastUpdated': serverTimestamp()
        });
      } else if (status === 'no-show') {
        transaction.update(counselorRef, {
          'performanceMetrics.noShowRate': increment(1),
          'performanceMetrics.lastUpdated': serverTimestamp()
        });
      }

      // Create notification for student
      const notificationRef = doc(collection(db, 'notifications'));
      transaction.set(notificationRef, {
        userId: oldData.studentId,
        type: 'appointment_update',
        title: 'Appointment Status Updated',
        message: `Your appointment has been ${status}`,
        data: { appointmentId, status },
        read: false,
        createdAt: serverTimestamp()
      });
    });

    revalidatePath('/counselor/appointments');
    revalidatePath('/counselor/dashboard');
    revalidatePath('/student/sessions');
    revalidatePath(`/appointment/${appointmentId}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating appointment status:", error);
    return { success: false, error: error.message };
  }
}

// Enhanced reschedule appointment
export async function rescheduleAppointment(
  appointmentId: string,
  data: RescheduleAppointmentInput,
  updatedBy: string
) {
  try {
    await checkUserPermission(updatedBy, ['counselor', 'admin', 'student']);

    const appointmentRef = doc(db, 'appointments', appointmentId);
    const appointmentSnap = await getDoc(appointmentRef);
    
    if (!appointmentSnap.exists()) {
      throw new AppError('Appointment not found', 'APPOINTMENT_NOT_FOUND', 404);
    }

    const oldData = appointmentSnap.data();
    
    await runTransaction(db, async (transaction) => {
      transaction.update(appointmentRef, {
        date: data.newDate.toISOString().split('T')[0],
        time: data.newTime,
        status: 'rescheduled',
        rescheduleReason: data.reason,
        modifiedAt: serverTimestamp(),
        modifiedBy: updatedBy,
        rescheduleHistory: arrayUnion({
          oldDate: oldData.date,
          oldTime: oldData.time,
          newDate: data.newDate.toISOString().split('T')[0],
          newTime: data.newTime,
          reason: data.reason,
          rescheduledBy: updatedBy,
          rescheduledAt: serverTimestamp()
        })
      });

      // Notify relevant parties
      const notifyUsers = [oldData.studentId, oldData.counselorId].filter(id => id !== updatedBy);
      notifyUsers.forEach(userId => {
        const notificationRef = doc(collection(db, 'notifications'));
        transaction.set(notificationRef, {
          userId,
          type: 'appointment_rescheduled',
          title: 'Appointment Rescheduled',
          message: `Appointment has been rescheduled to ${data.newDate.toDateString()} at ${data.newTime}`,
          data: { appointmentId, newDate: data.newDate.toISOString(), newTime: data.newTime },
          read: false,
          createdAt: serverTimestamp()
        });
      });
    });

    revalidatePath('/counselor/appointments');
    revalidatePath('/student/sessions');
    
    return { success: true };
  } catch (error: any) {
    console.error("Error rescheduling appointment:", error);
    return { success: false, error: error.message };
  }
}

// Enhanced get assigned students with detailed info
export async function getAssignedStudents(
  counselorId: string,
  options: {
    includeInactive?: boolean;
    searchTerm?: string;
    academicYear?: string[];
    riskLevel?: string[];
    pagination?: PaginationOptions;
  } = {}
) {
  try {
    await checkUserPermission(counselorId, ['counselor', 'admin']);
    
    // Get students from appointments
    const appointmentsQuery = query(
      collection(db, 'appointments'), 
      where('counselorId', '==', counselorId)
    );
    const appointmentsSnapshot = await getDocs(appointmentsQuery);
    const studentIds = new Set(appointmentsSnapshot.docs.map(d => d.data().studentId));

    // Also get directly assigned students
    const usersQuery = query(
      collection(db, 'users'), 
      where('assignedCounselor', '==', counselorId)
    );
    const usersSnapshot = await getDocs(usersQuery);
    usersSnapshot.forEach(d => studentIds.add(d.id));
    
    if (studentIds.size === 0) return { data: [], hasMore: false };

    const studentDocs = await Promise.all(
      Array.from(studentIds).map(id => getDoc(doc(db, 'users', id)))
    );
    
    let studentsData: StudentUser[] = studentDocs
      .filter(d => d.exists())
      .map(d => serializeFirestoreData(d)) as StudentUser[];

    // Apply filters
    if (!options.includeInactive) {
      studentsData = studentsData.filter(student => student.isActive);
    }

    if (options.academicYear && options.academicYear.length > 0) {
      studentsData = studentsData.filter(student => 
        student.academicInfo && options.academicYear!.includes(student.academicInfo.year)
      );
    }

    if (options.riskLevel && options.riskLevel.length > 0) {
      studentsData = studentsData.filter(student => 
        student.mentalHealthProfile && options.riskLevel!.includes(student.mentalHealthProfile.riskLevel)
      );
    }

    if (options.searchTerm) {
      const searchLower = options.searchTerm.toLowerCase();
      studentsData = studentsData.filter(student => 
        student.fullName.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.universityId.toLowerCase().includes(searchLower)
      );
    }

    // Enrich with appointment statistics
    const enrichedStudents = await Promise.all(
      studentsData.map(async (student) => {
        const studentAppointments = await getDocs(
          query(
            collection(db, 'appointments'),
            where('studentId', '==', student.uid),
            where('counselorId', '==', counselorId)
          )
        );
        
        const appointments = studentAppointments.docs.map(doc => doc.data());
        const totalSessions = appointments.filter(apt => apt.status === 'completed').length;
        const missedSessions = appointments.filter(apt => apt.status === 'no-show').length;
        const lastSession = appointments
          .filter(apt => apt.status === 'completed')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        return {
          ...student,
          sessionStats: {
            total: totalSessions,
            missed: missedSessions,
            lastSession: lastSession ? lastSession.date : null,
            upcomingSessions: appointments.filter(apt => 
              apt.status === 'confirmed' && new Date(apt.date) > new Date()
            ).length
          }
        };
      })
    );

    return { 
      data: enrichedStudents,
      hasMore: false // Since we're getting all assigned students
    };
  } catch (error: any) {
    console.error("Error fetching assigned students:", error);
    return { error: error.message };
  }
}

// Enhanced create appointment with validation and conflict checking
export async function createAppointment(userId: string, data: RequestAppointmentInput) {
  try {
    const user = await checkUserPermission(userId, ['student']);

    // Check for appointment conflicts
    const conflictQuery = query(
      collection(db, 'appointments'),
      where('counselorId', '==', data.counselorId),
      where('date', '==', data.preferredDate.toISOString().split('T')[0]),
      where('time', '==', data.preferredTime),
      where('status', 'in', ['pending', 'confirmed'])
    );
    
    const conflictSnapshot = await getDocs(conflictQuery);
    if (!conflictSnapshot.empty) {
      return { error: 'This time slot is already booked. Please choose a different time.' };
    }

    // Check counselor availability
    const counselorDoc = await getDoc(doc(db, 'users', data.counselorId));
    if (!counselorDoc.exists()) {
      throw new AppError('Counselor not found', 'COUNSELOR_NOT_FOUND', 404);
    }

    const counselorData = counselorDoc.data() as CounselorUser;
    const appointmentDate = new Date(data.preferredDate);
    const dayOfWeek = appointmentDate.toLocaleLowerCase() as any;
    
    const isAvailable = counselorData.availability?.some(slot => 
      slot.dayOfWeek === dayOfWeek && 
      slot.isAvailable &&
      data.preferredTime >= slot.startTime &&
      data.preferredTime <= slot.endTime
    );

    if (!isAvailable) {
      return { error: 'Counselor is not available at the selected time.' };
    }

    const appointmentData = {
      studentId: userId,
      counselorId: data.counselorId,
      reason: data.reason,
      date: data.preferredDate.toISOString().split('T')[0],
      time: data.preferredTime,
      duration: data.duration || '60',
      contactMethod: data.contactMethod,
      appointmentType: data.appointmentType,
      priority: data.priority,
      referralSource: data.referralSource || null,
      specificConcerns: data.specificConcerns || [],
      timezone: data.timezone,
      status: data.priority === 'emergency' ? 'urgent' : 'pending',
      createdBy: userId,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
      additionalNotes: data.additionalNotes || null,
      consentToRecord: data.consentToRecord || false,
      insuranceInfo: data.insuranceInfo || null,
      alternativeDate: data.alternativeDate ? data.alternativeDate.toISOString().split('T')[0] : null,
      alternativeTime: data.alternativeTime || null,
    };

    await runTransaction(db, async (transaction) => {
      const appointmentRef = doc(collection(db, 'appointments'));
      transaction.set(appointmentRef, appointmentData);

      // Update student's appointment history
      const studentRef = doc(db, 'users', userId);
      transaction.update(studentRef, {
        'appointmentHistory': arrayUnion({
          appointmentId: appointmentRef.id,
          counselorId: data.counselorId,
          date: appointmentData.date,
          type: data.appointmentType,
          status: appointmentData.status
        })
      });

      // Create notification for counselor
      const notificationRef = doc(collection(db, 'notifications'));
      transaction.set(notificationRef, {
        userId: data.counselorId,
        type: 'new_appointment_request',
        title: 'New Appointment Request',
        message: `${user.fullName} has requested an appointment`,
        data: { appointmentId: appointmentRef.id, priority: data.priority },
        read: false,
        createdAt: serverTimestamp()
      });

      // If it's an emergency, create additional urgent notification
      if (data.priority === 'emergency') {
        const urgentNotificationRef = doc(collection(db, 'notifications'));
        transaction.set(urgentNotificationRef, {
          userId: data.counselorId,
          type: 'emergency_appointment',
          title: 'URGENT: Emergency Appointment Request',
          message: `${user.fullName} has requested an emergency appointment`,
          data: { appointmentId: appointmentRef.id, priority: 'emergency' },
          read: false,
          urgent: true,
          createdAt: serverTimestamp()
        });
      }
    });

    revalidatePath('/student/sessions');
    revalidatePath('/counselor/appointments');
    
    return { success: true };
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return { error: error.message };
  }
}

// Enhanced get counselors with filtering and availability
export async function getCounselors(
  options: {
    specializations?: string[];
    approaches?: string[];
    languages?: string[];
    availableOn?: { date: string; time: string };
    acceptsInsurance?: boolean;
    searchTerm?: string;
    pagination?: PaginationOptions;
  } = {}
) {
  try {
    let q = query(collection(db, 'users'), where('role', '==', 'counselor'));
    
    if (options.pagination?.limit) {
      q = query(q, limit(options.pagination.limit));
    }

    const querySnapshot = await getDocs(q);
    let counselors = querySnapshot.docs.map(d => serializeFirestoreData(d)) as CounselorUser[];

    // Apply filters
    if (options.specializations && options.specializations.length > 0) {
      counselors = counselors.filter(counselor =>
        counselor.specializations?.some(spec => options.specializations!.includes(spec))
      );
    }

    if (options.approaches && options.approaches.length > 0) {
      counselors = counselors.filter(counselor =>
        counselor.approaches?.some(approach => options.approaches!.includes(approach))
      );
    }

    if (options.acceptsInsurance !== undefined) {
      counselors = counselors.filter(counselor =>
        counselor.professionalInfo?.acceptsInsurance === options.acceptsInsurance
      );
    }

    if (options.searchTerm) {
      const searchLower = options.searchTerm.toLowerCase();
      counselors = counselors.filter(counselor =>
        counselor.fullName.toLowerCase().includes(searchLower) ||
        counselor.bio?.toLowerCase().includes(searchLower) ||
        counselor.specializations?.some(spec => spec.toLowerCase().includes(searchLower))
      );
    }

    // Check availability if specified
    if (options.availableOn) {
      const requestedDate = new Date(options.availableOn.date);
      const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'lowercase' }) as any;
      
      counselors = counselors.filter(counselor => {
        const isAvailable = counselor.availability?.some(slot =>
          slot.dayOfWeek === dayOfWeek &&
          slot.isAvailable &&
          options.availableOn!.time >= slot.startTime &&
          options.availableOn!.time <= slot.endTime
        );
        return isAvailable;
      });
    }

    // Enrich with performance metrics and current load
    const enrichedCounselors = await Promise.all(
      counselors.map(async (counselor) => {
        // Get current appointment load
        const currentAppointments = await getDocs(
          query(
            collection(db, 'appointments'),
            where('counselorId', '==', counselor.uid),
            where('status', 'in', ['pending', 'confirmed']),
            where('date', '>=', new Date().toISOString().split('T')[0])
          )
        );

        const upcomingAppointments = currentAppointments.size;
        const availability = counselor.clientCapacity ? 
          Math.max(0, counselor.clientCapacity.maxClientsPerWeek - upcomingAppointments) : 
          null;

        return {
          ...counselor,
          currentLoad: {
            upcomingAppointments,
            availability,
            isAcceptingNewClients: availability === null || availability > 0
          }
        };
      })
    );

    return { 
      data: enrichedCounselors,
      hasMore: counselors.length === (options.pagination?.limit || 50)
    };
  } catch (error: any) {
    console.error("Error fetching counselors:", error);
    return { error: error.message };
  }
}

// Session notes management
export async function createSessionNotes(
  appointmentId: string,
  data: SessionNotesInput,
  counselorId: string
) {
  try {
    await checkUserPermission(counselorId, ['counselor']);

    const appointmentRef = doc(db, 'appointments', appointmentId);
    const appointmentSnap = await getDoc(appointmentRef);
    
    if (!appointmentSnap.exists()) {
      throw new AppError('Appointment not found', 'APPOINTMENT_NOT_FOUND', 404);
    }

    const notesData = {
      ...data,
      counselorId,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    };

    await runTransaction(db, async (transaction) => {
      const notesRef = doc(collection(db, 'session_notes'));
      transaction.set(notesRef, notesData);

      // Update appointment with notes reference
      transaction.update(appointmentRef, {
        sessionNotesId: notesRef.id,
        status: 'completed',
        modifiedAt: serverTimestamp()
      });

      // Update counselor performance metrics
      const counselorRef = doc(db, 'users', counselorId);
      transaction.update(counselorRef, {
        'performanceMetrics.totalSessions': increment(1),
        'performanceMetrics.lastUpdated': serverTimestamp()
      });
    });

