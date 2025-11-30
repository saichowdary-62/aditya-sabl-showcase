import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, User, Award, Calendar, Trophy, TrendingUp, Sparkles } from 'lucide-react';
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

  const COLORS = ['#3b82f6', '#e5e7eb'];

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
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Student Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <div>
                      <p className="text-sm text-muted-foreground">Section</p>
                      <p className="text-lg font-semibold">{performanceData.student.section}</p>
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
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Participated', value: performanceData.participations.length },
                            { name: 'Not Participated', value: Math.max(0, totalEvents - performanceData.participations.length) }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[0, 1].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
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
