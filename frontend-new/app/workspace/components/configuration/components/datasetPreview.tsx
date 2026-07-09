"use client";

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
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export interface WeatherDataset {
    outlook: "Sunny" | "Overcast" | "Rain";
    temperature: "Hot" | "Mild" | "Cool";
    humidity: "High" | "Normal";
    wind: "Weak" | "Strong";
    play: "Yes" | "No";
}

const dataset: WeatherDataset[] = [
    {
        outlook: "Sunny",
        temperature: "Hot",
        humidity: "High",
        wind: "Weak",
        play: "No",
    },
    {
        outlook: "Sunny",
        temperature: "Hot",
        humidity: "High",
        wind: "Strong",
        play: "No",
    },
    {
        outlook: "Overcast",
        temperature: "Hot",
        humidity: "High",
        wind: "Weak",
        play: "Yes",
    },
    {
        outlook: "Rain",
        temperature: "Mild",
        humidity: "High",
        wind: "Weak",
        play: "Yes",
    },
    {
        outlook: "Rain",
        temperature: "Cool",
        humidity: "Normal",
        wind: "Weak",
        play: "Yes",
    },
    {
        outlook: "Rain",
        temperature: "Cool",
        humidity: "Normal",
        wind: "Weak",
        play: "Yes",
    },
    {
        outlook: "Rain",
        temperature: "Cool",
        humidity: "Normal",
        wind: "Weak",
        play: "Yes",
    },
];

export default function DatasetPreview() {
    const [page, setPage] = useState(1);

    const pageSize = 5;

    const totalPages = Math.ceil(dataset.length / pageSize);

    const paginatedData = dataset.slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Dataset Preview</h2>

                    <p className="text-sm text-muted-foreground">
                        Showing first 5 rows of your dataset
                    </p>
                </div>

                {/* <p className="text-sm text-muted-foreground">
                    {dataset.length}/{dataset.length} rows
                </p> */}
            </div>

            <div className="overflow-hidden rounded-lg border shadow-md">
                <Table className="">
                    <TableHeader className="bg-gray-200">
                        <TableRow>
                            <TableHead className="py-3">Outlook</TableHead>
                            <TableHead className="py-3">Temperature</TableHead>
                            <TableHead className="py-3">Humidity</TableHead>
                            <TableHead className="py-3">Wind</TableHead>
                            <TableHead className="py-3">Play</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow
                                key={index}
                                className={index % 2 === 1 ? "bg-gray-100" : ""}
                            >
                                <TableCell className="py-3">{row.outlook}</TableCell>
                                <TableCell className="py-3">{row.temperature}</TableCell>
                                <TableCell className="py-3">{row.humidity}</TableCell>
                                <TableCell className="py-3">{row.wind}</TableCell>
                                <TableCell>
                                    <Badge variant={row.play === "Yes" ? "default" : "destructive"}>
                                        {row.play}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-between px-2 py-6">
                    <p className="text-sm text-muted-foreground">
                        Showing {(page - 1) * pageSize + 1}–
                        {Math.min(page * pageSize, dataset.length)} of {dataset.length} rows
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
                                    className={
                                        page === 1
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
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
                                    className={
                                        page === totalPages
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}