import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent } from "@/components/ui/select";
import { SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2Icon, CircleAlert, Dot, Play, SendHorizonal } from "lucide-react";


const items = [
    { label: "Select a fruit", value: null },
    { label: "Outlook", value: "apple" },
    { label: "Temperature", value: "banana" },
    { label: "Humidity", value: "blueberry" },
    { label: "Wind", value: "grapes" },
    { label: "PlayTennis", value: "pineapple" },
]

interface TargetColumnProps {
  onNext: () => void;
//   onBack: () => void;
}

export default function TargetColumn({
  onNext,
//   onBack,
}: TargetColumnProps) {
    return (
        <div className="flex flex-col gap-3 w-xl">
            <Card className="p-6 flex flex-col">
                <div className="flex flex-row gap-0 items-center">
                    <div className="flex flex-col items-start gap-1">
                        <h1 className="text-sm font-semibold">
                            Target Column
                        </h1>
                        <p className="text-gray-500">
                            Select the column you want the model to predict.
                        </p>
                    </div>
                </div>

                <Select items={items}>
                    <SelectTrigger className="w-full py-5 shadow-md">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            {items.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Alert className="w-full text-green-500">
                    <CircleAlert />
                    {/* <AlertTitle>Account updated successfully</AlertTitle> */}
                    <AlertDescription className="text-green-500">
                        This column is categorical with 2 unique values: Yes, No.
                    </AlertDescription>
                </Alert>
            </Card>

            <Button variant="default" size={"lg"} className="w-full py-5 rounded-xl gap-4 cursor-pointer" onClick={onNext}>
                <Play />
                Analyze Dataset
            </Button>

            <p className="text-gray-500 text-xs">Algorithm will be selected automatically based on your data.</p>
        </div>
    )
}