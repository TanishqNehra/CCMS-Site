"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Download, Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Employee = {
  id: string
  name: string
  position: string
  hourlyRate: number
  regularHours: number
  overtimeHours: number
  bonus: number
}

interface PaySlipModalProps {
  isOpen: boolean
  onClose: () => void
  employee: Employee
  payPeriod: string
  payDate: string
}

export default function PaySlipModal({ isOpen, onClose, employee, payPeriod, payDate }: PaySlipModalProps) {
  const { toast } = useToast()

  // Calculate pay components
  const regularPay = employee.regularHours * employee.hourlyRate
  const overtimePay = employee.overtimeHours * (employee.hourlyRate * 1.5)
  const grossPay = regularPay + overtimePay + employee.bonus

  // Deductions (simplified for demo)
  const federalTax = grossPay * 0.15
  const stateTax = grossPay * 0.05
  const socialSecurity = grossPay * 0.062
  const medicare = grossPay * 0.0145
  const retirement = grossPay * 0.05
  const healthInsurance = 120

  const totalDeductions = federalTax + stateTax + socialSecurity + medicare + retirement + healthInsurance
  const netPay = grossPay - totalDeductions

  const handlePrint = () => {
    toast({
      title: "Printing pay slip",
      description: `Pay slip for ${employee.name} is being sent to the printer.`,
    })
  }

  const handleDownload = () => {
    toast({
      title: "Downloading pay slip",
      description: `Pay slip for ${employee.name} has been downloaded as PDF.`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pay Slip</DialogTitle>
          <DialogDescription>Pay period: {payPeriod}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">CCCMS Courier Company</h3>
              <p className="text-sm text-muted-foreground">123 Logistics Way</p>
              <p className="text-sm text-muted-foreground">New York, NY 10001</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Pay Date: {payDate}</p>
              <p className="text-sm font-medium">Pay Period: {payPeriod}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Employee Information</h4>
              <p className="text-sm">ID: {employee.id}</p>
              <p className="text-sm">Name: {employee.name}</p>
              <p className="text-sm">Position: {employee.position}</p>
            </div>
            <div>
              <h4 className="font-medium">Payment Method</h4>
              <p className="text-sm">Direct Deposit</p>
              <p className="text-sm">Account: ****6789</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Earnings</h4>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="font-medium">Description</div>
              <div className="font-medium">Hours</div>
              <div className="font-medium">Rate</div>
              <div className="font-medium">Amount</div>

              <div>Regular Pay</div>
              <div>{employee.regularHours}</div>
              <div>${employee.hourlyRate.toFixed(2)}</div>
              <div>${regularPay.toFixed(2)}</div>

              {employee.overtimeHours > 0 && (
                <>
                  <div>Overtime Pay</div>
                  <div>{employee.overtimeHours}</div>
                  <div>${(employee.hourlyRate * 1.5).toFixed(2)}</div>
                  <div>${overtimePay.toFixed(2)}</div>
                </>
              )}

              {employee.bonus > 0 && (
                <>
                  <div>Performance Bonus</div>
                  <div></div>
                  <div></div>
                  <div>${employee.bonus.toFixed(2)}</div>
                </>
              )}

              <div className="col-span-3 font-medium">Gross Pay</div>
              <div className="font-medium">${grossPay.toFixed(2)}</div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Deductions</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Description</div>
              <div className="font-medium">Amount</div>

              <div>Federal Income Tax</div>
              <div>${federalTax.toFixed(2)}</div>

              <div>State Income Tax</div>
              <div>${stateTax.toFixed(2)}</div>

              <div>Social Security</div>
              <div>${socialSecurity.toFixed(2)}</div>

              <div>Medicare</div>
              <div>${medicare.toFixed(2)}</div>

              <div>Retirement Plan</div>
              <div>${retirement.toFixed(2)}</div>

              <div>Health Insurance</div>
              <div>${healthInsurance.toFixed(2)}</div>

              <div className="font-medium">Total Deductions</div>
              <div className="font-medium">${totalDeductions.toFixed(2)}</div>
            </div>
          </div>

          <Separator />

          <div className="bg-muted p-4 rounded-md">
            <div className="grid grid-cols-2 gap-2 text-lg font-bold">
              <div>Net Pay</div>
              <div className="text-right">${netPay.toFixed(2)}</div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>This is a computer-generated document and does not require a signature.</p>
            <p>Please contact HR if you have any questions regarding this pay slip.</p>
          </div>
        </div>

        <DialogFooter>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
