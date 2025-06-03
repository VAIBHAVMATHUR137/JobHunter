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
import { X } from 'lucide-react'

type ConfirmationDialogProps = {
  title: string
  message: string
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmationDialog({ title, message, isOpen, onClose, onConfirm }: ConfirmationDialogProps) {
  const handleYes = () => {
    onConfirm()
    onClose()
  }

  const handleNo = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-0 shadow-2xl [&>button]:hidden">
        {/* Custom close button - only this one will show */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-black hover:text-gray-800 hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="pt-2">
          <DialogTitle className="text-xl font-semibold text-gray-800">{title}</DialogTitle>
          <DialogDescription className="text-black mt-2 leading-relaxed">{message}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleNo}
            className="border-gray-300 text-black hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            No
          </Button>
          <Button onClick={handleYes} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors">
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
