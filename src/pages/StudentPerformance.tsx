import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, User, Award, Calendar, Trophy, TrendingUp, Sparkles, Download } from 'lucide-react';
import { getStudentPerformance } from '@/lib/data-service';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const StudentPerformance = () => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [error, setError] = useState('');
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    const fetchTotalEvents = async () => {
      const { count } = await supabase
        .from('previous_activities')
        .select('*', { count: 'exact', head: true });
      setTotalEvents(count || 0);
    };
    fetchTotalEvents();
  }, []);

  const handleSearch = async () => {
    if (!pin.trim()) {
      setError('Please enter a PIN number');
      return;
    }

    setLoading(true);
    setError('');
    setPerformanceData(null);

    try {
      const data = await getStudentPerformance(pin.trim());
      
      if (!data) {
        setError('No student found with this PIN number');
      } else {
        setPerformanceData(data);
      }
    } catch (err) {
      setError('Error fetching student performance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDownload = () => {
    if (!performanceData) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const participationRate = totalEvents > 0 ? Math.round((performanceData.participations.length / totalEvents) * 100) : 0;
    
    // Header background
    doc.setFillColor(26, 54, 93);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Header accent line
    doc.setFillColor(249, 115, 22);
    doc.rect(0, 40, pageWidth, 3, 'F');
    
    // Title
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT PERFORMANCE REPORT', pageWidth / 2, 22, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SABL - Student Activity Based Learning', pageWidth / 2, 32, { align: 'center' });
    
    // Student Details Section
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(15, 50, pageWidth - 30, 45, 3, 3, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(26, 54, 93);
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT DETAILS', 20, 60);
    
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(20, 63, 75, 63);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    
    // Left column
    doc.setFont('helvetica', 'bold');
    doc.text('Name:', 20, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(performanceData.student.name, 45, 73);
    
    doc.setFont('helvetica', 'bold');
    doc.text('PIN:', 20, 82);
    doc.setFont('helvetica', 'normal');
    doc.text(performanceData.student.pin, 45, 82);
    
    // Right column
    doc.setFont('helvetica', 'bold');
    doc.text('Branch:', 110, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(performanceData.student.branch, 135, 73);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Year:', 110, 82);
    doc.setFont('helvetica', 'normal');
    doc.text(performanceData.student.year, 135, 82);
    
    // Performance Summary Section
    doc.setFontSize(12);
    doc.setTextColor(26, 54, 93);
    doc.setFont('helvetica', 'bold');
    doc.text('PERFORMANCE SUMMARY', 20, 108);
    
    doc.setDrawColor(59, 130, 246);
    doc.line(20, 111, 95, 111);
    
    // Stats boxes
    const boxWidth = 40;
    const boxHeight = 30;
    const startX = 20;
    const boxY = 118;
    
    // Box 1: Total Events
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(startX, boxY, boxWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.roundedRect(startX, boxY, boxWidth, boxHeight, 2, 2, 'S');
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.setFont('helvetica', 'bold');
    doc.text(String(totalEvents), startX + boxWidth / 2, boxY + 14, { align: 'center' });
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Events', startX + boxWidth / 2, boxY + 24, { align: 'center' });
    
    // Box 2: Participated
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(startX + boxWidth + 5, boxY, boxWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(34, 197, 94);
    doc.roundedRect(startX + boxWidth + 5, boxY, boxWidth, boxHeight, 2, 2, 'S');
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.setFont('helvetica', 'bold');
    doc.text(String(performanceData.participations.length), startX + boxWidth + 5 + boxWidth / 2, boxY + 14, { align: 'center' });
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.text('Participated', startX + boxWidth + 5 + boxWidth / 2, boxY + 24, { align: 'center' });
    
    // Box 3: Activity Marks
    doc.setFillColor(254, 249, 195);
    doc.roundedRect(startX + (boxWidth + 5) * 2, boxY, boxWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(234, 179, 8);
    doc.roundedRect(startX + (boxWidth + 5) * 2, boxY, boxWidth, boxHeight, 2, 2, 'S');
    doc.setFontSize(16);
    doc.setTextColor(161, 98, 7);
    doc.setFont('helvetica', 'bold');
    doc.text(String(performanceData.participationMarks || 0), startX + (boxWidth + 5) * 2 + boxWidth / 2, boxY + 14, { align: 'center' });
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.text('Activity Marks', startX + (boxWidth + 5) * 2 + boxWidth / 2, boxY + 24, { align: 'center' });
    
    // Box 4: Total Marks
    doc.setFillColor(255, 237, 213);
    doc.roundedRect(startX + (boxWidth + 5) * 3, boxY, boxWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(249, 115, 22);
    doc.roundedRect(startX + (boxWidth + 5) * 3, boxY, boxWidth, boxHeight, 2, 2, 'S');
    doc.setFontSize(16);
    doc.setTextColor(234, 88, 12);
    doc.setFont('helvetica', 'bold');
    doc.text(String(performanceData.totalMarks), startX + (boxWidth + 5) * 3 + boxWidth / 2, boxY + 14, { align: 'center' });
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Marks', startX + (boxWidth + 5) * 3 + boxWidth / 2, boxY + 24, { align: 'center' });
    
    // Participation rate bar
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'bold');
    doc.text(`Participation Rate: ${participationRate}%`, 20, 160);
    
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(20, 163, pageWidth - 40, 6, 2, 2, 'F');
    
    const rateColor = participationRate >= 70 ? [34, 197, 94] : participationRate >= 40 ? [59, 130, 246] : [249, 115, 22];
    doc.setFillColor(rateColor[0], rateColor[1], rateColor[2]);
    doc.roundedRect(20, 163, (pageWidth - 40) * (participationRate / 100), 6, 2, 2, 'F');
    
    // Participations Table
    if (performanceData.participations.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(26, 54, 93);
      doc.setFont('helvetica', 'bold');
      doc.text('ACTIVITY PARTICIPATIONS', 20, 182);
      
      doc.setDrawColor(59, 130, 246);
      doc.line(20, 185, 105, 185);
      
      const tableData = performanceData.participations.map((p: any) => [
        p.activityName,
        p.activityDate ? format(new Date(p.activityDate), 'MMM dd, yyyy') : 'N/A',
        p.award,
        String(p.marks || 5)
      ]);
      
      autoTable(doc, {
        startY: 190,
        head: [['Activity', 'Date', 'Award', 'Marks']],
        body: tableData,
        headStyles: { 
          fillColor: [26, 54, 93], 
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [51, 65, 85]
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 70 },
          1: { cellWidth: 35 },
          2: { cellWidth: 40 },
          3: { cellWidth: 25, halign: 'center', fontStyle: 'bold' }
        },
        styles: { 
          cellPadding: 4,
          lineColor: [226, 232, 240],
          lineWidth: 0.1
        },
        didParseCell: function(data: any) {
          if (data.column.index === 3 && data.section === 'body') {
            data.cell.styles.textColor = [234, 88, 12];
          }
        }
      });
    }
    
    // Footer
    const finalY = (doc as any).lastAutoTable?.finalY || 190;
    
    doc.setFillColor(248, 250, 252);
    doc.rect(0, finalY + 10, pageWidth, 20, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')} | SABL Performance Report`, pageWidth / 2, finalY + 20, { align: 'center' });
    
    // Download
    doc.save(`${performanceData.student.name}_Performance_Report.pdf`);
  };

  const getMotivationalQuote = (participationRate: number) => {
    if (participationRate >= 70) {
      return {
        quote: "Outstanding Performance!",
        color: "text-green-600"
      };
    } else if (participationRate >= 40) {
      return {
        quote: "Keep Going!",
        color: "text-blue-600"
      };
    } else {
      return {
        quote: "Participate More!",
        color: "text-orange-600"
      };
    }
  };

  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Student Performance</h1>
            <p className="text-muted-foreground">View your activity participation and marks</p>
          </div>

          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search by PIN Number
              </CardTitle>
              <CardDescription>
                Enter your PIN number to view your performance details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="pin">PIN Number</Label>
                  <Input
                    id="pin"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your PIN (e.g., 21A51A0501)"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Student Details & Performance */}
          {performanceData && (
            <div className="space-y-6">
              {/* Student Info Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Student Details
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">PIN Number</p>
                      <p className="text-lg font-semibold">{performanceData.student.pin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-lg font-semibold">{performanceData.student.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Branch</p>
                      <p className="text-lg font-semibold">{performanceData.student.branch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="text-lg font-semibold">{performanceData.student.year}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart & Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Participation Chart */}
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Participation Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-center">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Participated', value: performanceData.participations.length },
                            { name: 'Not Participated', value: Math.max(0, totalEvents - performanceData.participations.length) }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={2}
                          stroke="hsl(var(--background))"
                        >
                          {[0, 1].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          formatter={(value, entry: any) => (
                            <span className="text-sm text-foreground">{value}: {entry.payload.value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Participation Rate: {totalEvents > 0 ? Math.round((performanceData.participations.length / totalEvents) * 100) : 0}%
                      </p>
                      <div className={`flex items-center justify-center gap-2 ${getMotivationalQuote(totalEvents > 0 ? (performanceData.participations.length / totalEvents) * 100 : 0).color}`}>
                        <Sparkles className="h-4 w-4" />
                        <p className="text-sm font-medium">
                          {getMotivationalQuote(totalEvents > 0 ? (performanceData.participations.length / totalEvents) * 100 : 0).quote}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Performance Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-center">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                        <span className="text-sm font-medium">Total Events</span>
                        <span className="text-2xl font-bold text-primary">{totalEvents}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                        <span className="text-sm font-medium">Participated</span>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">{performanceData.participations.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <span className="text-sm font-medium">Activity Marks</span>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{performanceData.participationMarks || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                        <span className="text-sm font-medium">Extra Marks (Certificates)</span>
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{performanceData.extraMarks || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                        <span className="text-sm font-medium">Total Marks</span>
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{performanceData.totalMarks}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Participations Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Activity Participations
                  </CardTitle>
                  <CardDescription>
                    {performanceData.participations.length} activities participated
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {performanceData.participations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No participations recorded yet
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Activity</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Award</TableHead>
                            <TableHead className="text-right">Marks</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {performanceData.participations.map((participation: any) => (
                            <TableRow key={participation.id}>
                              <TableCell className="font-medium">
                                {participation.activityName}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {participation.activityDate ? 
                                    format(new Date(participation.activityDate), 'MMM dd, yyyy') 
                                    : 'N/A'}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  participation.award === '1st Place' ? 'default' :
                                  participation.award === '2nd Place' ? 'secondary' :
                                  participation.award === '3rd Place' ? 'outline' :
                                  'secondary'
                                }>
                                  {participation.award}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-semibold text-primary">
                                {participation.marks || 5}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
      </div>
    </div>
  );
};

export default StudentPerformance;
