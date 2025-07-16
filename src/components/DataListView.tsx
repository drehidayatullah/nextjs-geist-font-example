"use client"

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Search, Filter, Edit, Trash2, Eye, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

// Mock data structure
interface DataEntry {
  id: string
  timeStamp: string
  month: string
  date: string
  branch: string
  noPJB: string
  customerName: string
  customerClassification: string
  quantity: number
  productType: string
  product: string
  mark: string
  hpp: number
  paymentScheme: string
  salesRepresentative: string
  dynamicFields: Array<{
    marking: string
    serialNumber: string
    snEngine: string
  }>
}

// Mock data
const mockData: DataEntry[] = [
  {
    id: '1',
    timeStamp: '2024-01-15T10:30:00Z',
    month: 'January 2024',
    date: '2024-01-15',
    branch: 'JKTB',
    noPJB: 'JKTB001234',
    customerName: 'PT. ABC Manufacturing',
    customerClassification: 'business',
    quantity: 2,
    productType: 'Engine Type A',
    product: 'Engine Model X1',
    mark: 'Mark-A1',
    hpp: 50000000,
    paymentScheme: 'Credit 30 Days',
    salesRepresentative: 'John Doe',
    dynamicFields: [
      { marking: 'MRK001', serialNumber: 'SN001234', snEngine: 'ENG001234' },
      { marking: 'MRK002', serialNumber: 'SN001235', snEngine: 'ENG001235' }
    ]
  },
  {
    id: '2',
    timeStamp: '2024-01-16T14:20:00Z',
    month: 'January 2024',
    date: '2024-01-16',
    branch: 'BDGB',
    noPJB: 'BDGB005678',
    customerName: 'CV. XYZ Trading',
    customerClassification: 'business',
    quantity: 1,
    productType: 'Generator Type A',
    product: 'Generator Model G1',
    mark: 'Mark-G1',
    hpp: 75000000,
    paymentScheme: 'Cash',
    salesRepresentative: 'Sarah Wilson',
    dynamicFields: [
      { marking: 'MRK003', serialNumber: 'SN005678', snEngine: 'ENG005678' }
    ]
  },
  {
    id: '3',
    timeStamp: '2024-01-17T09:15:00Z',
    month: 'January 2024',
    date: '2024-01-17',
    branch: 'SBYB',
    noPJB: 'SBYB009876',
    customerName: 'Dinas Pekerjaan Umum',
    customerClassification: 'government',
    quantity: 3,
    productType: 'Engine Type B',
    product: 'Engine Model X2',
    mark: 'Mark-B1',
    hpp: 45000000,
    paymentScheme: 'Credit 60 Days',
    salesRepresentative: 'Tom Anderson',
    dynamicFields: [
      { marking: 'MRK004', serialNumber: 'SN009876', snEngine: 'ENG009876' },
      { marking: 'MRK005', serialNumber: 'SN009877', snEngine: 'ENG009877' },
      { marking: 'MRK006', serialNumber: 'SN009878', snEngine: 'ENG009878' }
    ]
  }
]

