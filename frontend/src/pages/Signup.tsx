import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, SignupData } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    disability_types: {
      vision: false,
      hearing: false,
      motor: false,
      cognitive: false,
      other: '',
    },
    age: undefined,
    language_preference: 'en',
    grade_level: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNext = () => {
    setError('');
    
    if (step === 1) {
      // Validate basic info
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (formData.password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    if (step === 2) {
      // Validate at least one disability type is selected
      const hasDisability = formData.disability_types.vision || 
                           formData.disability_types.hearing || 
                           formData.disability_types.motor || 
                           formData.disability_types.cognitive ||
                           formData.disability_types.other;
      if (!hasDisability) {
        setError('Please select at least one accessibility need');
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Clean up data before sending
      const submitData = {
        ...formData,
        disability_types: {
          ...formData.disability_types,
          other: formData.disability_types.other || undefined,
        },
        age: formData.age || undefined,
        grade_level: formData.grade_level || undefined,
      };

      await signup(submitData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="min-h-[48px]"
          aria-required="true"
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="min-h-[48px]"
          aria-required="true"
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          placeholder="At least 6 characters"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          className="min-h-[48px]"
          aria-required="true"
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="min-h-[48px]"
          aria-required="true"
          autoComplete="new-password"
        />
      </div>

      <Button
        type="button"
        onClick={handleNext}
        className="w-full min-h-[48px]"
        aria-label="Continue to accessibility preferences"
      >
        Next: Accessibility Preferences
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-base">Select your accessibility needs: *</Label>
        <p className="text-sm text-gray-600">Choose all that apply to personalize your experience</p>
        
        <div className="space-y-3 pt-2">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="vision"
              checked={formData.disability_types.vision}
              onCheckedChange={(checked) => 
                setFormData({
                  ...formData,
                  disability_types: { ...formData.disability_types, vision: !!checked }
                })
              }
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="vision" className="font-medium cursor-pointer">
                Vision Disabilities
              </Label>
              <p className="text-sm text-gray-500">Blind, Low Vision, Color Blindness</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="hearing"
              checked={formData.disability_types.hearing}
              onCheckedChange={(checked) => 
                setFormData({
                  ...formData,
                  disability_types: { ...formData.disability_types, hearing: !!checked }
                })
              }
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="hearing" className="font-medium cursor-pointer">
                Hearing Disabilities
              </Label>
              <p className="text-sm text-gray-500">Deaf, Hard of Hearing</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="motor"
              checked={formData.disability_types.motor}
              onCheckedChange={(checked) => 
                setFormData({
                  ...formData,
                  disability_types: { ...formData.disability_types, motor: !!checked }
                })
              }
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="motor" className="font-medium cursor-pointer">
                Motor/Mobility Disabilities
              </Label>
              <p className="text-sm text-gray-500">Limited Mobility, Motor Impairment</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="cognitive"
              checked={formData.disability_types.cognitive}
              onCheckedChange={(checked) => 
                setFormData({
                  ...formData,
                  disability_types: { ...formData.disability_types, cognitive: !!checked }
                })
              }
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="cognitive" className="font-medium cursor-pointer">
                Cognitive Disabilities
              </Label>
              <p className="text-sm text-gray-500">Dyslexia, ADHD, Learning Disabilities</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="other">Other (please specify)</Label>
            <Input
              id="other"
              type="text"
              placeholder="Describe any other accessibility needs"
              value={formData.disability_types.other || ''}
              onChange={(e) => 
                setFormData({
                  ...formData,
                  disability_types: { ...formData.disability_types, other: e.target.value }
                })
              }
              className="min-h-[48px]"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleBack}
          variant="outline"
          className="min-h-[48px]"
          aria-label="Go back to basic information"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          className="flex-1 min-h-[48px]"
          aria-label="Continue to additional information"
        >
          Next: Additional Info
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          placeholder="Enter your age"
          value={formData.age || ''}
          onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : undefined })}
          min="5"
          max="100"
          className="min-h-[48px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Preferred Language</Label>
        <Select
          value={formData.language_preference}
          onValueChange={(value) => setFormData({ ...formData, language_preference: value })}
        >
          <SelectTrigger id="language" className="min-h-[48px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="grade">Grade Level</Label>
        <Select
          value={formData.grade_level}
          onValueChange={(value) => setFormData({ ...formData, grade_level: value })}
        >
          <SelectTrigger id="grade" className="min-h-[48px]">
            <SelectValue placeholder="Select grade level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kindergarten">Kindergarten</SelectItem>
            <SelectItem value="grade-1">Grade 1</SelectItem>
            <SelectItem value="grade-2">Grade 2</SelectItem>
            <SelectItem value="grade-3">Grade 3</SelectItem>
            <SelectItem value="grade-4">Grade 4</SelectItem>
            <SelectItem value="grade-5">Grade 5</SelectItem>
            <SelectItem value="grade-6">Grade 6</SelectItem>
            <SelectItem value="grade-7">Grade 7</SelectItem>
            <SelectItem value="grade-8">Grade 8</SelectItem>
            <SelectItem value="grade-9">Grade 9</SelectItem>
            <SelectItem value="grade-10">Grade 10</SelectItem>
            <SelectItem value="grade-11">Grade 11</SelectItem>
            <SelectItem value="grade-12">Grade 12</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleBack}
          variant="outline"
          className="min-h-[48px]"
          disabled={isLoading}
          aria-label="Go back to accessibility preferences"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 min-h-[48px]"
          disabled={isLoading}
          aria-label="Complete registration"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Join EduEqui
          </CardTitle>
          <CardDescription className="text-center">
            Step {step} of 3: {step === 1 ? 'Basic Information' : step === 2 ? 'Accessibility Needs' : 'Additional Details'}
          </CardDescription>
          <div className="flex gap-2 pt-2">
            <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} aria-label="Signup form">
            {error && (
              <Alert variant="destructive" className="mb-4" role="alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-semibold">
              Sign in here
            </Link>
          </div>
          <div className="text-sm text-center">
            <Link to="/" className="text-gray-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
