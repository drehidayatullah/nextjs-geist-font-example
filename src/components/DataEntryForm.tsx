"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Plus, Minus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Form validation schema
const formSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  noPJB: z.string().min(4, "No. PJB must be at least 4 characters"),
  customerClassification: z.enum(['business', 'government', 'individual']),
  customerName: z.string().min(1, "Customer name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  productType: z.string().min(1, "Product type is required"),
  hpp: z.number().min(0, "HPP must be a positive number"),
  paymentScheme: z.string().min(1, "Payment scheme is required"),
  salesRepresentative: z.string().min(1, "Sales representative is required"),
})

type FormData = z.infer<typeof formSchema>

// Mock data for dropdowns
const productTypeData = {
  'Engine Type A': { product: 'Engine Model X1', mark: 'Mark-A1' },
  'Engine Type B': { product: 'Engine Model X2', mark: 'Mark-B1' },
  'Generator Type A': { product: 'Generator Model G1', mark: 'Mark-G1' },
  'Generator Type B': { product: 'Generator Model G2', mark: 'Mark-G2' },
}

const branchData = {
  'JKTB': ['John Doe', 'Jane Smith', 'Mike Johnson'],
  'BDGB': ['Sarah Wilson', 'David Brown', 'Lisa Davis'],
  'SBYB': ['Tom Anderson', 'Emma Taylor', 'Chris Wilson'],
  'DPSB': ['Alex Johnson', 'Maria Garcia', 'Robert Lee'],
}

const paymentSchemes = ['Cash', 'Credit 30 Days', 'Credit 60 Days', 'Credit 90 Days', 'Installment']