export default function DataListView() {
  const [data, setData] = useState<DataEntry[]>(mockData)
  const [filteredData, setFilteredData] = useState<DataEntry[]>(mockData)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBranch, setFilterBranch] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [filterCustomerType, setFilterCustomerType] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<DataEntry | null>(null)

  // Get unique values for filters
  const uniqueBranches = [...new Set(data.map(item => item.branch))]
  const uniqueMonths = [...new Set(data.map(item => item.month))]
  const uniqueCustomerTypes = [...new Set(data.map(item => item.customerClassification))]

  // Apply filters
  useEffect(() => {
    let filtered = data

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.noPJB.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.salesRepresentative.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterBranch && filterBranch !== 'all') {
      filtered = filtered.filter(item => item.branch === filterBranch)
    }

    if (filterMonth && filterMonth !== 'all') {
      filtered = filtered.filter(item => item.month === filterMonth)
    }

    if (filterCustomerType && filterCustomerType !== 'all') {
      filtered = filtered.filter(item => item.customerClassification === filterCustomerType)
    }

    setFilteredData(filtered)
  }, [data, searchTerm, filterBranch, filterMonth, filterCustomerType])

  const clearFilters = () => {
    setSearchTerm('')
    setFilterBranch('all')
    setFilterMonth('all')
    setFilterCustomerType('all')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleEdit = (entry: DataEntry) => {
    // This would open an edit form - for now just show alert
    alert(`Edit functionality would open for entry: ${entry.noPJB}`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setData(data.filter(item => item.id !== id))
      alert('Entry deleted successfully!')
    }
  }

  const exportToCSV = () => {
    // Simple CSV export functionality
    const headers = [
      'Time Stamp', 'Month', 'Date', 'Branch', 'No. PJB', 'Customer Name',
      'Customer Classification', 'Quantity', 'Product Type', 'Product', 'Mark',
      'HPP (Rp)', 'Payment Scheme', 'Sales Representative'
    ]

    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => [
        row.timeStamp,
        row.month,
        row.date,
        row.branch,
        row.noPJB,
        `"${row.customerName}"`,
        row.customerClassification,
        row.quantity,
        `"${row.productType}"`,
        `"${row.product}"`,
        `"${row.mark}"`,
        row.hpp,
        `"${row.paymentScheme}"`,
        `"${row.salesRepresentative}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-export-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by customer, PJB, product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Branch Filter */}
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={filterBranch} onValueChange={setFilterBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All branches</SelectItem>
                  {uniqueBranches.map(branch => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Month Filter */}
            <div className="space-y-2">
              <Label>Month</Label>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="All months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All months</SelectItem>
                  {uniqueMonths.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Customer Type Filter */}
            <div className="space-y-2">
              <Label>Customer Type</Label>
              <Select value={filterCustomerType} onValueChange={setFilterCustomerType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {uniqueCustomerTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Badge variant="secondary">
                {filteredData.length} of {data.length} entries
              </Badge>
            </div>
            <Button onClick={exportToCSV} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>No. PJB</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>HPP</TableHead>
                  <TableHead>Sales Rep</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {format(new Date(entry.date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.branch}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {entry.noPJB}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{entry.customerName}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {entry.customerClassification}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{entry.productType}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{entry.quantity}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(entry.hpp)}</TableCell>
                    <TableCell>{entry.salesRepresentative}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedEntry(entry)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Entry Details - {entry.noPJB}</DialogTitle>
                              <DialogDescription>
                                Complete information for this data entry
                              </DialogDescription>
                            </DialogHeader>
                            {selectedEntry && (
                              <div className="space-y-6">
                                {/* Basic Info */}
                                <div>
                                  <h4 className="font-semibold mb-3">Basic Information</h4>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Time Stamp:</span>
                                      <p>{format(new Date(selectedEntry.timeStamp), 'PPpp')}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Month:</span>
                                      <p>{selectedEntry.month}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Date:</span>
                                      <p>{format(new Date(selectedEntry.date), 'PPP')}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Branch:</span>
                                      <p>{selectedEntry.branch}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">No. PJB:</span>
                                      <p>{selectedEntry.noPJB}</p>
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                {/* Customer Info */}
                                <div>
                                  <h4 className="font-semibold mb-3">Customer Information</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Customer Name:</span>
                                      <p>{selectedEntry.customerName}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Classification:</span>
                                      <p className="capitalize">{selectedEntry.customerClassification}</p>
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                {/* Product Info */}
                                <div>
                                  <h4 className="font-semibold mb-3">Product Information</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Quantity:</span>
                                      <p>{selectedEntry.quantity}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Product Type:</span>
                                      <p>{selectedEntry.productType}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Product:</span>
                                      <p>{selectedEntry.product}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Mark:</span>
                                      <p>{selectedEntry.mark}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">HPP:</span>
                                      <p>{formatCurrency(selectedEntry.hpp)}</p>
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                {/* Sales Info */}
                                <div>
                                  <h4 className="font-semibold mb-3">Sales Information</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Payment Scheme:</span>
                                      <p>{selectedEntry.paymentScheme}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Sales Representative:</span>
                                      <p>{selectedEntry.salesRepresentative}</p>
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                {/* Dynamic Fields */}
                                <div>
                                  <h4 className="font-semibold mb-3">Product Details</h4>
                                  <div className="space-y-4">
                                    {selectedEntry.dynamicFields.map((field, index) => (
                                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                        <h5 className="font-medium mb-2">Item {index + 1}</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                          <div>
                                            <span className="font-medium">Marking:</span>
                                            <p>{field.marking}</p>
                                          </div>
                                          <div>
                                            <span className="font-medium">Serial Number:</span>
                                            <p>{field.serialNumber}</p>
                                          </div>
                                          <div>
                                            <span className="font-medium">SN ENGINE:</span>
                                            <p>{field.snEngine}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(entry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No data entries found</p>
              <p className="text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
