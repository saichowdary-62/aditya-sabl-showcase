import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ExtraMarksRecord {
  pin: string;
  extraMarks: number;
}

const BulkExtraMarksUpload = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; details?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseCSV = (text: string): ExtraMarksRecord[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const records: ExtraMarksRecord[] = [];
    
    // Skip header row if it exists
    const startIndex = lines[0].toLowerCase().includes('pin') || lines[0].toLowerCase().includes('roll') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim());
      if (values.length >= 2) {
        const marks = parseInt(values[1]);
        if (!isNaN(marks) && marks >= 0) {
          records.push({
            pin: values[0],
            extraMarks: marks,
          });
        }
      }
    }
    
    return records;
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
      const records = parseCSV(text);

      if (records.length === 0) {
        setUploadResult({
          success: false,
          message: 'No valid records found in file'
        });
        setUploading(false);
        return;
      }

      let successCount = 0;
      let failCount = 0;
      const failedPins: string[] = [];

      for (const record of records) {
        // Find student by PIN (case-insensitive)
        const { data: student, error: findError } = await supabase
          .from('students')
          .select('id, extra_marks')
          .ilike('pin', record.pin)
          .single();

        if (findError || !student) {
          failCount++;
          failedPins.push(record.pin);
          continue;
        }

        // Update extra marks
        const { error: updateError } = await supabase
          .from('students')
          .update({ extra_marks: record.extraMarks })
          .eq('id', student.id);

        if (updateError) {
          failCount++;
          failedPins.push(record.pin);
        } else {
          successCount++;
        }
      }

      if (successCount > 0) {
        setUploadResult({
          success: true,
          message: `Successfully updated ${successCount} student(s)`,
          details: failCount > 0 ? `Failed: ${failCount} (PINs not found: ${failedPins.slice(0, 5).join(', ')}${failedPins.length > 5 ? '...' : ''})` : undefined
        });
        toast({
          title: 'Upload Successful',
          description: `${successCount} student extra marks updated`,
        });
        onSuccess?.();
      } else {
        setUploadResult({
          success: false,
          message: 'Failed to update any records. Please check if the PINs exist in the database.',
          details: `PINs not found: ${failedPins.slice(0, 5).join(', ')}${failedPins.length > 5 ? '...' : ''}`
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
          Bulk Upload Extra Marks
        </CardTitle>
        <CardDescription>
          Upload a CSV file with student PINs and extra marks to update in bulk
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            CSV format: PIN, Extra Marks (one student per line)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="extra-marks-upload"
          />
          <label htmlFor="extra-marks-upload">
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
              <p>{uploadResult.message}</p>
              {uploadResult.details && (
                <p className="text-xs mt-1 opacity-80">{uploadResult.details}</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium">Example CSV format:</p>
          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`PIN,Extra Marks
21A51A0501,5
21A51A0502,10
21A51A0503,3`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkExtraMarksUpload;
