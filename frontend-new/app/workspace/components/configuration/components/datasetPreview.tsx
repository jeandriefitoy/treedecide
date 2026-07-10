"use client";

import { 
    // useEffect, 
    useState 
} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useTreeStore } from "@/store/useTreeStore";

export default function DatasetPreview() {
    const { dataset } = useTreeStore();
    const [page, setPage] = useState(1);

    const previewData = dataset?.preview || [];
    const columns = dataset?.columns || [];
    const pageSize = 5;
    const totalPages = Math.max(1, Math.ceil(previewData.length / pageSize));

    const paginatedData = previewData.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    // useEffect(() => {
    //     setPage(1);
    // }, [dataset?.session_id]);

    if (!dataset) return null;

    return (
        <div className="flex w-full max-w-5xl flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Dataset Preview</h2>
                    <p className="text-sm text-muted-foreground">
                        Showing sample rows of your dataset
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border shadow-md">
                <Table>
                    <TableHeader className="bg-gray-200">
                        <TableRow>
                            {columns.map((col, index) => (
                                <TableHead key={index} className="py-3 font-semibold text-gray-700">
                                    {col.name}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedData.map((row, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                className={rowIndex % 2 === 1 ? "bg-gray-100" : ""}
                            >
                                {columns.map((col, colIndex) => (
                                    <TableCell key={colIndex} className="py-3">
                                        {String(row[col.name] ?? "-")}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                <div className="flex items-center justify-between px-4 py-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {previewData.length > 0 ? (page - 1) * pageSize + 1 : 0}–
                        {Math.min(page * pageSize, previewData.length)} of {previewData.length} preview rows
                    </p>

                    <Pagination className="w-auto m-0">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page > 1) setPage(page - 1);
                                    }}
                                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }).map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href="#"
                                        isActive={page === index + 1}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(index + 1);
                                        }}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page < totalPages) setPage(page + 1);
                                    }}
                                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}