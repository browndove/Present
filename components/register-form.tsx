"use client";
import React, { useState } from 'react';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [userType, setUserType] = useState<'student' | 'counselor' | ''>('');
  const [formData, setFormData] = useState({
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    
    licenseNumber: '',
    yearsExperience: '',
    specializations: '',
    education: '',
    bio: '',
    phone: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateStudentId = (id: string): boolean => {
    // Student ID should be alphanumeric and at least 5 characters
    const idRegex = /^[A-Za-z0-9]{5,}$/;
    return idRegex.test(id);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // User type validation
    if (!userType) {
      newErrors.userType = 'Please select whether you are a student or counselor';
    }

    // Basic field validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (!validateStudentId(formData.studentId)) {
      newErrors.studentId = 'Student ID must be at least 5 alphanumeric characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Counselor-specific validations
    if (userType === 'counselor') {
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = 'License number is required';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhoneNumber(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }

      if (!formData.yearsExperience) {
        newErrors.yearsExperience = 'Years of experience is required';
      }

      if (!formData.education.trim()) {
        newErrors.education = 'Education information is required';
      }

      if (!formData.specializations.trim()) {
        newErrors.specializations = 'Specializations are required';
      }

      if (!formData.bio.trim()) {
        newErrors.bio = 'Professional bio is required';
      } else if (formData.bio.trim().length < 50) {
        newErrors.bio = 'Bio must be at least 50 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Registration data:', { userType, ...formData });
      // Handle form submission and Firebase integration
      // TODO: Send email confirmation
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 max-w-2xl mx-auto", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Join our platform as a student or counselor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
              {/* User Type Selection */}
              <div className="grid gap-3">
                <Label>I am registering as a:</Label>
                <RadioGroup value={userType} onValueChange={(value) => setUserType(value as 'student' | 'counselor')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="counselor" id="counselor" />
                    <Label htmlFor="counselor">Counselor</Label>
                  </div>
                </RadioGroup>
              </div>

              {userType && (
                <>


                  {/* Basic Information */}
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="studentId">Identification Number</Label>
                      <Input
                        id="Identificat number"
                        placeholder="Enter your ID"
                        value={formData.studentId}
                        onChange={(e) => handleInputChange('studentId', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required 
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required 
                      />
                    </div>

                    {/* Counselor-specific fields */}
                    {userType === 'counselor' && (
                      <>
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                          
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="licenseNumber">License Number</Label>
                              <Input
                                id="licenseNumber"
                                placeholder="Professional license number"
                                value={formData.licenseNumber}
                                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                                required
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="(+233) 123-4567-890"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                required
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="yearsExperience">Years of Experience</Label>
                              <Select onValueChange={(value) => handleInputChange('yearsExperience', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select experience level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0-2">0-2 years</SelectItem>
                                  <SelectItem value="3-5">3-5 years</SelectItem>
                                  <SelectItem value="6-10">6-10 years</SelectItem>
                                  <SelectItem value="11-15">11-15 years</SelectItem>
                                  <SelectItem value="16+">16+ years</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="education">Education</Label>
                              <Input
                                id="education"
                                placeholder="Degree(s) and Institution(s)"
                                value={formData.education}
                                onChange={(e) => handleInputChange('education', e.target.value)}
                                required
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="specializations">Specializations</Label>
                              <Input
                                id="specializations"
                                placeholder="e.g. Anxiety, Depression, Academic Stress"
                                value={formData.specializations}
                                onChange={(e) => handleInputChange('specializations', e.target.value)}
                                required
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="bio">Professional Bio</Label>
                              <Textarea
                                id="bio"
                                placeholder="Brief description of your approach and experience..."
                                className="min-h-[100px]"
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <Button onClick={handleSubmit} className="w-full">
                      Create Account
                    </Button>
                  </div>
                </>
              )}

            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-muted-foreground text-center text-xs text-balance">
        By creating an account, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>.
      </div>
    </div>
  );
}