'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockUserActivityLogs } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, AlertCircle, CheckCircle, Clock } from 'lucide-react';

type JobStatus = 'completed' | 'processing' | 'failed' | 'queued';

interface IngestionJob {
  id: string;
  name: string;
  status: JobStatus;
  progress: number;
  documentsCount: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export default function IngestionPage() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<IngestionJob[]>(mockUserActivityLogs);

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'completed':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 hover:bg-green-50"
          >
            Completed
          </Badge>
        );
      case 'processing':
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-50"
          >
            Processing
          </Badge>
        );
      case 'failed':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 hover:bg-red-50"
          >
            Failed
          </Badge>
        );
      case 'queued':
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
          >
            Queued
          </Badge>
        );
    }
  };

  const pauseJob = (id: string) => {
    setJobs(
      jobs.map((job) =>
        job.id === id && job.status === 'processing'
          ? { ...job, status: 'queued' }
          : job
      )
    );
    toast({
      title: 'Job paused',
      description: 'The Collection job has been paused.',
    });
  };

  const resumeJob = (id: string) => {
    setJobs(
      jobs.map((job) =>
        job.id === id && job.status === 'queued'
          ? { ...job, status: 'processing' }
          : job
      )
    );
    toast({
      title: 'Job resumed',
      description: 'The Collection job has been resumed.',
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Data Collection Management
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Collection Tasks</CardTitle>
          <CardDescription>
            Monitor and manage document collection jobs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No collection jobs found.
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        {getStatusBadge(job.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-[100px]">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: job.progress + '%' }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{job.documentsCount}</TableCell>
                    <TableCell>{job.startedAt}</TableCell>
                    <TableCell>{job.completedAt || '-'}</TableCell>
                    <TableCell className="text-right">
                      {job.status === 'processing' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => pauseJob(job.id)}
                        >
                          <Pause className="mr-2 h-3 w-3" />
                          Pause
                        </Button>
                      ) : job.status === 'queued' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resumeJob(job.id)}
                        >
                          <Play className="mr-2 h-3 w-3" />
                          Resume
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Collection jobs process documents and prepare them for Q&A.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
