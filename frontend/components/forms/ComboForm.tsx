"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, Package } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Switch } from "@/components/ui/Switch"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import { OutletSelect } from "../ui/OutletSelect"
import { comboFormSchema, ComboFormSchema } from "@/lib/validations/combo"
import { ComboFormData } from "@/types/combo"

interface ComboFormProps {
  onSuccess?: () => void
  initialData?: Partial<ComboFormData>
}

export function ComboForm({ onSuccess, initialData }: ComboFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ComboFormSchema>({
    resolver: zodResolver(comboFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || 0,
      is_active: initialData?.is_active ?? true,
      outlet_id: initialData?.outlet_id || 0,
      items: initialData?.items || [{ product_id: 0, qty: 1 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const onSubmit = async (data: ComboFormSchema) => {
    setIsSubmitting(true)

    try {
      // This would be your API call to create/update the combo
      console.log("Form data:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message or handle response
      alert("Combo saved successfully!")

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error saving combo:", error)
      alert("Error saving combo. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addComboItem = () => {
    append({ product_id: 0, qty: 1 })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold leading-none tracking-tight mb-6">
        Combo Information
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-0">
            {/* Left Column */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Combo Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter combo name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="outlet_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outlet *</FormLabel>
                    <OutletSelect
                      value={field.value?.toString()}
                      onChange={(value) => field.onChange(Number(value))}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div className="flex items-center mb-4 gap-4">
                <FormItem inline>
                  <FormField
                    name="is_active"
                    render={({ field }) => (
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    )}
                  />
                </FormItem>
                <FormLabel>Active Combo</FormLabel>
              </div>
            </div>
          </div>

          {/* Combo Items Section */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium">Combo Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addComboItem}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        Item {index + 1}
                      </span>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.product_id`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product *</FormLabel>
                          <Select
                            value={field.value ? field.value.toString() : ""}
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">
                                Arabica Coffee Beans
                              </SelectItem>
                              <SelectItem value="2">
                                Robusta Coffee Beans
                              </SelectItem>
                              <SelectItem value="3">
                                Chocolate Croissant
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.variant_id`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Variant</FormLabel>
                          <Select
                            value={field.value ? field.value.toString() : ""}
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select variant" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Small</SelectItem>
                              <SelectItem value="2">Medium</SelectItem>
                              <SelectItem value="3">Large</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.qty`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1"
                              min="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Combo"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