export default function DataEntryForm() {
  const [date, setDate] = useState<Date>()
  const [quantity, setQuantity] = useState(1)
  const [productType, setProductType] = useState('')
  const [branch, setBranch] = useState('')
  const [dynamicFields, setDynamicFields] = useState<Array<{marking: string, serialNumber: string, snEngine: string}>>([
    { marking: '', serialNumber: '', snEngine: '' }
  ])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const watchedNoPJB = watch('noPJB')
  const watchedProductType = watch('productType')

  // Auto-fill branch from No. PJB
  useEffect(() => {
    if (watchedNoPJB && watchedNoPJB.length >= 4) {
      const branchCode = watchedNoPJB.substring(0, 4).toUpperCase()
      setBranch(branchCode)
    }
  }, [watchedNoPJB])

  // Auto-fill product and mark from product type
  useEffect(() => {
    if (watchedProductType && productTypeData[watchedProductType as keyof typeof productTypeData]) {
      setProductType(watchedProductType)
    }
  }, [watchedProductType])

  // Update dynamic fields based on quantity
  useEffect(() => {
    const newFields = Array.from({ length: quantity }, (_, index) => 
      dynamicFields[index] || { marking: '', serialNumber: '', snEngine: '' }
    )
    setDynamicFields(newFields)
  }, [quantity])

  const updateDynamicField = (index: number, field: string, value: string) => {
    const newFields = [...dynamicFields]
    newFields[index] = { ...newFields[index], [field]: value }
    setDynamicFields(newFields)
  }

  const onSubmit = async (data: FormData) => {
    const formData = {
      ...data,
      timeStamp: new Date().toISOString(),
      month: format(data.date, 'MMMM yyyy'),
      branch,
      product: productType ? productTypeData[productType as keyof typeof productTypeData]?.product : '',
      mark: productType ? productTypeData[productType as keyof typeof productTypeData]?.mark : '',
      dynamicFields,
    }

    console.log('Form submitted:', formData)
    // Here you would integrate with Google Sheets API
    alert('Data submitted successfully! (This would be saved to Google Sheets)')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">1</Badge>
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Date Field */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate)
                    if (selectedDate) {
                      setValue('date', selectedDate)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
          </div>

          {/* Month (Auto-filled) */}
          <div className="space-y-2">
            <Label>Month</Label>
            <Input 
              value={date ? format(date, 'MMMM yyyy') : ''} 
              disabled 
              className="bg-gray-50"
            />
          </div>

          {/* No. PJB */}
          <div className="space-y-2">
            <Label htmlFor="noPJB">No. PJB *</Label>
            <Input
              id="noPJB"
              {...register('noPJB')}
              placeholder="Enter PJB number"
              className="uppercase"
            />
            {errors.noPJB && <p className="text-sm text-red-500">{errors.noPJB.message}</p>}
          </div>

          {/* Branch (Auto-filled) */}
          <div className="space-y-2">
            <Label>Branch</Label>
            <Input 
              value={branch} 
              disabled 
              className="bg-gray-50"
              placeholder="Auto-filled from No. PJB"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">2</Badge>
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Classification */}
          <div className="space-y-2">
            <Label htmlFor="customerClassification">Customer Classification *</Label>
            <Select onValueChange={(value) => setValue('customerClassification', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
              </SelectContent>
            </Select>
            {errors.customerClassification && <p className="text-sm text-red-500">{errors.customerClassification.message}</p>}
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              {...register('customerName')}
              placeholder="Enter customer name"
            />
            {errors.customerName && <p className="text-sm text-red-500">{errors.customerName.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Product Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">3</Badge>
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newQty = Math.max(1, quantity - 1)
                  setQuantity(newQty)
                  setValue('quantity', newQty)
                }}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const newQty = Math.max(1, parseInt(e.target.value) || 1)
                  setQuantity(newQty)
                  setValue('quantity', newQty)
                }}
                className="text-center"
                min="1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newQty = quantity + 1
                  setQuantity(newQty)
                  setValue('quantity', newQty)
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Type */}
          <div className="space-y-2">
            <Label htmlFor="productType">Product Type *</Label>
            <Select onValueChange={(value) => setValue('productType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(productTypeData).map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.productType && <p className="text-sm text-red-500">{errors.productType.message}</p>}
          </div>

          {/* Product (Auto-filled) */}
          <div className="space-y-2">
            <Label>Product</Label>
            <Input 
              value={productType ? productTypeData[productType as keyof typeof productTypeData]?.product || '' : ''} 
              disabled 
              className="bg-gray-50"
              placeholder="Auto-filled from Product Type"
            />
          </div>

          {/* Mark (Auto-filled) */}
          <div className="space-y-2">
            <Label>Mark</Label>
            <Input 
              value={productType ? productTypeData[productType as keyof typeof productTypeData]?.mark || '' : ''} 
              disabled 
              className="bg-gray-50"
              placeholder="Auto-filled from Product Type"
            />
          </div>

          {/* HPP */}
          <div className="space-y-2">
            <Label htmlFor="hpp">HPP (Rp) *</Label>
            <Input
              id="hpp"
              type="number"
              {...register('hpp', { valueAsNumber: true })}
              placeholder="Enter price"
              min="0"
            />
            {errors.hpp && <p className="text-sm text-red-500">{errors.hpp.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Sales Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">4</Badge>
            Sales Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Scheme */}
          <div className="space-y-2">
            <Label htmlFor="paymentScheme">Payment Scheme *</Label>
            <Select onValueChange={(value) => setValue('paymentScheme', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment scheme" />
              </SelectTrigger>
              <SelectContent>
                {paymentSchemes.map((scheme) => (
                  <SelectItem key={scheme} value={scheme}>{scheme}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentScheme && <p className="text-sm text-red-500">{errors.paymentScheme.message}</p>}
          </div>

          {/* Sales Representative */}
          <div className="space-y-2">
            <Label htmlFor="salesRepresentative">Sales Representative *</Label>
            <Select 
              onValueChange={(value) => setValue('salesRepresentative', value)}
              disabled={!branch || !branchData[branch as keyof typeof branchData]}
            >
              <SelectTrigger>
                <SelectValue placeholder={branch ? "Select sales representative" : "Enter No. PJB first"} />
              </SelectTrigger>
              <SelectContent>
                {branch && branchData[branch as keyof typeof branchData]?.map((rep) => (
                  <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.salesRepresentative && <p className="text-sm text-red-500">{errors.salesRepresentative.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Fields Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">5</Badge>
            Product Details ({quantity} {quantity === 1 ? 'item' : 'items'})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {dynamicFields.map((field, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-4">Item {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`marking-${index}`}>Marking</Label>
                  <Input
                    id={`marking-${index}`}
                    value={field.marking}
                    onChange={(e) => updateDynamicField(index, 'marking', e.target.value)}
                    placeholder="Enter marking"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`serialNumber-${index}`}>Serial Number</Label>
                  <Input
                    id={`serialNumber-${index}`}
                    value={field.serialNumber}
                    onChange={(e) => updateDynamicField(index, 'serialNumber', e.target.value)}
                    placeholder="Enter serial number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`snEngine-${index}`}>SN ENGINE</Label>
                  <Input
                    id={`snEngine-${index}`}
                    value={field.snEngine}
                    onChange={(e) => updateDynamicField(index, 'snEngine', e.target.value)}
                    placeholder="Enter SN engine"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" size="lg">
          Reset Form
        </Button>
        <Button type="submit" size="lg" className="px-8">
          Submit Data
        </Button>
      </div>
    </form>
  )
}
