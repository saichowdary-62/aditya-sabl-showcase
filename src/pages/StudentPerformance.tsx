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
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Performance Report - ${performanceData.student.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1 { color: #1a365d; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          h2 { color: #2d3748; margin-top: 24px; }
          .student-info { background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0; }
          .student-info p { margin: 8px 0; }
          .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 16px 0; }
          .stat-box { background: #edf2f7; padding: 12px; border-radius: 6px; text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: #3b82f6; }
          .stat-label { font-size: 12px; color: #718096; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
          th { background: #3b82f6; color: white; }
          tr:nth-child(even) { background: #f7fafc; }
          .footer { margin-top: 32px; text-align: center; color: #718096; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>Student Performance Report</h1>
        <div class="student-info">
          <p><strong>Name:</strong> ${performanceData.student.name}</p>
          <p><strong>PIN:</strong> ${performanceData.student.pin}</p>
          <p><strong>Branch:</strong> ${performanceData.student.branch}</p>
          <p><strong>Year:</strong> ${performanceData.student.year}</p>
        </div>
        
        <h2>Performance Summary</h2>
        <div class="stats">
          <div class="stat-box">
            <div class="stat-value">${performanceData.participations.length}</div>
            <div class="stat-label">Activities Participated</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${totalEvents}</div>
            <div class="stat-label">Total Events</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${performanceData.participationMarks || 0}</div>
            <div class="stat-label">Activity Marks</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${performanceData.extraMarks || 0}</div>
            <div class="stat-label">Extra Marks (Certificates)</div>
          </div>
          <div class="stat-box" style="grid-column: span 2;">
            <div class="stat-value" style="color: #ed8936;">${performanceData.totalMarks}</div>
            <div class="stat-label">Total Marks</div>
          </div>
        </div>
        
        <h2>Activity Participations</h2>
        ${performanceData.participations.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Date</th>
                <th>Award</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              ${performanceData.participations.map((p: any) => `
                <tr>
                  <td>${p.activityName}</td>
                  <td>${p.activityDate ? format(new Date(p.activityDate), 'MMM dd, yyyy') : 'N/A'}</td>
                  <td>${p.award}</td>
                  <td>${p.marks || 5}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p>No participations recorded yet.</p>'}
        
        <div class="footer">
          <p>Generated on ${format(new Date(), 'MMMM dd, yyyy')}</p>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${performanceData.student.name}_Performance_Report.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
