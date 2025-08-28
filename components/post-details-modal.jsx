"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, User, Calendar } from "lucide-react"

export function PostDetailsModal({ post, isOpen, onClose }) {
  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl leading-tight mb-2">{post.title}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  <User className="h-3 w-3 mr-1" />
                  User {post.userId}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <FileText className="h-3 w-3 mr-1" />
                  Post {post.id}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Published</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{post.body.length} characters</span>
            </div>
          </div>

          <Separator />

          {/* Post Content */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content
            </h3>
            <div className="prose prose-sm max-w-none">
              <div className="p-6 bg-muted/30 rounded-lg border-l-4 border-primary">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.body}</p>
              </div>
            </div>
          </div>

          {/* Post Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">{post.body.split(" ").length}</div>
              <div className="text-sm text-muted-foreground">Words</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">{post.body.split(".").length - 1}</div>
              <div className="text-sm text-muted-foreground">Sentences</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">{Math.ceil(post.body.split(" ").length / 200)}</div>
              <div className="text-sm text-muted-foreground">Min Read</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
