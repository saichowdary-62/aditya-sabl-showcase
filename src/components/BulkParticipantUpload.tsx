import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { addParticipant, getStudentByPin, Participant } from '@/lib/data-service';
import { useToast } from '@/hooks/use-toast';

interface CSVParticipant {
  activityId: string;
  rollNumber: string;
  name: string;
  department: string;
  award: '1st Place' | '2nd Place' | '3rd Place' | 'Participation' | 'Volunteer';
}

interface BulkParticipantUploadProps {
  onUploadComplete?: () => void;
}

const BulkParticipantUpload = ({ onUploadComplete }: BulkParticipantUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; details?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseCSV = (text: string): CSVParticipant[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const participants: CSVParticipant[] = [];
    
    // Skip header row if it exists
    const startIndex = lines[0].toLowerCase().includes('activity') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim());
      if (values.length >= 5) {
        participants.push({
          activityId: values[0],
          rollNumber: values[1],
          name: values[2],
          department: values[3],
          award: values[4] as CSVParticipant['award'],
        });
      }
    }
    
    return participants;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isCSV = file.name.endsWith('.csv') || file.type === 'text/csv';
    
    if (!isCSV) {
      setUploadResult({
        success: false,
        message: 'Please upload a CSV file'
      });
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const text = await file.text();
      const csvParticipants = parseCSV(text);

      if (csvParticipants.length === 0) {
        setUploadResult({
          success: false,
          message: 'No valid participant records found in file'
        });
        setUploading(false);
        return;
      }

      let successCount = 0;
      let failCount = 0;
      let linkedToStudents = 0;
      const errors: string[] = [];

      for (const csvParticipant of csvParticipants) {
        try {
          // Check if student exists in database by PIN (roll number)
          const student = await getStudentByPin(csvParticipant.rollNumber);
          
          // Determine marks based on award type
          const marks = (csvParticipant.award === 'Participation' || csvParticipant.award === 'Volunteer') ? 5 : 10;
          
          const participant: Omit<Participant, 'id'> = {
            activityId: csvParticipant.activityId,
            name: csvParticipant.name,
            rollNumber: csvParticipant.rollNumber,
            department: csvParticipant.department,
            college: 'Aditya University',
            award: csvParticipant.award,
            studentPin: student ? student.pin : undefined,
            marks: marks
          };

          const result = await addParticipant(participant);
          
          if (result) {
            successCount++;
            if (student) {
              linkedToStudents++;
            }
          } else {
            failCount++;
            errors.push(`Failed to add ${csvParticipant.name} (${csvParticipant.rollNumber})`);
          }
        } catch (error) {
          failCount++;
          errors.push(`Error adding ${csvParticipant.name}: ${error}`);
        }
      }

      if (successCount > 0) {
        const detailMessage = `${successCount} participants added (${linkedToStudents} linked to student database)`;
        setUploadResult({
          success: true,
          message: 'Upload completed!',
          details: failCount > 0 ? `${detailMessage}. ${failCount} failed.` : detailMessage
        });
        toast({
          title: 'Upload Successful',
          description: detailMessage,
        });
        
        // Trigger refresh of participants list
        if (onUploadComplete) {
          onUploadComplete();
        }
      } else {
        setUploadResult({
          success: false,
          message: 'Failed to upload participants',
          details: errors.slice(0, 3).join(', ')
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        success: false,
        message: 'Error processing file. Please check the format.'
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Bulk Upload Participants
        </CardTitle>
        <CardDescription>
          Upload a CSV file with participant details. If roll number exists in student database, it will be linked to their performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            CSV format: Activity ID, Roll Number, Name, Department, Award
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="participant-file-upload"
          />
          <label htmlFor="participant-file-upload">
            <Button asChild disabled={uploading}>
              <span>
                {uploading ? 'Uploading...' : 'Choose File'}
              </span>
            </Button>
          </label>
        </div>

        {uploadResult && (
          <Alert variant={uploadResult.success ? 'default' : 'destructive'}>
            {uploadResult.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              <div>{uploadResult.message}</div>
              {uploadResult.details && (
                <div className="text-xs mt-1">{uploadResult.details}</div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium">Example CSV format:</p>
          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`Activity ID,Roll Number,Name,Department,Award
1,21A51A0501,John Doe,CSE,1st Place
1,21A51A0502,Jane Smith,IT,Participation
2,21A51A0503,Bob Johnson,ECE,Volunteer`}
          </pre>
          <div className="mt-2 space-y-1">
            <p className="text-xs"><strong>Award options:</strong> 1st Place, 2nd Place, 3rd Place, Participation, Volunteer</p>
            <p className="text-xs"><strong>Marks:</strong> Winners get 10 marks, Participation/Volunteer get 5 marks</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkParticipantUpload;
