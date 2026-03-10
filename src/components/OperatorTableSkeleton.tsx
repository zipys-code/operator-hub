import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const SKELETON_ROWS = 8;

const OperatorTableSkeleton: React.FC = () => (
  <div dir="rtl" className="px-6 overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-10" />
          <TableHead className="w-10" />
          {Array.from({ length: 7 }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-4 w-20 mr-auto" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: SKELETON_ROWS }).map((_, row) => (
          <TableRow key={row}>
            <TableCell><Skeleton className="h-4 w-4 rounded-full mx-auto" /></TableCell>
            <TableCell><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20 mx-auto" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20 mx-auto" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24 mx-auto" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20 mx-auto" /></TableCell>
            <TableCell><Skeleton className="h-4 w-28 mx-auto" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default OperatorTableSkeleton;
