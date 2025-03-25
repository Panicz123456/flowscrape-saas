'use client'

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ParamProps } from "@/types/appNode";
import { useId } from "react";

type OptionType = {
  label: string,
  value: string
}

export const SelectParam = ({ param, updateNodeParamValue, value }: ParamProps) => {
  const id = useId()
  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select onValueChange={(value) => updateNodeParamValue(value)} defaultValue={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {param.options.map((options: OptionType) => (
              <SelectItem
                key={options.value}
                value={options.value}
              >
                {options.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}