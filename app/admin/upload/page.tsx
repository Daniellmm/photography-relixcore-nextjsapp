'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarIcon, Upload, X, Eye, EyeOff, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PaymentSwitch } from '@/components/ui/payment-switch';
import Image from 'next/image';


const eventTypes = [
  'Wedding',
  'Birthday',
  'Corporate',
  'Graduation',
  'Anniversary',
  'Baby Shower',
  'Other'
];



export default function UploadPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: null as number | null,
    eventDate: undefined as Date | undefined,
    eventType: '',
    isVisible: true,
    isPaid: false,
    assignedUsers: [] as string[]
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<{ _id: string; name: string; email: string }[]>([]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users');
        setUsers(res.data.users);
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };

    fetchUsers();
  }, []);


  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // 1. Upload images first
      const imageFormData = new FormData();
      selectedFiles.forEach(file => imageFormData.append('images', file));

      const uploadRes = await axios.post('/api/upload', imageFormData, {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          if (total && total > 0) {
            const percentCompleted = Math.round((loaded * 100) / total);
            setUploadProgress(Math.min(percentCompleted, 95)); // Leave 5% for album creation
          }
        }
      });

      const imageIds = uploadRes.data.imageIds;

      // 2. Post album data (remaining 5% of progress)
      const albumPayload = {
        title: formData.title,
        description: formData.description,
        price: formData.price ?? 0,
        eventDate: formData.eventDate,
        eventType: formData.eventType,
        isVisible: formData.isVisible,
        paid: formData.isPaid,
        accessUsers: formData.assignedUsers,
        images: imageIds,

      };

      const albumRes = await axios.post('/api/albums', albumPayload);
      setUploadProgress(100);

      console.log('Album created:', albumRes.data);

      // Reset form after successful upload
      setTimeout(() => {
        handleReset();
      }, 1000);

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Upload failed. Please try again.');
      } else {
        setError('Upload failed. Please try again.');
      }
    }
    finally {
      setIsUploading(false);
    }
  };


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file =>
      file.type === 'image/jpeg' || file.type === 'image/png'
    );

    setSelectedFiles(imageFiles);
    setPreviews([]); // Clear previous previews

    // Create previews
    const newPreviews: string[] = [];
    imageFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews[index] = e.target?.result as string;
        if (newPreviews.filter(Boolean).length === imageFiles.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };


  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUserSelect = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(userId)
        ? prev.assignedUsers.filter(id => id !== userId)
        : [...prev.assignedUsers, userId]
    }));
  };


  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      price: null,
      eventDate: undefined,
      eventType: '',
      isVisible: true,
      isPaid: false,
      assignedUsers: []
    });
    setSelectedFiles([]);
    setPreviews([]);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-gallery-bg">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-background mb-2">Upload New Album</h1>
          <p className="text-muted-foreground">Create and manage photo albums for your clients</p>
        </div>

        <form onSubmit={handleUpload} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Information */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Album Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Album Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter album title"
                    required
                    className='border-black/50'
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Album Price</Label>
                  <Input
                    id="price"
                    value={formData.price ?? ''}
                    type='number'
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        price: value === '' ? null : parseFloat(value)
                      }));
                    }}
                    placeholder="Enter album price"
                    className='border-black/50'
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Album Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the event or album content"
                    rows={3}
                    className='border-black/50'
                  />
                </div>

                <div className="space-y-2">
                  <Label>Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.eventDate && "text-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-foreground" />
                        {formData.eventDate ? format(formData.eventDate, "PPP") : "Select event date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.eventDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, eventDate: date }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select value={formData.eventType} onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}>
                    <SelectTrigger className='border-black/50'>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Settings & Access */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Album Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {formData.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <Label htmlFor="visible">Visible to Client</Label>
                  </div>
                  <PaymentSwitch
                    id="visible"
                    checked={formData.isVisible}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVisible: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <Label htmlFor="paid">Payment Status</Label>
                  </div>

                  <div className='flex flex-col'>
                    <PaymentSwitch
                      id="paid"
                      checked={formData.isPaid}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPaid: checked }))}
                      thumbColor="white"
                    />

                    <span className={`text-sm font-semibold ${formData.isPaid ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {formData.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Assign Access to Users</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                    {users.map(user => (
                      <div key={user._id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`user-${user._id}`}
                          checked={formData.assignedUsers.includes(user._id)}
                          onChange={() => handleUserSelect(user._id)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`user-${user._id}`} className="text-sm">
                          {user.name} ({user.email})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* File Upload Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="images">Select Images (JPEG/PNG only)</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png"
                  onChange={handleFileSelect}
                  className="file:mr-4 border-black/50 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>

              {/* Image Previews */}
              {previews.length > 0 && (
                <div className="space-y-2">
                  <Label>Image Previews ({selectedFiles.length} files)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-64 overflow-y-auto">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <Image
                          height={200}
                          width={200}
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <Label>Upload Progress</Label>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
                </div>
              )}
              {error && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset Form
            </Button>
            <Button type="submit" disabled={isUploading || selectedFiles.length === 0}>
              {isUploading ? 'Uploading...' : 'Upload Album'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
