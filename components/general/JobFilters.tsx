import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "@radix-ui/react-label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { countryList } from "@/app/utils/countryList";

const jobTypes = ["full-time", "part-time", "contractor", "internship"]

export function JobFilter() {
    return (
        <Card className="col-span-1 h-fit">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-2xl font-semibold">Filters</CardTitle>
                <Button variant="destructive" size="sm" className="h-8">
                    <span>Clear All</span>
                    <XIcon className="size-4"/>
                </Button>
            </CardHeader>

            <Separator className="mb-4" />

            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Label className="text-lg font-semibold">
                        Job Type
                    </Label>

                    <div className="grid grid-cols-2 gap-4">
                        { jobTypes.map((job, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Checkbox id={job} />
                                <Label className="text-sm font-medium" htmlFor={job}>{job}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <Label className="text-lg font-semibold">Location</Label>

                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Worldwide</SelectLabel>
                            <SelectItem value="worldwide">
                              <span>🌍</span>
                              <span className="pl-2">Worldwide / Remote</span>
                            </SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Location</SelectLabel>
                            {countryList.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <span>{country.flagEmoji}</span>
                                <span className="pl-2">{country.name}</span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                        
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}