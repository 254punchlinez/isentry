"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { postsApi } from "@/lib/api"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { PostForm } from "@/components/post-form"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import { SearchBar } from "@/components/search-bar"
import { PostDetailsModal } from "@/components/post-details-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, FileText, User, Plus, Edit, Trash2, Eye } from "lucide-react"

const postSearchFields = [
  { value: "title", label: "Title" },
  { value: "body", label: "Content" },
  { value: "userId", label: "User ID" },
]

export default function PostsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [deletePost, setDeletePost] = useState(null)
  const [viewingPost, setViewingPost] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchField, setSearchField] = useState("title")
  const queryClient = useQueryClient()

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postsApi.getAll().then((res) => res.data),
  })

  const filteredPosts = useMemo(() => {
    if (!posts || !searchTerm) return posts

    return posts.filter((post) => {
      const searchValue = searchTerm.toLowerCase()
      switch (searchField) {
        case "title":
          return post.title.toLowerCase().includes(searchValue)
        case "body":
          return post.body.toLowerCase().includes(searchValue)
        case "userId":
          return post.userId.toString().includes(searchTerm)
        default:
          return post.title.toLowerCase().includes(searchValue)
      }
    })
  }, [posts, searchTerm, searchField])

  const createPostMutation = useMutation({
    mutationFn: (postData) => postsApi.create(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      setShowForm(false)
      toast({
        title: "Success",
        description: "Post created successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      })
    },
  })

  const updatePostMutation = useMutation({
    mutationFn: ({ id, postData }) => postsApi.update(id, postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      setEditingPost(null)
      toast({
        title: "Success",
        description: "Post updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      })
    },
  })

  const deletePostMutation = useMutation({
    mutationFn: (id) => postsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      setDeletePost(null)
      toast({
        title: "Success",
        description: "Post deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      })
    },
  })

  const handleCreatePost = (postData) => {
    createPostMutation.mutate(postData)
  }

  const handleUpdatePost = (postData) => {
    updatePostMutation.mutate({ id: editingPost.id, postData })
  }

  const handleDeletePost = () => {
    if (deletePost) {
      deletePostMutation.mutate(deletePost.id)
    }
  }

  const handleSearch = (term, field) => {
    setSearchTerm(term)
    setSearchField(field)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  if (showForm || editingPost) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavigation />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <PostForm
              post={editingPost}
              onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
              onCancel={() => {
                setShowForm(false)
                setEditingPost(null)
              }}
              isLoading={createPostMutation.isPending || updatePostMutation.isPending}
            />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Posts Management</h1>
                <p className="text-muted-foreground">
                  Manage and view all posts in the system. Data fetched from JSONPlaceholder API.
                </p>
              </div>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Post
              </Button>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <SearchBar
                onSearch={handleSearch}
                onClear={handleClearSearch}
                searchFields={postSearchFields}
                placeholder="Search posts..."
              />
              {searchTerm && (
                <div className="text-sm text-muted-foreground">
                  Found {filteredPosts?.length || 0} post(s) matching "{searchTerm}"
                </div>
              )}
            </div>

            {error && (
              <Card className="mb-6 border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>Error loading posts: {error.message}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 9 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : filteredPosts?.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg leading-tight mb-2">{post.title}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                <User className="h-3 w-3 mr-1" />
                                User {post.userId}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                <FileText className="h-3 w-3 mr-1" />
                                Post {post.id}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{truncateText(post.body)}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewingPost(post)}
                            className="flex-1 gap-2"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPost(post)}
                            className="flex-1 gap-2"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeletePost(post)}
                            className="flex-1 gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>

            {filteredPosts && filteredPosts.length === 0 && !isLoading && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm ? `No posts found matching "${searchTerm}"` : "No posts found."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      <PostDetailsModal post={viewingPost} isOpen={!!viewingPost} onClose={() => setViewingPost(null)} />

      <DeleteConfirmation
        isOpen={!!deletePost}
        onClose={() => setDeletePost(null)}
        onConfirm={handleDeletePost}
        title="Delete Post"
        description={`Are you sure you want to delete "${deletePost?.title}"? This action cannot be undone.`}
        isLoading={deletePostMutation.isPending}
      />
    </div>
  )
}
