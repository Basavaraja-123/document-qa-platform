"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Upload, File, X } from "lucide-react"
import { mockUploadDocument } from "@/lib/mock-services"

interface FileWithPreview extends File {
  preview?: string
}

export default function UploadPage() {
  const { toast } = useToast()
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files) as FileWithPreview[]
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files) as FileWithPreview[]
      setFiles([...files, ...newFiles])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      await mockUploadDocument(
        files,
        description,
        tags.split(",").map((tag) => tag.trim()),
      )

      toast({
        title: "Upload successful",
        description: `${files.length} file(s) uploaded successfully.`,
      })

      setFiles([])
      setDescription("")
      setTags("")
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Upload Documents</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>Upload documents to be processed and indexed for Q&A.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Drag & drop files here</h3>
              <p className="mt-2 text-sm text-muted-foreground">or click to browse files</p>
              <Button variant="outline" className="mt-4" onClick={() => fileInputRef.current?.click()}>
                Browse Files
              </Button>
              <Input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
              <p className="mt-2 text-xs text-muted-foreground">Supported formats: PDF, DOCX, TXT, CSV, XLSX, PPTX</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Selected Files</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center">
                      <File className="mr-2 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for these documents"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setFiles([])}>
            Clear
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
