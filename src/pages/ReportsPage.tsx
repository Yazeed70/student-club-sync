
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/contexts/ApiContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock data for charts
const clubMembershipData = [
  { name: 'Chess Club', members: 45 },
  { name: 'Debate Team', members: 32 },
  { name: 'Photography', members: 28 },
  { name: 'Computer Science', members: 52 },
  { name: 'Drama Club', members: 38 },
];

const eventAttendanceData = [
  { name: 'Chess Tournament', attended: 38, capacity: 50 },
  { name: 'Debate Finals', attended: 65, capacity: 70 },
  { name: 'Photo Exhibition', attended: 42, capacity: 60 },
  { name: 'Coding Hackathon', attended: 85, capacity: 100 },
  { name: 'Theater Play', attended: 120, capacity: 150 },
];

const userTypeData = [
  { name: 'Students', value: 523 },
  { name: 'Club Leaders', value: 76 },
  { name: 'Administrators', value: 12 },
];

const monthlyActivityData = [
  { name: 'Jan', events: 8, memberships: 24 },
  { name: 'Feb', events: 12, memberships: 31 },
  { name: 'Mar', events: 15, memberships: 42 },
  { name: 'Apr', events: 10, memberships: 28 },
  { name: 'May', events: 18, memberships: 36 },
  { name: 'Jun', events: 14, memberships: 30 },
];

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const ReportsPage = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('monthly');
  const [year, setYear] = useState('2023');

  const handleExport = (reportType: string) => {
    toast({
      title: "Report Exported",
      description: `The ${reportType} report has been exported successfully.`,
    });
  };

  if (user?.role !== 'administrator') {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">View and export platform analytics</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select defaultValue={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue={year} onValueChange={setYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleExport('users')}
                  >
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">611</div>
                  <p className="text-xs text-muted-foreground">
                    +43 from last month
                  </p>
                  <div className="h-[200px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {userTypeData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Monthly Activity
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleExport('activity')}
                  >
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">77</div>
                  <p className="text-xs text-muted-foreground">
                    Events and new memberships in June
                  </p>
                  <div className="h-[200px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyActivityData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="events" fill="#8884d8" name="Events" />
                        <Bar dataKey="memberships" fill="#82ca9d" name="New Memberships" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Summary Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Clubs</h3>
                    <p className="text-4xl font-bold">24</p>
                    <p className="text-sm text-muted-foreground">Active clubs</p>
                    <div className="text-sm">
                      <span className="text-green-500 font-medium">+3</span> new this month
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Events</h3>
                    <p className="text-4xl font-bold">67</p>
                    <p className="text-sm text-muted-foreground">Events held</p>
                    <div className="text-sm">
                      <span className="text-green-500 font-medium">3,240</span> total attendees
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Engagement</h3>
                    <p className="text-4xl font-bold">86%</p>
                    <p className="text-sm text-muted-foreground">Active users</p>
                    <div className="text-sm">
                      <span className="text-green-500 font-medium">+12%</span> from last month
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 space-y-2">
                  <Button onClick={() => handleExport('summary')} className="w-full sm:w-auto">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Full Report
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    PDF format, includes all data and visualizations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clubs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Club Membership Report</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport('club membership')}
                >
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={clubMembershipData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 70,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="members" fill="#8884d8" name="Members" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Event Attendance Report</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport('event attendance')}
                >
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={eventAttendanceData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 70,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="attended" fill="#8884d8" name="Attended" />
                      <Bar dataKey="capacity" fill="#82ca9d" name="Capacity" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>User Distribution Report</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExport('user distribution')}
                >
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userTypeData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ReportsPage;
